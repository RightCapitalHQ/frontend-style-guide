import {
  createConfig,
  type CreateConfigOptions,
} from '@rightcapital/oxlint-config';
import { describe, expect, test } from 'vitest';

describe('createConfig', () => {
  test('single runtime needs no profiles', () => {
    expect(createConfig({ runtime: 'node' })).toMatchSnapshot();
  });

  test('no rule is enabled by default', () => {
    const config = createConfig({
      profiles: [
        { files: ['src/**'], runtime: 'browser', react: true },
        { files: ['scripts/**'], runtime: 'node', scripting: true },
      ],
    });
    // Oxlint enables `correctness` unless it is turned off explicitly
    expect(config.categories).toEqual({ correctness: 'off' });
    expect(config.rules).toEqual({});
    for (const override of config.overrides ?? []) {
      expect(override.rules ?? {}).toEqual({});
    }
  });

  test('recommended enables the rule policy', () => {
    expect(
      createConfig({ runtime: 'node', recommended: true }),
    ).toMatchSnapshot();
  });

  test('browser runtime with React', () => {
    expect(
      createConfig({ runtime: 'browser', react: true, recommended: true }),
    ).toMatchSnapshot();
  });

  test('multi runtime profiles, project overrides and ignores', () => {
    expect(
      createConfig({
        recommended: true,
        profiles: [
          { files: ['src/**'], runtime: 'browser', react: true },
          { files: ['tests/**'], runtime: ['node', 'browser'] },
          { files: ['lambda/**'], runtime: 'lambda' },
          {
            files: ['scripts/**', '**/*.config.ts'],
            runtime: 'node',
            scripting: true,
          },
        ],
        ignorePatterns: ['generated/**'],
        rules: { 'eslint/no-console': 'off' },
        overrides: [
          { files: ['src/legacy/**'], rules: { 'eslint/no-var': 'off' } },
        ],
      }),
    ).toMatchSnapshot();
  });

  test('lambda builds on the Node policy', () => {
    const { overrides: lambda } = createConfig({
      runtime: 'lambda',
      recommended: true,
    });
    const { overrides: node } = createConfig({
      runtime: 'node',
      recommended: true,
    });
    expect(lambda).toEqual(node);
  });

  test('type-aware linting is always enabled', () => {
    expect(createConfig({ runtime: 'node' }).options?.typeAware).toBe(true);
  });

  test('profile rules take precedence over the recommended policy', () => {
    const { overrides } = createConfig({
      recommended: true,
      profiles: [
        {
          files: ['src/**'],
          runtime: 'browser',
          rules: { 'eslint/no-undef': 'off' },
        },
      ],
    });
    // later overrides win in Oxlint, so nothing may re-enable the rule after the profile
    const lastNoUndef = overrides
      ?.toReversed()
      .find((override) => override.rules?.['eslint/no-undef'] !== undefined);
    expect(lastNoUndef?.rules?.['eslint/no-undef']).toBe('off');
  });

  test('only ignores node_modules by default', () => {
    expect(createConfig({ runtime: 'node' }).ignorePatterns).toEqual([
      '**/node_modules/**',
    ]);
  });

  test('jsx-a11y is only loaded together with the recommended rules', () => {
    const react = { runtime: 'browser', react: true } as const;
    expect(createConfig(react).plugins).not.toContain('jsx-a11y');
    expect(createConfig({ ...react, recommended: true }).plugins).toContain(
      'jsx-a11y',
    );
  });

  describe('rejects invalid options', () => {
    // these combinations are compile errors, loosely typed callers still get a clear error
    const invalid = (options: object) => () =>
      createConfig(options as CreateConfigOptions);

    test('missing runtime and profiles', () => {
      expect(invalid({})).toThrow(/either `runtime` or `profiles`/);
    });

    test('empty profiles or runtime', () => {
      expect(invalid({ profiles: [] })).toThrow(/must not be empty/);
      expect(invalid({ runtime: [] })).toThrow(/must not be empty/);
      expect(
        invalid({ profiles: [{ files: ['src/**'], runtime: [] }] }),
      ).toThrow(/must not be empty/);
    });

    test.each(['runtime', 'react', 'scripting'])(
      '`%s` together with profiles',
      (option) => {
        expect(
          invalid({
            profiles: [{ files: ['src/**'], runtime: 'node' }],
            [option]: option === 'runtime' ? 'node' : true,
          }),
        ).toThrow(/mutually exclusive/);
      },
    );
  });
});
