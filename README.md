# RightCapital Frontend Style Guide

<!-- Badges area start -->

[![made by RightCapital](https://img.shields.io/badge/made_by-RightCapital-4966d0)](https://rightcapital.com)
![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/RightCapitalHQ/frontend-style-guide/ci.yml)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)
[![RightCapital frontend style guide](https://img.shields.io/badge/code_style-RightCapital-5c4c64?labelColor=f0ede8)](https://github.com/RightCapitalHQ/frontend-style-guide)

<!-- Badges area end -->

RightCapital's frontend style guide.

## Introduction

This repo contains configs for common linting and styling tools widely used in RightCapital.

Following tools are covered:

- [ESLint](#eslint)
- [Prettier](#prettier)

## ESLint

### Prerequisite

- `eslint`(>=9)
- `typescript`(optional, for TypeScript support)

### Usage

Install `@rightcapital/eslint-config` to your project.

```sh
pnpm add -D @rightcapital/eslint-config
```

In your `eslint.config.mjs`([or equivalent](https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file-formats)):

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

### Exported configs and utils

**`configs`**

- `recommended`: the all-in-one config, contains multiple rules configs for different files.

> [!NOTE]  
> The following configs are designed to be used with `extends` option. They do have a preset [`files` option](https://eslint.org/docs/latest/use/configure/configuration-files#:~:text=files%20%2D%20An%20array%20of%20glob%20patterns%20indicating%20the%20files%20that%20the%20configuration%20object%20should%20apply%20to.%20If%20not%20specified%2C%20the%20configuration%20object%20applies%20to%20all%20files%20matched%20by%20any%20other%20configuration%20object.).

- `js`: JavaScript specific config.
- `ts`: TypeScript specific config.
- `react`: React specific config.
- `node`: Node.js specific config.
- `script`: Script oriented config, with less strict rules.
- `disableExpensiveRules`: Disable type-aware rules and `import-x/no-cycle` to speed up linting. Useful in git hooks or `lint-staged`.

**`utils`**

- `defineConfig`: reexported util from `typescript-eslint` for easier compositing ESLint config. (docs: https://typescript-eslint.io/packages/typescript-eslint#config), with automatic plugin inference (when the plugin is known to `@rightcapital/eslint-config`).

  ```js
  const { defineConfig } = eslintConfigRightcapital.utils;

  export default defineConfig({
    plugins: {
      /**
       * You can omit this since it's already known to `@rightcapital/eslint-config`.
       * And `defineConfig` will automatically infer the plugin from `@rightcapital/eslint-config`.
       */
      // unicorn: eslintPluginUnicorn,
    },
    rules: {
      'unicorn/no-hex-escape': 'error',
    },
  });
  ```

- `globals`: reexported util from [globals](https://github.com/sindresorhus/globals), useful for configuring [`languageOptions.globals`](https://eslint.org/docs/latest/use/configure/language-options#specifying-globals).
- `isInGitHooksOrLintStaged`: return a boolean to indicate whether current environment is in git hooks or `lint-staged`.

---

<details>
<summary>
<b>[Deprecated]</b> Usage for Legacy ESLint versions(&lt;9)
</summary>

There are following config packages for legacy ESLint versions(<9):

- `@rightcapital/eslint-config-javascript`: for JavaScript files
- `@rightcapital/eslint-config-typescript`: for TypeScript files
- `@rightcapital/eslint-config-typescript-react`: for TypeScript + React files
- `@rightcapital/eslint-plugin`

They can be used independently or combined together according to your project's needs.

Install the config package(s) you need:

```sh
# e.g. for a project only using JavaScript
pnpm add -D @rightcapital/eslint-config-javascript
```

In your `.eslintrc.cjs`([or equivalent](https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file-formats)):

1. [using `overrides` to group different types of files](https://eslint.org/docs/latest/use/configure/configuration-files#configuration-based-on-glob-patterns), and extends the corresponding config.
2. Add proper `env` and other configs if needed.

```js .eslintrc.cjs
/** @type {import("eslint").Linter.Config} */
module.exports = {
  // use overrides to group different types of files
  // see https://eslint.org/docs/latest/use/configure/configuration-files#configuration-based-on-glob-patterns
  overrides: [
    {
      // typical TypeScript React code, running in browser
      files: ['src/**/*.{ts,tsx}'],
      excludedFiles: ['src/**/*.test.{ts,tsx}'], // exclude test files
      extends: ['@rightcapital/typescript-react'],
      env: { browser: true },
    },
  ],
};
```

> [!NOTE]  
> Applying same config to all files in the project could be error-prone. Not recommended.

#### Complete Showcase

<details>
<summary>
For example, we have a project with the following structure:
</summary>

```
.
├── .eslintrc.cjs
├── jest.config.cjs
├── prettier.config.cjs
├── scripts      <---------------- Various scripts running in Node.js
│   ├── brew-coffee.ts
│   ├── make-latte.mjs
│   └── print-project-stats.tsx
└── src
    ├── App.test.ts  <------------ Jest test file
    └── App.tsx      <------------ TypeScript React component
```

The `.eslintrc.cjs` could look like this:

```js
/** @type {import("eslint").Linter.Config} */
module.exports = {
  // usually `true` for project root config
  // see https://eslint.org/docs/latest/use/configure/configuration-files#cascading-and-hierarchy
  root: true,

  // use overrides to group different types of files
  // see https://eslint.org/docs/latest/use/configure/configuration-files#configuration-based-on-glob-patterns
  overrides: [
    {
      // typical TypeScript React code, running in browser
      files: ['src/**/*.{ts,tsx}'],
      excludedFiles: ['src/**/*.test.{ts,tsx}'], // exclude test files
      extends: ['@rightcapital/typescript-react'],
      env: { browser: true },
    },
    {
      // test files
      files: ['src/**/*.test.{ts,tsx}'],
      extends: ['@rightcapital/typescript-react'],
      env: { jest: true, node: true },
    },
    {
      // JavaScript config and scripts
      files: ['./*.{js,cjs,mjs,jsx}', 'scripts/**/*.{js,cjs,mjs,jsx}'],
      excludedFiles: ['src/**'],
      extends: ['@rightcapital/javascript'],
      env: { node: true },
    },
    {
      // TypeScript config and scripts
      files: ['./*.{ts,cts,mts,tsx}', 'scripts/**/*.{ts,cts,mts,tsx}'],
      excludedFiles: ['src/**'],
      env: { node: true },
    },
  ],
};
```

</details>
</details>

## Prettier

### Prerequisite

- `prettier`

### Usage

Install config package to your project:

```bash
pnpm add -D @rightcapital/prettier-config
```

In your project's `prettier.config.cjs`:

```js
module.exports = require('@rightcapital/prettier-config');
```

## License

[MIT License](LICENSE) © 2023-Present
