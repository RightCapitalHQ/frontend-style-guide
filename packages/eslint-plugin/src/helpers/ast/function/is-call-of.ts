import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';
import { isNodeOfType } from '@typescript-eslint/utils/ast-utils';

type Predicate = string | string[] | ((id: string) => boolean);

const matchCalleeName = (predicate: Predicate, name: string) => {
  if (typeof predicate === 'function') {
    return predicate(name);
  }
  if (Array.isArray(predicate)) {
    return predicate.includes(name);
  }
  return predicate === name;
};

export function isCallOf(
  node: TSESTree.Node,
  predicate: Predicate,
): node is TSESTree.CallExpression {
  return (
    isNodeOfType(AST_NODE_TYPES.CallExpression)(node) &&
    isNodeOfType(AST_NODE_TYPES.Identifier)(node.callee) &&
    matchCalleeName(predicate, node.callee.name)
  );
}
