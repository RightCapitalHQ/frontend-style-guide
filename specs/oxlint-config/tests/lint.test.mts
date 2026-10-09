import { beforeAll, describe, expect, test } from 'vitest';

import { type Diagnostic, lintFixtures, runOxlint } from './helpers.mjs';

describe('resolved configuration', () => {
  // Shows rules enabled by categories and explicit settings after dependency upgrades,
  // not changes in rule semantics. Overrides are covered by the `createConfig` snapshots.
  test('enabled rule inventory', async () => {
    const config = JSON.parse(await runOxlint('--print-config'));
    expect(config).toMatchSnapshot();
  });
});

describe('lint fixtures', () => {
  let diagnostics: Diagnostic[];

  // a type-aware run over the fixtures is slow, so it runs once for all tests
  beforeAll(async () => {
    diagnostics = await lintFixtures();
  }, 60_000);

  const filesReporting = (code: string) =>
    diagnostics
      .filter((diagnostic) => diagnostic.code === code)
      .map(({ filename }) => filename);

  test('reports the expected diagnostics', () => {
    expect(
      diagnostics
        .map(({ filename, code, severity }) => ({ filename, code, severity }))
        .toSorted((a, b) =>
          `${a.filename}:${a.code}`.localeCompare(`${b.filename}:${b.code}`),
        ),
    ).toMatchSnapshot();
  });

  test('type-aware rules run by default', () => {
    expect(filesReporting('typescript(no-floating-promises)')).toEqual([
      'src/app.tsx',
    ]);
  });

  test('Node globals are undefined in the browser profile', () => {
    expect(filesReporting('eslint(no-undef)')).toEqual(['src/legacy.js']);
  });

  test('globals are not checked in files outside every profile', () => {
    expect(filesReporting('eslint(no-undef)')).not.toContain('unmatched.js');
  });

  test('CommonJS globals are defined in .cjs files', () => {
    expect(filesReporting('eslint(no-undef)')).not.toContain(
      'src/commonjs.cjs',
    );
  });
});
