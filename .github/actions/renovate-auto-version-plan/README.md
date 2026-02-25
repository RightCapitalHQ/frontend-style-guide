# renovate-auto-version-plan

Automatically generate Nx version plans for Renovate PRs.

Renovate commits include an `Nx-version-bump: <type>` header in the commit body (configured in `renovate.json`). This action parses that header and generates the corresponding version plan file.

## How It Works

1. Check if a version plan already exists (`nx release plan:check`)
2. Parse the `Nx-version-bump: <type>` header from the HEAD commit message
3. Detect affected packages from the changed files in the commit
4. Generate a version plan in `.nx/version-plans/` (unless bump type is `none`)
5. Amend the commit to remove the bump type header and include the version plan
6. Force-push the amended commit back to the PR branch
7. Exit with code 1 if a new plan was generated (signals CI that the commit was amended and a re-run is needed)

## Usage

```yaml
- uses: ./.github/actions/renovate-auto-version-plan
```

No inputs are required. The action reads everything from the git commit and repository state.

## Bump Type Mapping

Configured in `renovate.json` at the repository root:

| Rule                          | Bump Type          |
| ----------------------------- | ------------------ |
| Default                       | `patch`            |
| Dev dependencies              | `none`             |
| Lock file maintenance         | `none`             |
| Peer dependency major updates | `major`            |
| ESLint rule/plugin updates    | `major`            |
| ESLint core updates           | `none` (automerge) |

## Exit Codes

| Code | Meaning                                                                                                                             |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 0    | Version plan already existed, or bump type header found and commit was amended successfully                                         |
| 1    | New version plan was generated and commit was amended (CI should re-run), or no bump type header found and no existing version plan |

## Build

Built with [rslib](https://lib.rsbuild.dev/) into a single CJS bundle at `dist/index.js`.

CJS is used instead of ESM because `signal-exit` (a transitive dependency) declares `const global = globalThis` which causes a TDZ error under ESM scope hoisting.

All dependencies are bundled (no externals).

```bash
pnpm --filter renovate-auto-version-plan run build
```

## Source Structure

| File               | Description                                                                             |
| ------------------ | --------------------------------------------------------------------------------------- |
| `src/main.ts`      | Entry point: checks for existing plans, parses bump type, generates plan, amends commit |
| `rslib.config.mts` | Build config: CJS bundle, all deps bundled                                              |
| `action.yml`       | GitHub Action metadata (node24)                                                         |
