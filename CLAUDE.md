# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is RightCapital's frontend style guide monorepo containing ESLint configurations, Prettier configs, TypeScript configs, and related tooling packages. The monorepo uses pnpm workspaces with Nx for task orchestration.

## Common Commands

```bash
# Build all packages (via Nx)
pnpm run build

# Run tests
pnpm run test

# Run linting (ESLint + Prettier)
pnpm run lint

# Auto-fix linting issues
pnpm run fix

# TypeScript type checking (via Nx)
pnpm run typecheck

# Watch mode for development
pnpm run dev

# Create a version plan before PR (required for PRs with publishable changes)
pnpm run change

# Check that a version plan exists (used in CI)
pnpm run check

# Interactive commit with conventional commit prompts
pnpm run commit

# Build internal GitHub Actions (must be done after changing action source)
pnpm --filter nx-release-pr run build
pnpm --filter renovate-auto-version-plan run build
```

## Architecture

### Package Structure

- `packages/eslint-config` - ESLint flat config (v9+) with presets: `recommended`, `js`, `ts`, `react`, `node`, `script`
- `packages/eslint-plugin` - Custom ESLint rules (e.g., `jsx-no-unused-expressions`, `no-explicit-type-on-function-component-identifier`)
- `packages/prettier-config` - Prettier configuration
- `packages/tsconfig` - Shared TypeScript configuration
- `packages/lint-eslint-config-rules` - CLI tool for validating ESLint config rules

### Specs (E2E Tests)

- `specs/eslint-configs` - Integration tests for ESLint configurations
- `specs/lint-eslint-config-rules` - Tests for the lint-eslint-config-rules CLI

### Internal GitHub Actions

- `.github/actions/nx-release-pr` - Creates/updates a release PR when version plans are pushed to main
- `.github/actions/renovate-auto-version-plan` - Auto-generates Nx version plans for Renovate PRs

Both are TypeScript projects built with rslib into CJS bundles (`dist/index.js`). They use `"module": "preserve"` in tsconfig and output CJS (not ESM) to avoid a TDZ error from `signal-exit`'s ESM scope hoisting.

### Build System

The `@nx/js/typescript` plugin auto-infers `build`, `typecheck`, and `clean` targets from `tsconfig.lib.json` files. Each package has a `project.json` for Nx metadata; most have empty `targets: {}` since the plugin handles inference.

### Build Output

Compiled TypeScript outputs to `packages/*/lib/`. Source is in `packages/*/src/`.

## Technical Details

- **Node version**: 24.10.0 (see `.node-version`)
- **Package manager**: pnpm 10.12.1 with workspace support
- **Module system**: ESM (`"type": "module"`)
- **Test framework**: Vitest
- **Versioning**: Nx Release with version plans

## Nx Release

Versioning uses Nx Release with version plans (markdown files in `.nx/version-plans/`).

Two release groups:

- **eslint** (fixed) - `eslint-config` and `eslint-plugin` always release together at the same version
- **other** (independent) - `prettier-config`, `tsconfig`, `lint-eslint-config-rules` release independently

Release flow:

1. Contributors run `pnpm run change` to create a version plan
2. When version plans are pushed to `main`, the `release-pr.yml` workflow creates/updates a release PR on the `release` branch
3. Merging the release PR triggers `release.yml` which publishes to npm and creates GitHub releases

## Workflow Requirements

- Run `pnpm run change` before creating PRs to generate a version plan (stored in `.nx/version-plans/`)
- ESLint uses modern flat config format (`eslint.config.mjs`)
- Conventional commits are enforced via commitlint
- Releases happen via Release PR workflow (not automatic on main)
