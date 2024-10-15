Tests for the `@rightcapital/eslint-config` package.(targeted for ESLint v9)

## Introduction

We made tests(see [presets.test.mts][] for details.) for the `@rightcapital/eslint-config` package to make sure we can:

1. Observe the changes of the configs during dependency upgrades.
2. Ensure no rules are conflicting with Prettier.
3. Ensure no deprecated rules are used, or at least we are aware of them.

[presets.test.mts]: ./presets.test.mts

## Dealing with dependency upgrades

When upgrading dependencies, snapshot tests may fail because of the changes of the configs. e.g. `plugin:@typescript-eslint/recommended-type-checked` changed some rules in a new version.

In this case:

1.  Review the changes of the configs through the diff of the snapshot.

2.  Check if the changes are expected:

    1. If yes, update the snapshot by running(the `-u` flag is Vitests's [snapshot updating](https://vitest.dev/guide/snapshot.html#updating-snapshots) flag):

       ```sh
       pnpm test -- -u
       ```

    2. Otherwise, manually update the configs to fit our needs, and update the snapshot if needed.
