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
        'no-console': 'off',
        'no-void': ['error', { allowAsStatement: true }],
      },
    },
    {
      // config files, scripts (TypeScript)
      files: [
        './*.{ts,cts,mts}',
        'scripts/**/*.{ts,cts,mts}',
        'packages/**/*.{ts,cts,mts}',
      ],
      extends: '@rightcapital/typescript',
      parserOptions: {
        tsconfigRootDir: __dirname,
        EXPERIMENTAL_useSourceOfProjectReferenceRedirect: true,
      },
      rules: {
        'no-unused-expressions': ['error', { allowTaggedTemplates: true }],
        'import/no-extraneous-dependencies': 'off',
        'no-console': 'off',
        'no-void': ['error', { allowAsStatement: true }],
      },
    },
    {
      files: ['./*.mjs', 'scripts/**/*.mjs'],
      env: { node: true, commonjs: false },
    },
    {
      files: ['packages/eslint-plugin/**/*.ts'],
      extends: ['plugin:eslint-plugin/recommended'],
    },
  ],
};
