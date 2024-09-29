# Usage

## Renovate config

In your renovate config, set the [`commitBody`](https://docs.renovatebot.com/configuration-options/#commitbody) to `Beachball-bump-type: patch` (where `patch` could also be `minor`, `major`, or `none`) to specify the bump type for the updates.

For example, specify that all devDependencies updates should not trigger version bumps:

```json
{
  "packageRules": [
    {
      "groupName": "DevDependencies",
      "matchDepTypes": ["devDependencies"],
      "commitBody": "Beachball-bump-type: none"
    }
  ]
}
```

## GitHub Actions

1. Be sure to set the `BEACHBALL_AUTO_CHANGEFILE_TOKEN` secret with a token that has access to write to the repo. The action will use this token to push a commit back to the renovate PR.
2. Be sure to install npm dependencies in the job that calls this action.

```yaml
check-renovate-changefile:
  if: startsWith(github.event.pull_request.head.ref, 'renovate/') && github.base_ref == github.event.repository.default_branch
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
      with:
        ref: ${{ github.event.pull_request.head.ref }}
        token: ${{ secrets.BEACHBALL_AUTO_CHANGEFILE_TOKEN }}

    # Install dependencies (example using pnpm)
    - uses: pnpm/action-setup@v4
    - uses: actions/setup-node@v4
      with:
        node-version-file: .node-version
        cache: pnpm
    - run: pnpm install

    - name: Check and generate changefile for Renovate
      uses: RightCapitalHQ/frontend-style-guide/.github/actions/renovate-auto-beachball-changefile@main
```
