/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  overrides: [
    {
      // source files
      files: ['packages/**/*.{js,cjs}'],
      extends: '@rightcapital/javascript',
      env: { commonjs: true },
    },
    {
      // config files
      files: ['./*.{js,cjs}'],
      extends: '@rightcapital/javascript',
      env: { node: true, commonjs: true },
    },
  ],
};
