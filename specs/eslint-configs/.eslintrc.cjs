/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  overrides: [
    { files: ['src/javascript.js'], extends: ['@rightcapital/javascript'] },
    { files: ['src/typescript.ts'], extends: ['@rightcapital/typescript'] },
    {
      files: ['src/typescript-react.tsx'],
      extends: ['@rightcapital/typescript-react'],
    },
  ],
};
