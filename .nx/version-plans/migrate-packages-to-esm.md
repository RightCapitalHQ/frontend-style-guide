---
eslint: major
prettier-config: major
lint-eslint-config-rules: patch
---

Migrate all JavaScript packages to ESM-only with explicit type and runtime exports.

This is a breaking change for `@rightcapital/eslint-plugin` and `@rightcapital/prettier-config`: CommonJS builds are no longer provided, and both packages now require Node.js `^22.13.0 || >=24`. Load the Prettier config using an ESM default import, e.g. in `prettier.config.mjs`. Existing `prettier.config.cjs` files using `module.exports = require('@rightcapital/prettier-config')` remain compatible on supported Node.js versions through the `module.exports` interop export.

Compile package sources against `@rightcapital/tsconfig` (`target: ESNext`) with NodeNext module resolution, rewriting relative `.ts` imports for published JavaScript. Separate source builds from tests and development scripts through TypeScript project references.

Add explicit type exports for `@rightcapital/lint-eslint-config-rules` without changing its runtime API or Node.js requirements.
