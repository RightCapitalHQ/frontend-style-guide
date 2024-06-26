import { basename } from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { isNodeOfType } from '@typescript-eslint/utils/ast-utils';

import { createRule } from '../../helpers/create-rule';

export const jsxNoUnusedExpressionsRule = createRule({
  name: basename(__dirname),
  meta: {
    type: 'problem',
    schema: [],
    docs: {
      description: 'Disallow unused JSX expressions',
    },
    messages: {
      unusedExpression: 'Expected an assignment instead saw an JSX expression',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ExpressionStatement(node) {
        if (isNodeOfType(AST_NODE_TYPES.JSXElement)(node.expression)) {
          context.report({
            node,
            messageId: 'unusedExpression',
          });
        }
      },
    };
  },
});
