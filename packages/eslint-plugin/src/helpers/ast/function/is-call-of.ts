import type { Rule } from 'eslint';

type IESLintCallExpressionNode = Extract<Rule.Node, { type: 'CallExpression' }>;
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
  node: Rule.Node,
  predicate: Predicate,
): node is IESLintCallExpressionNode {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    matchCalleeName(predicate, node.callee.name)
  );
}
