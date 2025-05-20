import type { BeachballConfig } from 'beachball';

const config: BeachballConfig = {
  access: 'public',
  groups: [
    {
      name: 'ESLint config packages',
      include: ['packages/eslint-config*', 'packages/eslint-plugin*'],
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
  hooks: {
    precommit: async () => {
      const { $ } = await import('execa');
      const pnpmInstallEnv = { ...process.env };
      delete pnpmInstallEnv.CI;
      /**
       * After version bumps, we need to update lockfile
       * to make sure all "workspace:*" dependencies are updated
       *
       * avoid issues like: https://github.com/RightCapitalHQ/frontend-style-guide/actions/runs/14992432680/job/42118726519
       */
      await $({ env: pnpmInstallEnv })`pnpm -w install`;
      await $`pnpm -w exec git add pnpm-lock.yaml`;
    },
  },
  changelog: {
    customRenderers: {
      // eslint-disable-next-line @typescript-eslint/require-await
      async renderHeader(renderInfo) {
        const changelogDate = renderInfo.newVersionChangelog.date
          .toLocaleDateString('zh-CN')
          .replace(/\//g, '-');
        return `## [${
          renderInfo.newVersionChangelog.version
        }](https://github.com/RightCapitalHQ/frontend-style-guide/tree/${encodeURIComponent(
          renderInfo.newVersionChangelog.tag,
        )}) (${changelogDate})`;
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
};

export default config;
