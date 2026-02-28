# @rightcapital/eslint-config

[![npm version](https://img.shields.io/npm/v/@rightcapital/eslint-config)](https://www.npmjs.com/package/@rightcapital/eslint-config)

RightCapital's ESLint [flat config](https://eslint.org/docs/latest/use/configure/configuration-files) with support for JavaScript, TypeScript, and React.

## Prerequisites

- `eslint` (9.x or 10.x)
- `typescript` (5.x, optional — for TypeScript support)

## Installation

```sh
pnpm add -D @rightcapital/eslint-config
```

## Usage

In your `eslint.config.mjs` ([or equivalent](https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file-formats)):

```js
import eslintConfigRightcapital from '@rightcapital/eslint-config';

const { defineConfig } = eslintConfigRightcapital.utils;

export default defineConfig(
  ...eslintConfigRightcapital.configs.recommended,

  // add more configs for specific files or packages if needed
  {
    files: ['scripts/**/*.{js,cjs,mjs}'],
    extends: [
      ...eslintConfigRightcapital.configs.node,
      ...eslintConfigRightcapital.configs.script,
    ],
  },
);
```

## Exported configs and utils

### `configs`

- `recommended` — the all-in-one config, contains multiple rules configs for different file types.

> [!NOTE]
> The following configs are designed to be used with the `extends` option. They have a preset [`files` option](https://eslint.org/docs/latest/use/configure/configuration-files#:~:text=files%20%2D%20An%20array%20of%20glob%20patterns%20indicating%20the%20files%20that%20the%20configuration%20object%20should%20apply%20to.%20If%20not%20specified%2C%20the%20configuration%20object%20applies%20to%20all%20files%20matched%20by%20any%20other%20configuration%20object.).

- `js` — JavaScript specific config.
- `ts` — TypeScript specific config.
- `react` — React specific config.
- `node` — Node.js specific config.
- `script` — Script oriented config, with less strict rules.
- `disableExpensiveRules` — Disable type-aware rules and `import-x/no-cycle` to speed up linting. Useful in git hooks or `lint-staged`.

### `utils`

- `defineConfig` — re-exported util from [`typescript-eslint`](https://typescript-eslint.io/packages/typescript-eslint#config) for easier compositing of ESLint config, with automatic plugin inference (when the plugin is known to `@rightcapital/eslint-config`).

  ```js
  const { defineConfig } = eslintConfigRightcapital.utils;

  export default defineConfig({
    plugins: {
      /**
       * You can omit this since it's already known to `@rightcapital/eslint-config`.
       * `defineConfig` will automatically infer the plugin.
       */
      // unicorn: eslintPluginUnicorn,
    },
    rules: {
      'unicorn/no-hex-escape': 'error',
    },
  });
  ```

- `globals` — re-exported util from [globals](https://github.com/sindresorhus/globals), useful for configuring [`languageOptions.globals`](https://eslint.org/docs/latest/use/configure/language-options#specifying-globals).
- `isInGitHooksOrLintStaged` — returns a boolean indicating whether the current environment is in git hooks or `lint-staged`.

## License

[MIT License](../../LICENSE) © 2023-Present
