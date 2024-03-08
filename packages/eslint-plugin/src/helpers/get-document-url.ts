import { name, version } from '../../package.json';

const repoUrl = 'https://github.com/RightCapitalHQ/frontend-style-guide';
const tag = `${name}_v${version}`;

export const getDocumentUrl = (ruleName: string) => {
  return `${repoUrl}/blob/${tag}/packages/eslint-plugin/src/rules/${ruleName}/${ruleName}.md`;
};
