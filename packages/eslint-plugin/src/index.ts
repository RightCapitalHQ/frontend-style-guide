import type { RuleDefinition } from '@eslint/core';
import type { ESLint } from 'eslint';

import packageJson from '../package.json' with { type: 'json' };
import { recommendedReactConfig } from './configs/recommended-react.ts';
import { noExplicitTypeOnFunctionComponentIdentifierRule } from './rules/no-explicit-type-on-function-component-identifier/no-explicit-type-on-function-component-identifier.ts';
import { requireNamedWrappedComponentRule } from './rules/require-named-wrapped-component/require-named-wrapped-component.ts';

// eslint-doc-generator can't resolve default export
export const meta: ESLint.Plugin['meta'] = {
  name: packageJson.name,
  version: packageJson.version,
};

export const configs: ESLint.Plugin['configs'] = {
  'recommended-react': recommendedReactConfig,
};

export const rules = {
  'no-explicit-type-on-function-component-identifier':
    noExplicitTypeOnFunctionComponentIdentifierRule,
  'require-named-wrapped-component': requireNamedWrappedComponentRule,
  // FIXME: we may fix this when ESLint core types get better
} as unknown as Record<string, RuleDefinition>;

export default { meta, configs, rules };
