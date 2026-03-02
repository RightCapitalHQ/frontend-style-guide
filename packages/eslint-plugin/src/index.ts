import type { RuleDefinition } from '@eslint/core';
import type { ESLint } from 'eslint';

import { name, version } from '../package.json';
import { recommendedJsxConfig } from './configs/recommended-jsx';
import { recommendedReactConfig } from './configs/recommended-react';
import { jsxNoUnusedExpressionsRule } from './rules/jsx-no-unused-expressions/jsx-no-unused-expressions';
import { noExplicitTypeOnFunctionComponentIdentifierRule } from './rules/no-explicit-type-on-function-component-identifier/no-explicit-type-on-function-component-identifier';
import { noIgnoreReturnValueOfReactHooksRule } from './rules/no-ignore-return-value-of-react-hooks/no-ignore-return-value-of-react-hooks';
import { requireNamedWrappedComponentRule } from './rules/require-named-wrapped-component/require-named-wrapped-component';

// eslint-doc-generator can't resolve default export
export const meta: ESLint.Plugin['meta'] = {
  name,
  version,
};

export const configs: ESLint.Plugin['configs'] = {
  'recommended-jsx': recommendedJsxConfig,
  'recommended-react': recommendedReactConfig,
};

export const rules = {
  'jsx-no-unused-expressions': jsxNoUnusedExpressionsRule,
  'no-ignore-return-value-of-react-hooks': noIgnoreReturnValueOfReactHooksRule,
  'no-explicit-type-on-function-component-identifier':
    noExplicitTypeOnFunctionComponentIdentifierRule,
  'require-named-wrapped-component': requireNamedWrappedComponentRule,
  // FIXME: we may fix this when ESLint core types get better
} as unknown as Record<string, RuleDefinition>;
