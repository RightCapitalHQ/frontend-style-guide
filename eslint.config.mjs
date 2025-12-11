import eslintConfigRightcapital from '@rightcapital/eslint-config';
import eslintPluginEslintPlugin from 'eslint-plugin-eslint-plugin';

const { defineConfig, pickPlugins } = eslintConfigRightcapital.utils;

export default defineConfig(
  {
    /**
     * NOTE:
     * DO NOT put any other keys other than `ignores` in this object.
     * see: https://eslint.org/docs/latest/use/configure/configuration-files#globally-ignoring-files-with-ignores
     */
    ignores: [
      // build output
      'packages/*/lib',
      '.github/actions/*/dist',

      // E2E tests, they contains individual lint config and specific ESLint dependencies
      'specs',
    ],
  },
  ...eslintConfigRightcapital.configs.recommended,

  {
    files: ['**/*.{ts,cts,mts,tsx}'],
    plugins: pickPlugins(['@typescript-eslint']),
    rules: {
      // disallow referring to code marked with @deprecated
      // https://typescript-eslint.io/rules/no-deprecated
      '@typescript-eslint/no-deprecated': 'error',
    },
  },

  // scripts
  {
    files: [
      'packages/*/*.{js,cjs,mjs,ts,cts,mts}', // each package's top-level directory files
      'packages/*/scripts/*.{js,cjs,mjs,ts,cts,mts}', // each package's scripts
      'scripts/**/*.{js,cjs,mjs}',
      '.github/actions/**/*.{js,cjs,mjs}',
    ],
    extends: [
      ...eslintConfigRightcapital.configs.script,
      ...eslintConfigRightcapital.configs.node,
    ],
  },

  // -----------------------
  // package specific rules
  // -----------------------

  // @rightcapital/eslint-plugin
  {
    files: ['packages/eslint-plugin/**/*.ts'],
    extends: [eslintPluginEslintPlugin.configs.recommended],
  },
  {
    files: ['packages/eslint-plugin/src/helpers/test/*.ts'],
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        { devDependencies: true },
      ],
    },
  },

  // @rightcapital/lint-eslint-config-rules
  {
    files: ['packages/lint-eslint-config-rules/**/*.ts'],
    extends: [...eslintConfigRightcapital.configs.script],
  },
);
