import type { Linter } from '@typescript-eslint/utils/ts-eslint';

import { name, version } from '../package.json';
import { recommendedJsxConfig } from './configs/recommended-jsx';
import { recommendedReactConfig } from './configs/recommended-react';
import { jsxNoUnusedExpressionsRule } from './rules/jsx-no-unused-expressions/jsx-no-unused-expressions';
import { noExplicitTypeOnFunctionComponentIdentifierRule } from './rules/no-explicit-type-on-function-component-identifier/no-explicit-type-on-function-component-identifier';
import { noIgnoreReturnValueOfReactHooksRule } from './rules/no-ignore-return-value-of-react-hooks/no-ignore-return-value-of-react-hooks';

// eslint-doc-generator can't resolve default export
export const meta: Linter.Plugin['meta'] = {
  name,
  version,
};

export const configs: Linter.Plugin['configs'] = {
  'recommended-jsx': recommendedJsxConfig,
  'recommended-react': recommendedReactConfig,
};

export const rules: Linter.Plugin['rules'] = {
  'jsx-no-unused-expressions': jsxNoUnusedExpressionsRule,
  'no-ignore-return-value-of-react-hooks': noIgnoreReturnValueOfReactHooksRule,
  'no-explicit-type-on-function-component-identifier':
    noExplicitTypeOnFunctionComponentIdentifierRule,
};
