import type { ESLint } from 'eslint';
import { recommendedJsxConfig } from './configs/recommended-jsx';
import { recommendedReactConfig } from './configs/recommended-react';
import { jsxNoUnusedExpressionsRule } from './rules/jsx-no-unused-expressions/jsx-no-unused-expressions';
import { noIgnoreReturnValueOfReactHooksRule } from './rules/no-ignore-return-value-of-react-hooks/no-ignore-return-value-of-react-hooks';
import { name, version } from '../package.json';

// eslint-doc-generator can't resolve default export
export const meta: ESLint.Plugin['meta'] = {
  name,
  version,
};

export const configs: ESLint.Plugin['configs'] = {
  'recommended-jsx': recommendedJsxConfig,
  'recommended-react': recommendedReactConfig,
};

export const rules: ESLint.Plugin['rules'] = {
  'jsx-no-unused-expressions': jsxNoUnusedExpressionsRule,
  'no-ignore-return-value-of-react-hooks': noIgnoreReturnValueOfReactHooksRule,
};
