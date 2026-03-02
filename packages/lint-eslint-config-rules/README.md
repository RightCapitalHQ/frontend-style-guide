# @rightcapital/lint-eslint-config-rules

[![npm version](https://img.shields.io/npm/v/@rightcapital/lint-eslint-config-rules)](https://www.npmjs.com/package/@rightcapital/lint-eslint-config-rules)

A CLI tool that checks your ESLint configuration for deprecated and unknown rules.

## Prerequisites

- `eslint` (9.x or 10.x)

## Usage

```sh
npx @rightcapital/lint-eslint-config-rules
```

## Options

| Option         | Description                            |
| -------------- | -------------------------------------- |
| `-h`, `--help` | Display help message                   |
| `--cwd <path>` | The directory to lint (default: `cwd`) |
| `--json`       | Output all information in JSON format  |
| `--version`    | Display version number                 |

## Example output

```
Checking ESLint rules in /path/to/project
Discovered 250/500 used/available rules
No used deprecated rules found
No used unknown rules found
```

The process exits with code 1 if any deprecated or unknown rules are found, making it suitable for CI pipelines.

## License

[MIT License](../../LICENSE) © 2023-Present
