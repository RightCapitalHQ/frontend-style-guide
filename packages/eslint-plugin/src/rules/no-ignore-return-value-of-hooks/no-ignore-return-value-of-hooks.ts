import type { Rule } from 'eslint';

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

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent ignoring return value of React hooks.',
    },
    schema: [],
    messages: {
      ignoreReturnValue:
        'The return value of the hook must be assigned to a variable or returned from a function.',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type === 'Identifier' &&
          hooksToCheck.includes(node.callee.name) &&
          node.parent.type === 'ExpressionStatement'
        ) {
          context.report({
            node,
            messageId: 'ignoreReturnValue',
          });
        }
      },
    };
  },
};

export default rule;
