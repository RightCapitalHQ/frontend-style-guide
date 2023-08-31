# RightCapital Frontend Style Guide

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

> Note: make sure `eslint` is installed in your project.
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

_Applying same config to all files in the project could be error-prone. Not recommended._

### Showcase

For example, we have a project with the following structure:

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
├── App.test.ts  <---------------- Jest test file
└── App.tsx      <---------------- TypeScript React component
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
      files: ['./**/*.{js,cjs,mjs,jsx}'],
      excludedFiles: ['src/**'],
      extends: ['@rightcapital/javascript'],
      env: { node: true },
    },
    {
      // TypeScript config and scripts
      files: ['./**/*.{ts,cts,mts,tsx}'],
      excludedFiles: ['src/**'],
    },
  ],
};
```

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
