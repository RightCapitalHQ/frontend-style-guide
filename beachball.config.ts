import { writeFile } from 'node:fs/promises';
import { relative } from 'node:path';
import type { BeachballConfig, ChangelogJson, ChangeType } from 'beachball';
import type { IReleaseJson } from '@rightcapital/scripts';

const repoUrl: string =
  'https://github.com/RightCapitalHQ/frontend-style-guide';
const repoBlobUrl: string = `${repoUrl}/blob/main`;

const config: BeachballConfig = {
  access: 'public',
  groups: [
    {
      name: 'ESLint config packages',
      include: ['packages/eslint-config*'],
      disallowedChangeTypes: null,
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
      // eslint-disable-next-line @typescript-eslint/require-await
      async renderChangeTypeHeader(changeType, renderInfo) {
        const changelogDate = renderInfo.newVersionChangelog.date
          .toLocaleDateString('zh-CN')
          .replace(/\//g, '-');
        const heading =
          changeType === 'major' || changeType === 'minor' ? '##' : '###';
        return `${heading} [${renderInfo.newVersionChangelog.version}](https://github.com/RightCapitalHQ/frontend-style-guide/tree/${renderInfo.newVersionChangelog.tag}) (${changelogDate})`;
      },
      // Original template: https://github.com/microsoft/beachball/blob/aefbc1ac37ee85961cc787133c827f1fd3925550/src/changelog/renderPackageChangelog.ts#L93
      // eslint-disable-next-line @typescript-eslint/require-await
      async renderEntry(entry) {
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
  hooks: {
    postpublish: async (packagePath, name, version) => {
      // for each published package, generate a RELEASE.json
      const gitTag = `${name}_v${version}`;
      // eslint-disable-next-line import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires
      const changelog = require(
        `${packagePath}/CHANGELOG.json`,
      ) as ChangelogJson;
      const currentChangelog = changelog.entries.find(
        (entry) => entry.version === version,
      );
      if (!currentChangelog) {
        throw new Error(`Cannot find changelog for package ${name}@${gitTag}`);
      }
      const changeTypes: ChangeType[] = ['major', 'minor', 'patch', 'none'];
      const releaseNotes = `## What's Changed

${changeTypes
  .map((changeType) => {
    const entryList = currentChangelog.comments[changeType];
    if (entryList) {
      return entryList
        .map((changelogEntry) => {
          const { commit, comment } = changelogEntry;
          const commitLink =
            commit === 'not available'
              ? ''
              : ` [${commit.substring(0, 8)}](${repoUrl}/commit/${commit}) `;
          return `* ${commitLink}${comment}`;
        })
        .join('\n');
    }
    return '';
  })
  .join('\n\n')}

**Full Changelog**: ${repoBlobUrl}/${relative(
        __dirname,
        packagePath,
      )}/CHANGELOG.md`;

      const releaseJson: IReleaseJson = {
        name,
        packagePath,
        gitTag,
        releaseNotes,
      };
      await writeFile(
        `${packagePath}/RELEASE.json`,
        JSON.stringify(releaseJson),
      );
    },
  },
};

export default config;
