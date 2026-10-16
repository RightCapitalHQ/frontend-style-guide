# @rightcapital/prettier-config

[![npm version](https://img.shields.io/npm/v/@rightcapital/prettier-config)](https://www.npmjs.com/package/@rightcapital/prettier-config)

RightCapital's shared [Prettier](https://prettier.io/) configuration.

## Prerequisites

- Node.js `^22.13.0 || >=24`
- `prettier` (^3.0.0)

## Installation

```sh
pnpm add -D @rightcapital/prettier-config
```

## Usage

In your `prettier.config.mjs`:

```js
import config from '@rightcapital/prettier-config';

export default config;
```

Existing `prettier.config.cjs` setups are also supported:

```js
module.exports = require('@rightcapital/prettier-config');
```

The package is ESM-only; Node.js's `module.exports` interop export makes `require()` return the configuration object directly.

## What's included

- Single quotes
- Semicolons
- 2-space indentation
- 80-character print width
- Trailing commas (all)
- Arrow function parentheses (always)
- [`prettier-plugin-packagejson`](https://github.com/matzkoh/prettier-plugin-packagejson) for sorting `package.json`

## License

[MIT License](./LICENSE) © 2023-Present
