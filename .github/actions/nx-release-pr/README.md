# nx-release-pr

Create or update a release PR for an Nx-managed monorepo.

When version plans are pushed to `main`, this action:

1. Creates a `release` branch from `main`
2. Reads version plan files from `.nx/version-plans/`
3. Runs `releaseVersion()` from the Nx programmatic API to bump package versions
4. Updates the pnpm lockfile
5. Commits, pushes to the release branch
6. Creates a new PR (or updates an existing one) with a version table and grouped changes

## Usage

```yaml
- uses: ./.github/actions/nx-release-pr
  with:
    branch: release
    base: main
    pr-title: 'chore(release): release packages'
    token: ${{ secrets.REPO_AUTOMATION_TOKEN }}
```

## Inputs

| Input            | Required | Default                           | Description                                  |
| ---------------- | -------- | --------------------------------- | -------------------------------------------- |
| `branch`         | Yes      |                                   | Branch name for the release (e.g. `release`) |
| `base`           | Yes      |                                   | Base branch for the PR (e.g. `main`)         |
| `pr-title`       | Yes      |                                   | Pull request title                           |
| `banner`         | No       | `''`                              | Markdown banner prepended to the PR body     |
| `commit-message` | No       | `chore(release): prepare release` | Git commit message for the version bump      |
| `label`          | No       | `release`                         | Label to apply to the PR                     |
| `token`          | Yes      |                                   | GitHub token for git push and PR operations  |

## Outputs

| Output      | Description                         |
| ----------- | ----------------------------------- |
| `pr-url`    | URL of the created or updated PR    |
| `pr-number` | Number of the created or updated PR |

## PR Body

The generated PR body includes:

- A version table showing each package's current and new version
- A changes section grouped by bump type:
  - **Breaking Changes** (major bumps)
  - **New Features** (minor bumps)
  - **Fixes & Improvements** (patch bumps)

## Build

Built with [rslib](https://lib.rsbuild.dev/) into a single CJS bundle at `dist/index.js`.

CJS is used instead of ESM because `signal-exit` (a transitive dependency) declares `const global = globalThis` which causes a TDZ error under ESM scope hoisting.

All dependencies are bundled except `nx`, which is externalized (provided by the workspace).

```bash
pnpm --filter nx-release-pr run build
```

## Source Structure

| File                  | Description                                                                          |
| --------------------- | ------------------------------------------------------------------------------------ |
| `src/main.ts`         | Entry point: orchestrates version bump, git operations, and PR creation via `gh` CLI |
| `src/version-plan.ts` | Parses version plan markdown files (YAML front matter + description)                 |
| `src/pr-body.ts`      | Generates PR body with version table and grouped changes                             |
| `rslib.config.mts`    | Build config: CJS bundle, `nx` externalized                                          |
| `action.yml`          | GitHub Action metadata (node24)                                                      |
