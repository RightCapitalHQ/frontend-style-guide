import type { ESLint } from 'eslint';
import jsxNoUselessElementsRule from './rules/jsx-no-useless-elements/jsx-no-useless-elements';
import noIgnoreReturnValueOfHooksRule from './rules/no-ignore-return-value-of-hooks/no-ignore-return-value-of-hooks';
import { name, version } from '../package.json';

const plugin: ESLint.Plugin = {
  meta: {
    name,
    version,
  },
  rules: {
    'no-ignore-return-value-of-hooks': noIgnoreReturnValueOfHooksRule,
    'jsx-no-useless-elements': jsxNoUselessElementsRule,
  },
};

// eslint-doc-generator can't resolve default export
export = plugin;
