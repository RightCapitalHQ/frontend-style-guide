# RightCapital Frontend Style Guide

<!-- Badges area start -->

[![made by RightCapital](https://img.shields.io/badge/made_by-RightCapital-5070e6)](https://rightcapital.com)
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

This repo provides the following ESLint config packages:

- `@rightcapital/eslint-config-javascript`: for JavaScript files
- `@rightcapital/eslint-config-typescript`: for TypeScript files
- `@rightcapital/eslint-config-typescript-react`: for TypeScript + React files

They can be used independently or combined together according to your project's needs.

### Usage

> [!NOTE]  
> make sure `eslint` is installed in your project.
>
> And install `typescript` to your project if you want to use the config supporting TypeScript(`@rightcapital/eslint-config-typescript*`).

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

## Prettier

### Usage

> Note: Prettier is a peer dependency of the config package. You need to install it in the root of your project.
>
> See: https://prettier.io/docs/en/install.html

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
