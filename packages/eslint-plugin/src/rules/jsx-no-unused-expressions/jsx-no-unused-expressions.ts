import { basename } from 'node:path';

import type { Rule } from 'eslint';

import { getDocumentUrl } from '../../helpers/get-document-url';

export const jsxNoUnusedExpressionsRule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow unused JSX expressions',
      url: getDocumentUrl(basename(__dirname)),
    },
    schema: [],
    messages: {
      unusedExpression: 'Expected an assignment instead saw an JSX expression',
    },
  },
  create(context) {
    return {
      ExpressionStatement(node) {
        // @ts-expect-error The type is missing `JSXElement` type.
        if (node.expression.type === 'JSXElement') {
          context.report({
            node,
            messageId: 'unusedExpression',
          });
        }
      },
    };
  },
};
