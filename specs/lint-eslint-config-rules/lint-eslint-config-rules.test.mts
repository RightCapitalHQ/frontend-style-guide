import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { test } from 'vitest';
import { lintESLintConfigRules } from '@rightcapital/lint-eslint-config-rules';

const specDirs = (
  await readdir(join(import.meta.dirname, 'fixtures'), { withFileTypes: true })
).filter((dirent) => dirent.isDirectory());

for (const dirent of specDirs) {
  test(dirent.name, async ({ expect }) => {
    const cwd = join(dirent.parentPath, dirent.name);
    const result = await lintESLintConfigRules(cwd);
    expect(result.usedDeprecatedRuleIds).toEqual(
      new Set([
        'indent-legacy',
        'no-new-object',

        // from extended configs
        'no-buffer-constructor',
        'no-return-await',
      ]),
    );
    expect(result.usedUnknownRuleIds).toEqual(
      new Set([
        'unknown-rule-off',
        'unknown-rule-error',
        '@prefixed/unknown-rule-off',
        '@prefixed/unknown-rule-error',
      ]),
    );
  });
}
