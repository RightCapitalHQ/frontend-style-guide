# nx-release

Create git tags, GitHub releases, and publish to npm for an Nx-managed monorepo.

When the Release PR is merged to `main`, this action:

1. Discovers all packages from the Nx release groups in `nx.json`
2. Creates git tags for packages whose expected tag does not yet exist, and pushes them
3. Creates GitHub releases with changelog notes extracted from each package's `CHANGELOG.md`
4. Publishes packages to npm via `nx release publish`

## Usage

```yaml
- uses: ./.github/actions/nx-release
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
  env:
    NPM_CONFIG_PROVENANCE: true
```

## Inputs

| Input            | Required | Default | Description                                 |
| ---------------- | -------- | ------- | ------------------------------------------- |
| `token`          | Yes      |         | GitHub token used to create GitHub releases |
| `publish`        | No       | `true`  | Whether to publish packages to npm          |
| `create-release` | No       | `true`  | Whether to create GitHub releases           |
| `dry-run`        | No       | `false` | Run without making any changes              |

## Outputs

| Output      | Description                            |
| ----------- | -------------------------------------- |
| `new-tags`  | JSON array of newly created git tags   |
| `published` | Whether packages were published to npm |

## Workflow Configuration

The `release.yml` workflow triggers this action when the Release PR (from the `release` branch) is merged to `main`:

```yaml
on:
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  release:
    if: >-
      github.event.pull_request.merged == true
      && github.event.pull_request.head.ref == 'release'
    runs-on: ubuntu-latest
    permissions:
      contents: write
      id-token: write
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 0
          ref: main
          token: ${{ secrets.REPO_AUTOMATION_TOKEN }}

      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v6
        with:
          node-version-file: .node-version
          registry-url: https://registry.npmjs.org/
          cache: pnpm

      - run: pnpm install

      - uses: ./.github/actions/nx-release
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
        env:
          NPM_CONFIG_PROVENANCE: true
```

Key points:

- **`fetch-depth: 0`** — full history is needed so the action can read existing tags
- **`ref: main`** — checkout `main` (the merge target) so tags are created on the right commit
- **`registry-url`** — required for `npm publish` authentication via `NODE_AUTH_TOKEN`
- **`contents: write`** — allows pushing tags and creating GitHub releases
- **`id-token: write`** — enables npm provenance attestation

## Full Release Lifecycle

1. **Developer creates a feature branch**, makes changes, and runs `pnpm -w change` to generate a version plan in `.nx/version-plans/`
2. **PR is merged to `main`** — this triggers `release-pr.yml`, which runs the [`nx-release-pr`](../nx-release-pr/README.md) action to create or update a Release PR (`release` -> `main`) with bumped versions and a changelog
3. **Maintainer merges the Release PR** — this triggers `release.yml`, which runs the `nx-release` action
4. **`nx-release` runs the four steps**: discover packages, create & push tags, create GitHub releases, publish to npm

## How It Works with `nx-release-pr`

The two actions are complementary halves of the release pipeline:

| Action          | Trigger                        | Responsibility                                               |
| --------------- | ------------------------------ | ------------------------------------------------------------ |
| `nx-release-pr` | Version plans pushed to `main` | Bump versions, update lockfile, create/update the Release PR |
| `nx-release`    | Release PR merged to `main`    | Create tags, GitHub releases, publish to npm                 |

`nx-release-pr` prepares the release (version bumps, changelogs). `nx-release` finalizes it (tagging, publishing). Neither action needs to know about the other — they are connected by the `release` branch and the PR merge event.

## Build

Built with [rslib](https://lib.rsbuild.dev/) into a single CJS bundle at `dist/index.js`.

CJS is used instead of ESM because `signal-exit` (a transitive dependency) declares `const global = globalThis` which causes a TDZ error under ESM scope hoisting.

All dependencies are bundled except `nx`, which is externalized (provided by the workspace).

```bash
pnpm --filter nx-release run build
```

## Source Structure

| File               | Description                                                       |
| ------------------ | ----------------------------------------------------------------- |
| `src/main.ts`      | Entry point: orchestrates discover, tag, release, and publish     |
| `src/discover.ts`  | Reads Nx release groups and project graph to list packages        |
| `src/tagging.ts`   | Creates git tags for new versions and pushes them                 |
| `src/release.ts`   | Extracts latest notes from `CHANGELOG.md` and creates GH releases |
| `rslib.config.mts` | Build config: CJS bundle, `nx` externalized                       |
| `action.yml`       | GitHub Action metadata (node24)                                   |
