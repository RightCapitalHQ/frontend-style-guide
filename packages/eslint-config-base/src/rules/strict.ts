import type { Linter } from 'eslint';

// extracted from eslint-config-airbnb-base@15.0.0
// https://github.com/airbnb/javascript/blob/eslint-config-airbnb-base-v15.0.0/packages/eslint-config-airbnb-base/rules/strict.js
const config: Linter.Config = {
  rules: {
    // babel inserts `'use strict';` for us
    strict: ['error', 'never'],
  },
};

export = config;
