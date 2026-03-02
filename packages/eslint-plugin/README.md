# @rightcapital/eslint-plugin

[![npm version](https://img.shields.io/npm/v/@rightcapital/eslint-plugin)](https://www.npmjs.com/package/@rightcapital/eslint-plugin)

Custom ESLint rules used at RightCapital.

## Installation

```sh
pnpm add -D @rightcapital/eslint-plugin
```

> [!NOTE]
> If you use [`@rightcapital/eslint-config`](../eslint-config), this plugin is already included — no separate installation needed.

## Usage

If you're using `@rightcapital/eslint-config`, the plugin's recommended rules are enabled automatically. For manual configuration:

```js
import rightcapitalPlugin from '@rightcapital/eslint-plugin';

export default [
  {
    plugins: {
      '@rightcapital': rightcapitalPlugin,
    },
    rules: {
      '@rightcapital/jsx-no-unused-expressions': 'error',
    },
  },
];
```

## Configs

- `recommended-jsx` — recommended rules for JSX files.
- `recommended-react` — recommended rules for React files (includes `recommended-jsx`).

## Rules

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
☑️ Set in the `recommended-jsx` configuration.\
✅ Set in the `recommended-react` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                                                                                                                                  | Description                                                                                                     | 💼    | 🔧  |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------- | :---- | :-- |
| [jsx-no-unused-expressions](src/rules/jsx-no-unused-expressions/jsx-no-unused-expressions.md)                                                                         | Disallow unused JSX expressions                                                                                 | ☑️ ✅ |     |
| [no-explicit-type-on-function-component-identifier](src/rules/no-explicit-type-on-function-component-identifier/no-explicit-type-on-function-component-identifier.md) | Disallow explicitly specifying type for function component identifier. (This rule requires `typescript-eslint`) |       | 🔧  |
| [no-ignore-return-value-of-react-hooks](src/rules/no-ignore-return-value-of-react-hooks/no-ignore-return-value-of-react-hooks.md)                                     | Disallow ignoring return value of React hooks.                                                                  | ✅    |     |

<!-- end auto-generated rules list -->

## License

[MIT License](../../LICENSE) © 2023-Present
