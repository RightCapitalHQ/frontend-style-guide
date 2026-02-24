/** @type {import('eslint-doc-generator').GenerateOptions} */
const config = {
  pathRuleDoc: 'src/rules/{name}/{name}.md',
  configEmoji: [
    ['recommended-jsx', '☑️'],
    ['recommended-react', '✅'],
  ],
};

module.exports = config;
