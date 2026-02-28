import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

/**
 * Checks if a function node is anonymous (arrow function or unnamed function expression).
 */
export function isAnonymousFunction(
  node: TSESTree.Node,
): node is TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression {
  if (node.type === AST_NODE_TYPES.ArrowFunctionExpression) {
    return true;
  }
  if (node.type === AST_NODE_TYPES.FunctionExpression && node.id === null) {
    return true;
  }
  return false;
}
