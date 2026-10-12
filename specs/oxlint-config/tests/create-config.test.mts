import {
  createConfig,
  type CreateConfigOptions,
} from '@rightcapital/oxlint-config';
import { describe, expect, test } from 'vitest';

describe('createConfig', () => {
  test('single runtime needs no overrides', () => {
    expect(createConfig({ runtime: 'node' })).toMatchSnapshot();
  });

  test('no rule is enabled by default', () => {
    const config = createConfig({
      overrides: [
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

  test('presets on overrides, project rules, overrides and ignores', () => {
    expect(
      createConfig({
        recommended: true,
        overrides: [
          { files: ['src/**'], runtime: 'browser', react: true },
          { files: ['tests/**'], runtime: ['node', 'browser'] },
          { files: ['lambda/**'], runtime: 'lambda' },
          {
            files: ['scripts/**', '**/*.config.ts'],
            runtime: 'node',
            scripting: true,
          },
          // a plain Oxlint override is passed through
          { files: ['src/legacy/**'], rules: { 'eslint/no-var': 'off' } },
        ],
        ignorePatterns: ['generated/**'],
        rules: { 'eslint/no-console': 'off' },
      }),
    ).toMatchSnapshot();
  });

  test('presets of the project and of overrides are combined', () => {
    const { overrides } = createConfig({
      runtime: 'browser',
      overrides: [{ files: ['scripts/**'], runtime: 'node' }],
    });
    expect(overrides?.filter((override) => override.env?.browser)).toHaveLength(
      1,
    );
    expect(overrides?.filter((override) => override.env?.node)).toHaveLength(1);
  });

  test('presets are expanded and not passed to Oxlint', () => {
    const { overrides } = createConfig({
      recommended: true,
      runtime: 'node',
      react: true,
      scripting: true,
      overrides: [{ files: ['src/**'], runtime: 'browser', react: true }],
    });
    for (const override of overrides ?? []) {
      expect(override).not.toHaveProperty('runtime');
      expect(override).not.toHaveProperty('react');
      expect(override).not.toHaveProperty('scripting');
    }
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

  test('rules of an override take precedence over the recommended policy', () => {
    const { overrides } = createConfig({
      recommended: true,
      overrides: [
        {
          files: ['src/**'],
          runtime: 'browser',
          rules: { 'eslint/no-undef': 'off' },
        },
      ],
    });
    // later overrides win in Oxlint, so nothing may re-enable the rule after the override
    const lastNoUndef = overrides
      ?.toReversed()
      .find((override) => override.rules?.['eslint/no-undef'] !== undefined);
    expect(lastNoUndef?.rules?.['eslint/no-undef']).toBe('off');
  });

  test('no-undef is not checked in TypeScript files', () => {
    const { overrides } = createConfig({
      recommended: true,
      runtime: 'browser',
    });
    const noUndef = overrides?.find(
      (override) => override.rules?.['eslint/no-undef'] === 'error',
    );
    expect(noUndef?.files).toEqual(['**/*']);
    expect(noUndef?.excludeFiles).toContain('**/*.{ts,cts,mts,tsx}');
  });

  test('no-undef is only enabled where the runtime is known', () => {
    const { overrides } = createConfig({
      recommended: true,
      overrides: [{ files: ['src/**'], react: true }],
    });
    expect(
      overrides?.some((override) => override.rules?.['eslint/no-undef']),
    ).toBe(false);
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

  test('file groups without an override are only part of the recommended policy', () => {
    const files = (options: CreateConfigOptions) =>
      createConfig(options).overrides?.flatMap((override) => override.files);
    expect(files({ runtime: 'node' })).not.toContain('**/*.tsx');
    expect(files({ runtime: 'node', recommended: true })).toContain('**/*.tsx');
  });

  test('overrides come after the file groups of the recommended policy', () => {
    const { overrides } = createConfig({
      runtime: 'node',
      scripting: true,
      recommended: true,
    });
    const index = (pattern: string) =>
      overrides?.findIndex((override) => override.files.includes(pattern));
    expect(index('**/*')).toBeGreaterThan(index('**/*.tsx')!);
  });

  test('unused disable directives are only reported on request', () => {
    const reported = (options: CreateConfigOptions) =>
      createConfig(options).options?.reportUnusedDisableDirectives;
    // ESLint-only directives would be reported as unused in projects that keep ESLint
    expect(reported({ runtime: 'node', recommended: true })).toBeUndefined();
    expect(
      reported({ runtime: 'node', reportUnusedDisableDirectives: true }),
    ).toBe('warn');
  });

  describe('loads plugins for the rules of the project', () => {
    const plugins = (options: CreateConfigOptions) =>
      createConfig(options).plugins;

    test('by the rules of the project', () => {
      expect(plugins({ rules: { 'import/no-cycle': 'error' } })).toEqual([
        'import',
      ]);
      expect(plugins({ rules: { 'eslint/no-var': 'error' } })).toEqual([]);
      expect(plugins({ rules: { 'no-var': 'error' } })).toEqual([]);
    });

    test('by the rules of an override', () => {
      expect(
        plugins({
          overrides: [
            {
              files: ['tests/**'],
              rules: { 'vitest/no-focused-tests': 'error' },
            },
          ],
        }),
      ).toEqual(['vitest']);
    });

    test('by the aliases of a plugin', () => {
      expect(
        plugins({
          rules: {
            '@typescript-eslint/no-floating-promises': 'error',
            'react-hooks/rules-of-hooks': 'error',
          },
        }),
      ).toEqual(['typescript', 'react']);
    });
  });

  describe('loads the plugin of every rule', () => {
    // Oxlint silently ignores a rule of a plugin that is not loaded
    const loaded = (options: CreateConfigOptions) => {
      const { plugins, rules, overrides } = createConfig(options);
      const ruleNames = [
        ...Object.keys(rules ?? {}),
        ...(overrides ?? []).flatMap((override) =>
          Object.keys(override.rules ?? {}),
        ),
      ];
      const pluginsOfRules = new Set(
        ruleNames.map((name) => name.split('/')[0]),
      );
      // core rules need no plugin
      pluginsOfRules.delete('eslint');
      return { plugins: new Set(plugins), pluginsOfRules };
    };

    test.each<[string, CreateConfigOptions]>([
      ['node', { runtime: 'node', recommended: true }],
      ['browser', { runtime: 'browser', recommended: true }],
      ['React', { runtime: 'browser', react: true, recommended: true }],
      ['scripting', { runtime: 'node', scripting: true, recommended: true }],
      [
        'overrides',
        {
          recommended: true,
          overrides: [
            { files: ['src/**'], runtime: 'browser', react: true },
            { files: ['scripts/**'], runtime: 'node', scripting: true },
          ],
        },
      ],
      ['no preset', { recommended: true }],
    ])('%s', (_name, options) => {
      const { plugins, pluginsOfRules } = loaded(options);
      for (const plugin of pluginsOfRules) {
        expect(plugins).toContain(plugin);
      }
    });
  });

  describe('rejects invalid options', () => {
    // these are compile errors, loosely typed callers still get a clear error
    const invalid = (options: object) => () =>
      createConfig(options as CreateConfigOptions);

    test('empty runtime', () => {
      expect(invalid({ runtime: [] })).toThrow(/must not be empty/);
      expect(
        invalid({ overrides: [{ files: ['src/**'], runtime: [] }] }),
      ).toThrow(/must not be empty/);
    });

    test('unknown runtime', () => {
      expect(invalid({ runtime: 'nodejs' })).toThrow(
        /unknown `runtime` nodejs/,
      );
      expect(
        invalid({
          overrides: [{ files: ['src/**'], runtime: ['node', 'deno'] }],
        }),
      ).toThrow(/unknown `runtime` deno/);
    });

    test('override without files', () => {
      expect(invalid({ overrides: [{ runtime: 'node' }] })).toThrow(
        /`files` of an override/,
      );
      expect(invalid({ overrides: [{ files: [], runtime: 'node' }] })).toThrow(
        /`files` of an override/,
      );
    });
  });
});
