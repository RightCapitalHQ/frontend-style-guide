import { basename } from 'node:path';

import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';
import {
  isNodeOfType,
  isNodeOfTypes,
} from '@typescript-eslint/utils/ast-utils';

import { isCallOf } from '../../helpers/ast/function/is-call-of';
import { createRule } from '../../helpers/create-rule';

// https://react.dev/reference/react/hooks
// https://react.dev/reference/react-dom/hooks
const hooksToCheck = [
  'useActionState',
  'useCallback',
  'useContext',
  'useDeferredValue',
  'useId',
  'useMemo',
  'useOptimistic',
  'useReducer',
  'useRef',
  'useState',
  'useSyncExternalStore',
  'useTransition',
  'useFormStatus',
];

const getParentSkippingMemberExpressionChains = (
  node: TSESTree.Node,
): TSESTree.Node => {
  const { parent } = node;
  if (!parent) {
    return node;
  }
  if (
    isNodeOfTypes([
      AST_NODE_TYPES.MemberExpression,
      AST_NODE_TYPES.ChainExpression,
    ])(parent)
  ) {
    return getParentSkippingMemberExpressionChains(parent);
  }
  return parent;
};

export const noIgnoreReturnValueOfReactHooksRule = createRule({
  name: basename(__dirname),
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow ignoring return value of React hooks.',
    },
    schema: [],
    messages: {
      ignoreReturnValue:
        'The return value of the hook must be assigned to a variable or returned from a custom hook.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (isCallOf(node, hooksToCheck)) {
          const parentNode = getParentSkippingMemberExpressionChains(node);
          if (isNodeOfType(AST_NODE_TYPES.ExpressionStatement)(parentNode)) {
            context.report({
              node,
              messageId: 'ignoreReturnValue',
            });
          }
        }
      },
    };
  },
});
