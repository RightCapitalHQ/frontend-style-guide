import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevents unassigned or non-returned JSX elements',
    },
    schema: [],
    messages: {
      uselessElements:
        'JSX elements must be assigned to a variable or returned from a function.',
    },
  },
  create(context) {
    return {
      ExpressionStatement(node) {
        // @ts-expect-error The type is missing `ExpressionStatement` type.
        if (node.expression.type === 'JSXElement') {
          context.report({
            node,
            messageId: 'uselessElements',
          });
        }
      },
    };
  },
};

export default rule;
