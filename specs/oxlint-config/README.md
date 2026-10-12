Tests for the `@rightcapital/oxlint-config` package.

## Introduction

We made tests for the `@rightcapital/oxlint-config` package to make sure we can:

1. Observe the changes of the generated configs (snapshots in `tests/__snapshots__`).
2. Check that the plugin of every enabled rule is loaded, and that plugins are loaded for the rules of the project, because Oxlint silently ignores the rules of a plugin that is not.

## Scope

The package only generates the config, so the tests check the generated config and don't run Oxlint. How Oxlint treats the config, e.g. glob matching or the behavior of a rule, is not covered.

## Updating the snapshots

The snapshots only depend on the code in `packages/oxlint-config`, not on the version of Oxlint. After a change of the config, review the diff of the snapshots and update them if the change is expected:

```sh
pnpm test -- -u
```

The supported version ranges of `oxlint` and `oxlint-tsgolint` are the `peerDependencies` of `packages/oxlint-config`. Keep the versions in its `devDependencies` inside those ranges.
