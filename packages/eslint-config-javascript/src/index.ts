import type { Linter } from 'eslint';

// Fix eslint shareable config (https://github.com/eslint/eslint/issues/3458)
require('@rushstack/eslint-patch/modern-module-resolution');

const config: Linter.Config = {
  extends: [require.resolve('@rightcapital/eslint-config-base')],
  reportUnusedDisableDirectives: true,
};

export = config;
