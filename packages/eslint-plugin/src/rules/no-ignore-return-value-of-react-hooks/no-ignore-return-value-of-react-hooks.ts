import { basename } from 'path';
import type { Rule } from 'eslint';
import { isCallOf } from '../../helpers/ast/function/is-call-of';
import { getDocumentUrl } from '../../helpers/get-document-url';

// https://react.dev/reference/react/hooks
// https://react.dev/reference/react-dom/hooks
const hooksToCheck = [
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
  'useFormState',
  'useFormStatus',
];

const getParentSkippingMemberExpressionChains = (
  node: Rule.Node,
): Rule.Node => {
  const { parent } = node;
  if (parent.type === 'MemberExpression' || parent.type === 'ChainExpression') {
    return getParentSkippingMemberExpressionChains(parent);
  }
  return parent;
};

export const noIgnoreReturnValueOfReactHooksRule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow ignoring return value of React hooks.',
      url: getDocumentUrl(basename(__dirname)),
    },
    schema: [],
    messages: {
      ignoreReturnValue:
        'The return value of the hook must be assigned to a variable or returned from a custom hook.',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        if (isCallOf(node, hooksToCheck)) {
          const parentNode = getParentSkippingMemberExpressionChains(node);
          if (parentNode.type === 'ExpressionStatement') {
            context.report({
              node,
              messageId: 'ignoreReturnValue',
            });
          }
        }
      },
    };
  },
};
