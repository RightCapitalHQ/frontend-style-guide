/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  overrides: [
    { files: ['**/*.{js,cjs,mjs}'], extends: ['@rightcapital/javascript'] },
    { files: ['**/*.{ts,cts,mts}'], extends: ['@rightcapital/typescript'] },
    { files: ['**/*.tsx'], extends: ['@rightcapital/typescript-react'] },
    {
      files: ['./*.{js,cjs,mjs,ts,cts,mts}'],
      rules: {
        // not necessary for config,test files
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: true },
        ],
      },
    },
  ],
};
