Tests for the `@rightcapital/oxlint-config` package.

## Introduction

We made tests for the `@rightcapital/oxlint-config` package to make sure we can:

1. Observe the changes of the generated configs during dependency upgrades (snapshots in `tests/__snapshots__`).
2. Lint the project in `fixtures/website` with real Oxlint, covering runtime profiles, file overrides, ESM/CommonJS and type-aware rules.
3. Consume the packed package in a clean project (`pnpm run test:packed`).

The snapshots show changes of the configuration, not changes in rule semantics.

## Packed package test

`pnpm run test:packed` runs `pnpm pack`, installs the tarball together with `oxlint`, `oxlint-tsgolint` and `typescript` from the registry, and lints a file with type-aware rules. It needs network access, so it is not part of `pnpm test`. CI runs it as a separate step.

## Dealing with dependency upgrades

When upgrading `oxlint` or `oxlint-tsgolint`, snapshot tests may fail because the rules enabled by a category changed.

1. Review the changes through the diff of the snapshot.
2. If they are expected, update the snapshots:

   ```sh
   pnpm test -- -u
   ```

3. Otherwise, adjust the config in `packages/oxlint-config`.

The supported version ranges are the `peerDependencies` of `packages/oxlint-config`. Keep the versions in this package's `devDependencies` and in `tests/packed-consumer.test.mts` inside those ranges.
