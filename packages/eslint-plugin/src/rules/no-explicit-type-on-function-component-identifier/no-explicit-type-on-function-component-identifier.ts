import { basename } from 'node:path';

import {
  AST_NODE_TYPES,
  type TSESLint,
  type TSESTree,
} from '@typescript-eslint/utils';
import {
  isNodeOfType,
  isNodeOfTypes,
} from '@typescript-eslint/utils/ast-utils';

import { createRule } from '../../helpers/create-rule';

const isFunctionComponentName = (name: string) => /^[A-Z]/.test(name);

const isFunctionComponentVariableDeclearator = (
  declarator: TSESTree.VariableDeclarator,
): boolean =>
  isNodeOfType(AST_NODE_TYPES.Identifier)(declarator.id) &&
  isFunctionComponentName(declarator.id.name) &&
  isNodeOfTypes([
    AST_NODE_TYPES.ArrowFunctionExpression,
    AST_NODE_TYPES.FunctionExpression,
  ])(declarator.init);

const getTypeNameFromVariableDeclarator = (
  declarator: TSESTree.VariableDeclarator,
  context: Readonly<
    TSESLint.RuleContext<'avoidExplicitFunctionComponentType', []>
  >,
): string | undefined => {
  if (
    isNodeOfType(AST_NODE_TYPES.TSTypeAnnotation)(
      declarator.id.typeAnnotation,
    ) &&
    isNodeOfType(AST_NODE_TYPES.TSTypeReference)(
      declarator.id.typeAnnotation.typeAnnotation,
    )
  ) {
    // let a: TypeName ----> TypeName
    if (
      isNodeOfType(AST_NODE_TYPES.Identifier)(
        declarator.id.typeAnnotation.typeAnnotation.typeName,
      )
    ) {
      return declarator.id.typeAnnotation.typeAnnotation.typeName.name;
    }

    // let a: TypeName<T> ----> TypeName
    if (
      isNodeOfType(AST_NODE_TYPES.TSQualifiedName)(
        declarator.id.typeAnnotation.typeAnnotation.typeName,
      )
    ) {
      return context.sourceCode.getText(
        declarator.id.typeAnnotation.typeAnnotation.typeName,
      );
    }
  }

  return undefined;
};

const getTypeArgumentsTextFromVariableDeclearator = (
  declarator: TSESTree.VariableDeclarator,
  context: Readonly<
    TSESLint.RuleContext<'avoidExplicitFunctionComponentType', []>
  >,
): string[] | undefined => {
  if (
    isNodeOfType(AST_NODE_TYPES.TSTypeAnnotation)(
      declarator.id.typeAnnotation,
    ) &&
    isNodeOfType(AST_NODE_TYPES.TSTypeReference)(
      declarator.id.typeAnnotation.typeAnnotation,
    ) &&
    declarator.id.typeAnnotation.typeAnnotation.typeArguments &&
    declarator.id.typeAnnotation.typeAnnotation.typeArguments.params.length > 0
  ) {
    const typeArgumentsNode =
      declarator.id.typeAnnotation.typeAnnotation.typeArguments;
    // let a: TypeName<T1, T2> ----> ["T1", "T2"]
    return typeArgumentsNode.params.map((param) =>
      context.sourceCode.getText(param),
    );
  }

  return undefined;
};

export const disallowedTypeNames = [
  'FC',
  'React.FC',
  'FunctionComponent',
  'React.FunctionComponent',
  'ComponentClass',
  'React.ComponentClass',
  'ComponentType',
  'React.ComponentType',
];

export const noExplicitTypeOnFunctionComponentIdentifierRule = createRule({
  name: basename(__dirname),
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        'Disallow explicitly specifying type for function component identifier. (This rule requires `typescript-eslint`)',
    },
    schema: [],
    messages: {
      avoidExplicitFunctionComponentType:
        'Avoid explicitly specifying type for function component identifier. Specify the type of the props instead.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      VariableDeclaration(node) {
        for (const declarator of node.declarations) {
          if (isFunctionComponentVariableDeclearator(declarator)) {
            const typeName = getTypeNameFromVariableDeclarator(
              declarator,
              context,
            );
            const typeArguments = getTypeArgumentsTextFromVariableDeclearator(
              declarator,
              context,
            );
            if (typeName && disallowedTypeNames.includes(typeName)) {
              context.report({
                node: declarator.id,
                messageId: 'avoidExplicitFunctionComponentType',
                fix(fixer) {
                  if (
                    typeArguments?.length === 1 &&
                    // the right side is an (arrow) function expression
                    isNodeOfTypes([
                      AST_NODE_TYPES.ArrowFunctionExpression,
                      AST_NODE_TYPES.FunctionExpression,
                    ])(declarator.init) &&
                    // only one parameter
                    declarator.init.params.length === 1 &&
                    isNodeOfTypes([
                      AST_NODE_TYPES.Identifier,
                      AST_NODE_TYPES.ObjectPattern,
                    ])(declarator.init.params[0]) &&
                    // the parameter doesn't have type annotation
                    !declarator.init.params[0].typeAnnotation
                  ) {
                    const propType = typeArguments[0];
                    return [
                      // `typeName` is a string means that the type annotation exists.
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      fixer.remove(declarator.id.typeAnnotation!),
                      fixer.insertTextAfter(
                        declarator.init.params[0],
                        `: ${propType}`,
                      ),
                    ];
                  }

                  // `typeName` is a string means that the type annotation exists.
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  return fixer.remove(declarator.id.typeAnnotation!);
                },
              });
            }
          }
        }
      },
    };
  },
});
