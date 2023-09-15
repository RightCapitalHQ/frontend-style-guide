// @ts-check
/** @type {import('beachball').BeachballConfig} */
module.exports = {
  access: 'public',
  groups: [
    {
      name: 'ESLint config packages',
      include: ['packages/eslint-config*'],
    },
  ],
  registry: 'https://registry.npmjs.org',
  ignorePatterns: [
    '.*ignore',
    '.yamllint',
    '.prettierrc',
    'eslintrc.js',
    'jest.*.js',
    '.pnpm-store/**',
    '.vscode/**',
    'pnpm-lock.yaml',
  ],
  changelog: {
    customRenderers: {
      renderHeader() {},
      renderChangeTypeHeader(changeType, renderInfo) {
        const changelogDate = renderInfo.newVersionChangelog.date
          .toLocaleDateString('zh-CN')
          .replace(/\//g, '-');
        const heading =
          changeType === 'major' || changeType === 'minor' ? '##' : '###';
        return `${heading} [${renderInfo.newVersionChangelog.version}](https://github.com/RightCapitalHQ/frontend-style-guide/tree/${renderInfo.newVersionChangelog.tag}) (${changelogDate})`;
      },
      // Original template: https://github.com/microsoft/beachball/blob/aefbc1ac37ee85961cc787133c827f1fd3925550/src/changelog/renderPackageChangelog.ts#L93
      renderEntry(entry) {
        if (entry.author === 'beachball') {
          return `- ${entry.comment}`;
        }
        // Imitate GitHub's commit format https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/autolinked-references-and-urls#commit-shas
        return `- ${entry.comment} ([${entry.commit.substring(
          0,
          7,
        )}](https://github.com/RightCapitalHQ/frontend-style-guide/commit/${
          entry.commit
        }))`;
      },
    },
  },
};
