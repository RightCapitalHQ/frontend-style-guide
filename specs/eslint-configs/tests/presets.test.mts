import { readdir } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { describe, expect, test } from 'vitest';
import { execa } from 'execa';

import eslintConfigPrettier from 'eslint-config-prettier';

import { ESLint } from 'eslint';
import { diff } from 'jest-diff';

const rootDir = resolve(__dirname, '..');
const srcDir = resolve(rootDir, 'src');

const sampleFiles = (await readdir(srcDir)).map((filename) =>
  resolve(srcDir, filename),
);

const getParsedConfigByOptions = async (
  file: string,
  { isInEditor }: { isInEditor: boolean },
) => {
  /**
   * We don't use `new ESLint().calculateConfigForFile()` here
   * because part of the configuration in @rightcapital/eslint-config is adjusted based on environment variables.
   * However, ESLint configuration files might be cached,
   * so even when environment variables change in the same Node.js process,
   * calling `new ESLint().calculateConfigForFile()` again would still return the same result as before.
   */
  const { stdout } = await execa({
    // @ts-expect-error
    extendEnv: true,
    env: {
      RC_ESLINT_CONFIG_TEST_FORCE_IS_IN_EDITOR: isInEditor ? 1 : 0,
    },
  })`eslint --print-config ${file}`;
  return JSON.parse(stdout as string);
};

const getParsedConfig = async () => {
  return await Promise.all(
    sampleFiles.map(async (file) => {
      const fileBaseName = basename(file);
      const [config, editorModeConfig] = await Promise.all([
        getParsedConfigByOptions(file, { isInEditor: false }),
        getParsedConfigByOptions(file, { isInEditor: true }),
      ]);
      return [fileBaseName, config, editorModeConfig] as const;
    }),
  );
};

const parsedConfigs = await getParsedConfig();

/**
 * We have to strip the version part of our plugin name (the plugin is in this monorepo)
 *
 * from:  `import-x:eslint-plugin-import-x@4.11.1`
 * to:    `import-x:eslint-plugin-import-x`
 *
 * from:  `@rightcapital:@rightcapital/eslint-plugin@42.1.0`
 * to:    `@rightcapital:@rightcapital/eslint-plugin`
 *
 * Since every time we publish a new version:
 * 1. snapshot references to existing old version of @rightcapital/eslint-plugin
 * 2. new version of @rightcapital/eslint-plugin published
 * 3. new snapshot test will reference to the new version, test fails
 */
const trimConfigPluginVersion = (pluginInfo: string) =>
  pluginInfo.replace(/(?<=[\w\-]+:[\w\-]+|[@\w\-]+:@[\w\-]+\/[\w\-]+)@.+$/, '');

describe.concurrent('trimConfigPluginVersion()', () => {
  test.for([
    [
      'import-x:eslint-plugin-import-x@4.11.1',
      'import-x:eslint-plugin-import-x',
    ],
    [
      '@rightcapital:@rightcapital/eslint-plugin@42.1.0',
      '@rightcapital:@rightcapital/eslint-plugin',
    ],
    [
      '@eslint-react/hooks-extra:eslint-plugin-react-hooks-extra@1.49.0',
      '@eslint-react/hooks-extra:eslint-plugin-react-hooks-extra',
    ],
    [
      'rightcapital:@rightcapital/eslint-plugin@42.1.0',
      'rightcapital:@rightcapital/eslint-plugin',
    ],
    ['@stylistic', '@stylistic'],
    ['lodash:eslint-plugin-lodash', 'lodash:eslint-plugin-lodash'],
  ])('trim %s -> %s', ([input, expected], { expect }) => {
    expect(trimConfigPluginVersion(input)).toBe(expected);
  });
});

/**
 * Make snapshot for the result of parsed presets,
 * Thus we can easily inspect the upgrade of upstream configs.
 *
 * @see https://eslint.org/docs/latest/integrate/nodejs-api#-eslintcalculateconfigforfilefilepath
 */
describe('Resolved config matches snapshot', () => {
  for (const [file, config, editorModeConfig] of parsedConfigs) {
    test(file, () => {
      const trimConfigForSnapshot = (rawConfig) => ({
        ...rawConfig,
        // These fields contain unnecessary information for snapshot
        parser: '<OMITTED>',
        plugins: rawConfig.plugins.map(trimConfigPluginVersion),
        language: '<OMITTED>',
        languageOptions: {
          ...config.languageOptions,
          parser: '<OMITTED>',
        },
        settings: {
          ...config.settings,
          'import-x/parsers': Object.fromEntries(
            Object.entries(config.settings?.['import-x/parsers'] ?? {}).map(
              ([key, value]) => [
                // trim host-specific absolute path parts
                key.replace(/.*\/node_modules\//, '<OMITTED_ABSOLUTE_PATH>/'),
                value,
              ],
            ),
          ),
        },
      });
      expect(trimConfigForSnapshot(config)).toMatchSnapshot();

      const trimConfigForDiff = (rawConfig) => ({
        ...rawConfig,
        // These fields contain unnecessary information for diff
        plugins: rawConfig.plugins.map(trimConfigPluginVersion),
      });
      expect(
        diff(trimConfigForDiff(config), trimConfigForDiff(editorModeConfig), {
          aAnnotation: 'Editor mode: false',
          bAnnotation: 'Editor mode: true',
          expand: false,
          includeChangeCounts: true,
        }),
      ).toMatchSnapshot();
    });
  }
});

const allowedSpecialStyleRules = [
  /**
   * We use `curly: ['error', 'all']` which is compatible with Prettier
   * https://github.com/prettier/eslint-config-prettier?tab=readme-ov-file#curly
   */
  'curly',

  /**
   * https://github.com/prettier/eslint-config-prettier?tab=readme-ov-file#no-unexpected-multiline
   */
  'no-unexpected-multiline',
];
const disallowedStyleRules = Object.keys(eslintConfigPrettier.rules).filter(
  (rule) => !allowedSpecialStyleRules.includes(rule),
);
/**
 * Make presets friendly to Prettier
 *
 * Although we have the eslint-config-prettier CLI to
 * check for rules that are not compatible with Prettier,
 * we also want to avoid unnecessary rules
 * like "space-after-keywords": "off" in our presets.
 *
 * Therefore, we add this test to ensure that
 * the presets do not contain any (enable or disable) style rules.
 */
describe('Presets does not contain style rules', () => {
  for (const [file, preset] of parsedConfigs) {
    test.concurrent(`${file}`, async ({ expect }) => {
      for (const rule of disallowedStyleRules) {
        expect(preset.rules).not.toHaveProperty(rule);
      }
    });
  }
});

// FIXME: migrate these deprecated rules with alternatives or remove them?
const ignoredDeprecatedRules = ['no-buffer-constructor'];
const lintResults = await Promise.all(
  sampleFiles.map(async (file) => [
    basename(file),
    (
      await new ESLint({
        cwd: rootDir,
      }).lintFiles(file)
    )[0],
  ]),
);
describe('Presets does not contain deprecated rules', () => {
  for (const [file, result] of lintResults) {
    test.concurrent(`${file}`, async ({ expect }) => {
      expect(result).toBeTypeOf('object');
      const deprecatedRules = (result as ESLint.LintResult).usedDeprecatedRules;

      /**
       * For better readability, we use `toEqual([])` to produce a more concise diff.
       */
      expect(
        deprecatedRules.filter(
          (deprecatedRule) =>
            !ignoredDeprecatedRules.includes(deprecatedRule.ruleId),
        ),
      ).toEqual([]);
    });
  }
});
