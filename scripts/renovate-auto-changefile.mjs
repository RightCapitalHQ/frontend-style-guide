#!/usr/bin/env node
import { $, echo } from 'zx';

const bumpTypeHeader = 'Beachball-bump-type: ';

/**
 * @param {string[]} args git-rev-list args
 * @returns {ProcessPromise}
 */
function gitHeadInfo(...args) {
  return $`git rev-list --max-count=1 --no-commit-header ${args} HEAD`;
}

async function configureGitUser() {
  const gitUser = await gitHeadInfo('--format=%an');
  const gitEmail = await gitHeadInfo('--format=%ae');

  await $`git config user.name ${gitUser}`;
  await $`git config user.email ${gitEmail}`;
}

/**
 * @returns {Promise<{bumpType: string, message: string} | null>}
 */
async function parseBumpTypeAndMessage() {
  const rawMessage = (await gitHeadInfo('--format=%B')).stdout.split('\n');
  const bumpTypeLineIndex = rawMessage.findIndex((line) =>
    line.startsWith(bumpTypeHeader),
  );

  if (bumpTypeLineIndex === -1) {
    return null;
  }

  const bumpType = rawMessage[bumpTypeLineIndex].replace(bumpTypeHeader, '');
  const message = rawMessage.slice(0, bumpTypeLineIndex).join('\n').trim();

  return { bumpType, message };
}

/**
 * @param {{bumpType:string, message: string}} options
 * @returns {Promise<void>}
 */
async function generateChangefile({ bumpType, message }) {
  await $`npx beachball change --no-fetch --no-commit --type ${bumpType} --message ${message}`;
}

/**
 * @param {{message: string}} options
 * @returns {Promise<void>}
 */
async function updateRenovateCommit({ message }) {
  await $`git add .`;
  await $`git commit --amend -m ${message}`;
  await $`git push --force-with-lease`;
}

async function main() {
  const isMissingChangefile =
    (await $`pnpm -w exec beachball check`.exitCode) !== 0;

  await configureGitUser();
  const bumpTypeAndMessage = await parseBumpTypeAndMessage();

  // do nothing if we cannot find the bump type from the Renovate commit
  // otherwise, we will later try to generate a changefile
  // and trim `bumpTypeHeader` from the commit message
  if (!bumpTypeAndMessage) {
    if (isMissingChangefile) {
      echo`Changefile is missing, and auto generating changefile failed.
\tCannot find ${bumpTypeHeader} in the commit message`;
      process.exitCode = 1;
      return;
    }
    echo`Everything is ok, nothing to do.`;
    process.exitCode = 0;
    return;
  }

  const { bumpType, message } = bumpTypeAndMessage;
  if (isMissingChangefile) {
    await generateChangefile({ bumpType, message });
  }
  await updateRenovateCommit({ message });

  if (isMissingChangefile) {
    process.exitCode = 1;
  }
}

main();
