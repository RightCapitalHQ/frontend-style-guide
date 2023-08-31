Basic snapshot tests for the `@rightcapital/eslint-config-*` packages.

## Introduction

We made snapshot tests for the `@rightcapital/eslint-config-*` packages to make sure we can observe the changes of the configs during dependency upgrades. See [config-snapshot.test.ts][] for details.

[config-snapshot.test.ts]: ./config-snapshot.test.ts

## Dealing with dependency upgrades

When upgrading dependencies, snapshot tests may fail because of the changes of the configs. e.g. `eslint-config-airbnb-base` changed some rules in a new version.

In this case:

1.  Review the changes of the configs through the diff of the snapshot.

2.  Check if the changes are expected:

    1. If yes, update the snapshot by running(the `-u` flag is Jest's [updateSnapshot](https://jestjs.io/docs/cli#--updatesnapshot) flag):

       ```sh
       pnpm test -- -u
       ```

    2. Otherwise, manually update the configs to fit our needs, and update the snapshot if needed.
