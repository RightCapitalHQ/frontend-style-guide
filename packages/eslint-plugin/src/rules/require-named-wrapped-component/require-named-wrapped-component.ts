import { basename } from 'node:path';

import {
  AST_NODE_TYPES,
  type TSESLint,
  type TSESTree,
} from '@typescript-eslint/utils';
import type { JSONSchema4 } from '@typescript-eslint/utils/json-schema';
import { z } from 'zod';

import { isAnonymousFunction } from '../../helpers/ast/function/is-anonymous-function';
import { createRule } from '../../helpers/create-rule';

const optionSchema = z.object({
  hocNames: z.array(z.string()),
  includeReactHocs: z.boolean().optional(),
});

type Options = [z.infer<typeof optionSchema>];
type MessageIds = 'requireNamedComponent';

/**
 * Gets the callee name from a CallExpression.
 * Handles both simple identifiers (observer) and member expressions (React.forwardRef).
 */
function getCalleeName(callee: TSESTree.Expression): string | null {
  if (callee.type === AST_NODE_TYPES.Identifier) {
    return callee.name;
  }
  if (
    callee.type === AST_NODE_TYPES.MemberExpression &&
    callee.object.type === AST_NODE_TYPES.Identifier &&
    callee.property.type === AST_NODE_TYPES.Identifier
  ) {
    return `${callee.object.name}.${callee.property.name}`;
  }
  return null;
}

/**
 * Gets the object name from a member expression callee.
 * For example, for `TextButtonVariantContext.createComponent()`, returns 'TextButtonVariantContext'.
 */
function getCalleeObjectName(callee: TSESTree.Expression): string | null {
  if (
    callee.type === AST_NODE_TYPES.MemberExpression &&
    callee.object.type === AST_NODE_TYPES.Identifier
  ) {
    return callee.object.name;
  }
  return null;
}

/**
 * Gets the property name from a member expression callee.
 * For example, for `VariantContext.createComponent()`, returns 'createComponent'.
 */
function getCalleePropertyName(callee: TSESTree.Expression): string | null {
  if (
    callee.type === AST_NODE_TYPES.MemberExpression &&
    callee.property.type === AST_NODE_TYPES.Identifier
  ) {
    return callee.property.name;
  }
  return null;
}

/**
 * React's built-in HOCs that handle display names automatically.
 * By default, these are exceptions (anonymous wrapped components allowed).
 * @see https://legacy.reactjs.org/docs/higher-order-components.html
 */
export const REACT_HOCS = new Set(['forwardRef', 'memo']);

/**
 * Checks if the callee is a React HOC (forwardRef, memo).
 */
function isExceptionCallee(callee: TSESTree.Expression): boolean {
  if (callee.type === AST_NODE_TYPES.Identifier) {
    return REACT_HOCS.has(callee.name);
  }
  if (
    callee.type === AST_NODE_TYPES.MemberExpression &&
    callee.property.type === AST_NODE_TYPES.Identifier
  ) {
    return REACT_HOCS.has(callee.property.name);
  }
  return false;
}

/**
 * Gets the variable name from the parent VariableDeclarator if available.
 * Used to determine the name for the auto-fix.
 */
function getVariableName(node: TSESTree.CallExpression): string | null {
  const { parent } = node;
  if (
    parent?.type === AST_NODE_TYPES.VariableDeclarator &&
    parent.id.type === AST_NODE_TYPES.Identifier
  ) {
    return parent.id.name;
  }
  return null;
}

/**
 * Generates the fix for an anonymous function.
 * Converts arrow functions and anonymous function expressions to named function expressions.
 */
function generateFix(
  fixer: TSESLint.RuleFixer,
  sourceCode: Readonly<TSESLint.SourceCode>,
  funcNode: TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression,
  variableName: string,
): TSESLint.RuleFix | null {
  if (funcNode.type === AST_NODE_TYPES.ArrowFunctionExpression) {
    // Arrow function: (props) => { ... } or props => expr
    // Use AST param ranges to avoid confusing body parentheses as parameter parentheses.
    let paramsText = '';
    if (funcNode.params.length > 0) {
      const firstParam = funcNode.params[0];
      const lastParam = funcNode.params[funcNode.params.length - 1];
      const tokenBeforeFirstParam = sourceCode.getTokenBefore(firstParam);
      const tokenAfterLastParam = sourceCode.getTokenAfter(lastParam);

      if (
        tokenBeforeFirstParam?.value === '(' &&
        tokenAfterLastParam?.value === ')'
      ) {
        // Keep original formatting/comments between parentheses.
        paramsText = sourceCode.text.slice(
          tokenBeforeFirstParam.range[1],
          tokenAfterLastParam.range[0],
        );
      } else {
        // Single parameter without parentheses (e.g., props => <div/>)
        paramsText = funcNode.params
          .map((param) => sourceCode.getText(param))
          .join(', ');
      }
    }
    const bodyText = sourceCode.getText(funcNode.body);

    // Preserve type parameters (e.g., <T extends object>)
    const typeParamsText = funcNode.typeParameters
      ? sourceCode.getText(funcNode.typeParameters)
      : '';

    // Preserve return type annotation (e.g., : JSX.Element)
    const returnTypeText = funcNode.returnType
      ? sourceCode.getText(funcNode.returnType)
      : '';

    let newBody: string;
    if (funcNode.body.type === AST_NODE_TYPES.BlockStatement) {
      // Body is already a block: { ... }
      newBody = bodyText;
    } else {
      // Body is an expression: need to wrap in { return ...; }
      newBody = `{ return ${bodyText}; }`;
    }

    const asyncPrefix = funcNode.async ? 'async ' : '';
    const replacement = `${asyncPrefix}function ${variableName}${typeParamsText}(${paramsText})${returnTypeText} ${newBody}`;

    return fixer.replaceText(funcNode, replacement);
  }

  if (funcNode.type === AST_NODE_TYPES.FunctionExpression) {
    // Anonymous function expression: function() { ... } or function <T>() { ... }
    // Insert the name after 'function' keyword (before any type parameters)
    const tokens = sourceCode.getTokens(funcNode);
    const functionTokenIndex = tokens.findIndex((t) => t.value === 'function');
    if (functionTokenIndex === -1) {
      return null;
    }

    const functionToken = tokens[functionTokenIndex];
    const nextToken = tokens[functionTokenIndex + 1];
    if (!nextToken) {
      return null;
    }

    // Replace the range between 'function' and the next token (type params or paren)
    // with the name, handling any existing whitespace
    return fixer.replaceTextRange(
      [functionToken.range[1], nextToken.range[0]],
      ` ${variableName}`,
    );
  }

  return null;
}

