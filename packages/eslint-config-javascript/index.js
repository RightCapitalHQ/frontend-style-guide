// Fix eslint shareable config (https://github.com/eslint/eslint/issues/3458)
require('@rushstack/eslint-patch/modern-module-resolution');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    require.resolve('@rightcapital/eslint-config-base'),
    require.resolve('eslint-config-prettier'),
  ],
  reportUnusedDisableDirectives: true,
  rules: {},
  settings: {},
};
