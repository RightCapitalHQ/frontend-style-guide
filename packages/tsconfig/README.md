# @rightcapital/tsconfig

[![npm version](https://img.shields.io/npm/v/@rightcapital/tsconfig)](https://www.npmjs.com/package/@rightcapital/tsconfig)

RightCapital's shared [TypeScript](https://www.typescriptlang.org/) configuration.

## Installation

```sh
pnpm add -D @rightcapital/tsconfig
```

## Usage

In your `tsconfig.json`:

```json
{
  "extends": "@rightcapital/tsconfig"
}
```

## What's included

- `strict` mode enabled
- `target`: ESNext
- `module`: NodeNext
- `verbatimModuleSyntax`: enabled
- `resolveJsonModule`: enabled
- `composite`: enabled
- `sourceMap` and `declarationMap`: enabled
- `skipLibCheck`: enabled
- `forceConsistentCasingInFileNames`: enabled
- `allowSyntheticDefaultImports`: enabled

## License

[MIT License](../../LICENSE) © 2023-Present