/**
 * Require wrapped components passed to HOCs to be named functions.
 *
 * React-related ESLint rules determine whether a function is a React component
 * by checking the function name. When passing anonymous inline functions (wrapped
 * components) to HOCs, these rules fail to recognize them as components.
 *
 * @see https://legacy.reactjs.org/docs/higher-order-components.html
 *
 * @example
 * // ❌ Invalid - anonymous arrow function
 * const EnhancedButton = observer(() => <button>Click</button>);
 *
 * // ✅ Valid - named function expression
 * const EnhancedButton = observer(function EnhancedButton() {
 *   return <button>Click</button>;
 * });
 *
 * // ✅ Valid - reference to named component
 * const EnhancedButtonBase = () => <button>Click</button>;
 * const EnhancedButton = observer(EnhancedButtonBase);
 *
 * // ✅ Valid - forwardRef exception (unless includeReactHocs is true)
 * const EnhancedButton = forwardRef((props, ref) => <button ref={ref}>Click</button>);
 *
 * // With { includeReactHocs: true }, forwardRef/memo also require named components:
 * // ❌ Invalid
 * const EnhancedButton = forwardRef((props, ref) => <button ref={ref}>Click</button>);
 * // ✅ Valid
 * const EnhancedButton = forwardRef(function EnhancedButton(props, ref) {
 *   return <button ref={ref}>Click</button>;
 * });
 */
export const requireNamedWrappedComponentRule = createRule<Options, MessageIds>(
  {
    name: basename(__dirname),
    meta: {
      docs: {
        description:
          'Require wrapped components passed to HOCs to be named functions',
      },
      messages: {
        requireNamedComponent:
          "Wrapped component passed to '{{hocName}}' must be a named function. Use a named function expression or define the component separately.",
      },
      type: 'suggestion',
      fixable: 'code',
      schema: [
        z.toJSONSchema(optionSchema, { target: 'draft-4' }) as JSONSchema4,
      ],
      defaultOptions: [{ hocNames: [], includeReactHocs: false }],
    },
    defaultOptions: [{ hocNames: [], includeReactHocs: false }],
    create(context) {
      const { hocNames: hocNamesArray, includeReactHocs = false } =
        context.options[0];
      const hocNames = new Set(hocNamesArray);

      return {
        CallExpression(node): void {
          const calleeName = getCalleeName(node.callee);
          const calleeObjectName = getCalleeObjectName(node.callee);
          const calleePropertyName = getCalleePropertyName(node.callee);

          // Check if explicitly configured - takes precedence over React HOC exceptions
          // Matches:
          // 1. Exact name (e.g., 'observer' or 'React.forwardRef')
          // 2. Object name (e.g., 'VariantContext' matches 'VariantContext.createComponent')
          // 3. Property name (e.g., 'createComponent' matches 'AnyContext.createComponent')
          const isExplicitlyConfigured =
            (calleeName !== null && hocNames.has(calleeName)) ||
            (calleeObjectName !== null && hocNames.has(calleeObjectName)) ||
            (calleePropertyName !== null && hocNames.has(calleePropertyName));
          const isReactHoc = isExceptionCallee(node.callee);

          // Skip React HOCs (forwardRef, memo) ONLY if not explicitly configured
          if (!includeReactHocs && isReactHoc && !isExplicitlyConfigured) {
            return;
          }

          // Skip if not a configured HOC (and not a React HOC with includeReactHocs)
          if (!isExplicitlyConfigured && !(includeReactHocs && isReactHoc)) {
            return;
          }

          // Check the first argument
          const firstArg = node.arguments[0];
          if (!firstArg) {
            return;
          }

          // If the first argument is a call expression, check if it's a React HOC
          // e.g., observer(forwardRef(() => ...)) - the forwardRef call is a React HOC
          if (firstArg.type === AST_NODE_TYPES.CallExpression) {
            if (!includeReactHocs && isExceptionCallee(firstArg.callee)) {
              return;
            }
          }

          // Check if the first argument is an anonymous function
          if (!isAnonymousFunction(firstArg)) {
            return;
          }

          const variableName = getVariableName(node);

          context.report({
            node: firstArg,
            messageId: 'requireNamedComponent',
            data: {
              hocName: calleeName ?? calleeObjectName ?? calleePropertyName,
            },
            fix: variableName
              ? (fixer) =>
                  generateFix(fixer, context.sourceCode, firstArg, variableName)
              : undefined,
          });
        },
      };
    },
  },
);
