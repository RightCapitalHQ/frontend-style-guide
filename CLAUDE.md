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
pnpm -w change

# Check that a version plan exists (used in CI)
pnpm run check

# Interactive commit with conventional commit prompts
pnpm run commit

```

## Architecture

### Package Structure

- `packages/eslint-config` - ESLint flat config (v9+) with presets: `recommended`, `js`, `ts`, `react`, `node`, `script`, `disableExpensiveRules`
- `packages/eslint-plugin` - Custom ESLint rules (e.g., `jsx-no-unused-expressions`, `no-explicit-type-on-function-component-identifier`, `no-ignore-return-value-of-react-hooks`)
- `packages/prettier-config` - Prettier configuration
- `packages/tsconfig` - Shared TypeScript configuration
- `packages/lint-eslint-config-rules` - CLI tool for validating ESLint config rules

### Specs (E2E Tests)

- `specs/eslint-configs` - Integration tests for ESLint configurations
- `specs/lint-eslint-config-rules` - Tests for the lint-eslint-config-rules CLI

### Shared GitHub Actions

The `nx-release-pr`, `nx-release`, and `nx-release-auto-plan` actions are consumed from [RightCapitalHQ/actions](https://github.com/RightCapitalHQ/actions) as shared reusable actions/workflows.

### Build System

The `@nx/js/typescript` plugin auto-infers `build` (from `tsconfig.src.json`) and `typecheck` (from `tsconfig.json`) targets. Each package has a `project.json` for Nx metadata; most have empty `targets: {}` since the plugin handles inference.

The `@nx/js:typescript-sync` generator manages references between `tsconfig.src.json` files. Keep `tsconfig.misc.json` references hand-maintained and point them to source configs rather than other packages' tests.

### TypeScript Configuration

TypeScript project references are used throughout, and each TypeScript file belongs to one config:

- `tsconfig.base.json` - Extends the published `@rightcapital/tsconfig`, enables relative `.ts` imports rewritten on emit, and shares strict index/optional-property checks and module settings across source, test, and configuration files
- `tsconfig.json` - Root solution referencing the package solutions, specs, and root miscellaneous config
- `tsconfig.misc.json` - Root-level TypeScript configuration files
- `packages/*/tsconfig.json` - Package solution (`"files": []`)
- `packages/*/tsconfig.src.json` - Published source, emitted to `lib/`; references workspace dependencies' source configs
- `packages/*/tsconfig.misc.json` - Tests, test helpers, and development scripts where present, emitting declarations to `node_modules/.cache/rightcapital/typecheck`
- `specs/*/tsconfig.json` - Spec solution referencing `tsconfig.misc.json` for integration tests and fixtures; the miscellaneous config references package source configs, plus the ESLint config's miscellaneous config to test its type-generation script

The JSON-only `@rightcapital/tsconfig` package contains the shared config for consumers and does not need a build target.

### Build Output

Compiled TypeScript outputs to `packages/*/lib/`. Source is in `packages/*/src/`.

## Technical Details

- **Node version**: 24.16.0 (see `.node-version`)
- **Package manager**: pnpm 11.5.2 with workspace support
- **Module system**: ESM-only (`"type": "module"` with explicit package exports)
- **Test framework**: Vitest
- **Versioning**: Nx Release with version plans

## Development Workflow

1. Create a `feature/*` branch, make changes, and run `pnpm -w change` to generate a version plan
2. Open a PR to `main` and merge after review
3. Merge the automatically created Release PR (`release` → `main`) to publish packages to npm

Additional conventions:

- ESLint configs use `.mjs` and are loaded directly by Node.js. Prettier configs use `.mts` with Node.js native TypeScript support.
- The ESM-only Prettier package also exports `module.exports` for native Node.js `require()` compatibility with existing `.cjs` configurations.
- The pnpm packing hook uses the automatically discovered `.pnpmfile.mjs`. Prefer tool-provided types when migrating configs to TypeScript; do not add hand-written stand-in interfaces just to change the file extension.
- Conventional commits are enforced via commitlint
- Use `pnpm exec` or `pnpm dlx` instead of `npx` for running binaries

## Nx Release

Versioning uses Nx Release with version plans (markdown files in `.nx/version-plans/`).

Two release groups:

- **eslint** (fixed) - `eslint-config` and `eslint-plugin` always release together at the same version
- **other** (independent) - `prettier-config`, `tsconfig`, `lint-eslint-config-rules` release independently

CI enforcement:

- The `check-version-plan` job in `ci.yml` requires a version plan on PRs to `main`, **except** for the Release PR (from the `release` branch)

## Branching

- `main` - Default branch; all PRs target `main`
- `feature/*` - Development branches for all changes (features, fixes, refactors, etc.)
- `renovate/*` - Automated dependency update branches created by Renovate
- `release` - Holds the Release PR content; created/updated by `release-pr.yml`, merged back into `main` to trigger a release
