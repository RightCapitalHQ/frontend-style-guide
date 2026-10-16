import packageJson from '../../package.json' with { type: 'json' };

const repoUrl = 'https://github.com/RightCapitalHQ/frontend-style-guide';
const tag = `${packageJson.name}_v${packageJson.version}`;

export const getDocumentUrl = (ruleName: string) => {
  return `${repoUrl}/blob/${tag}/packages/eslint-plugin/src/rules/${ruleName}/${ruleName}.md`;
};
