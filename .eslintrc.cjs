/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  overrides: [
    {
      // source files
      files: ['packages/**/*.{js,cjs,mjs}'],
      extends: '@rightcapital/javascript',
      env: { commonjs: true },
    },
    {
      // config files, scripts
      files: ['./*.{js,cjs,mjs}', 'scripts/**/*.{js,cjs,mjs}'],
      extends: '@rightcapital/javascript',
      env: { node: true, commonjs: true },
      rules: {
        'no-unused-expressions': ['error', { allowTaggedTemplates: true }],
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['./*.mjs', 'scripts/**/*.mjs'],
      env: { node: true, commonjs: false },
    },
  ],
};
