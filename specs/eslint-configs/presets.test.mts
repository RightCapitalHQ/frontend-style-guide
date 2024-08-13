import { readdir } from 'node:fs/promises';
import { basename, resolve } from 'node:path';

import { describe, test } from 'vitest';

import eslintConfigPrettier from 'eslint-config-prettier';

import { ESLint } from 'eslint';

const srcDir = resolve(__dirname, 'src');
const rootDir = __dirname;

const sampleFiles = (await readdir(srcDir)).map((filename) =>
  resolve(srcDir, filename),
);

const parsedConfigs = await Promise.all(
  sampleFiles.map(async (file) => [
    basename(file),
    await new ESLint({
      cwd: rootDir,
    }).calculateConfigForFile(file),
  ]),
);

/**
 * Make snapshot for the result of parsed presets,
 * Thus we can easily inspect the upgrade of upstream configs.
 *
 * @see https://eslint.org/docs/v8.x/integrate/nodejs-api#-eslintcalculateconfigforfilefilepath
 */
describe('Resolved config matches snapshot', async () => {
  for (const [file, config] of parsedConfigs) {
    test.concurrent(file, async ({ expect }) => {
      expect({
        ...config,
        // this field contains environment related path, which is not suitable for snapshot
        parser: '<OMITTED>',
      }).toMatchSnapshot();
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
const ignoredDeprecatedRules = ['no-buffer-constructor', 'no-return-await'];
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
