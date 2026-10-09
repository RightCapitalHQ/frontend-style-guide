import { resolve } from 'node:path';

import { execa } from 'execa';

export const fixtureDir = resolve(import.meta.dirname, '../fixtures/website');

const oxlintBin = resolve(import.meta.dirname, '../node_modules/.bin/oxlint');

export interface Diagnostic {
  code: string;
  severity: string;
  filename: string;
}

/**
 * Oxlint exits with 1 when it reports errors and with 2 or more when it fails to run,
 * e.g. when the config can't be loaded or `oxlint-tsgolint` is missing.
 */
export const runOxlint = async (...args: string[]) => {
  const { stdout, stderr, exitCode } = await execa(
    oxlintBin,
    ['-c', 'oxlint.config.ts', ...args],
    { cwd: fixtureDir, reject: false },
  );
  if (exitCode !== 0 && exitCode !== 1) {
    throw new Error(`oxlint exited with code ${exitCode}:\n${stderr}`);
  }
  return stdout;
};

export const lintFixtures = async () => {
  const { diagnostics } = JSON.parse(await runOxlint('-f', 'json', '.')) as {
    diagnostics: Diagnostic[];
  };
  return diagnostics;
};
