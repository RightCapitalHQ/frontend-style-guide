#!/usr/bin/env node
const shell = require('shelljs');

shell.config.verbose = true;

const beachballCheckResult = shell.exec('pnpm -w exec beachball check');

let shouldGenerateChangefile = false;
if (beachballCheckResult.code !== 0) {
  shouldGenerateChangefile = true;
}
// current Renovate PR lacks beachball changefile, we try to generate one

/** specified in /renovate.json */
const bumpTypeHeader = 'Beachball-bump-type: ';
const gitRevListCommand = 'git rev-list --max-count=1 --no-commit-header';

// fail the CI if any command fails
shell.config.fatal = true;

// we need to reuse the info from the renovate commit
const gitUser = shell
  .exec(`${gitRevListCommand} --format=%an HEAD`)
  .stdout.trim();
const gitEmail = shell
  .exec(`${gitRevListCommand} --format=%ae HEAD`)
  .stdout.trim();
const rawMessage = shell
  .exec(`${gitRevListCommand} --format=%B HEAD`)
  .split('\n');
const bumpTypeLineIndex = rawMessage.findIndex((line) =>
  line.startsWith(bumpTypeHeader),
);

let bumpType;
let message;
if (bumpTypeLineIndex === -1) {
  message = rawMessage.join('\n').trim();
} else {
  bumpType = rawMessage[bumpTypeLineIndex].replace(bumpTypeHeader, '');
  message = rawMessage.slice(0, bumpTypeLineIndex).join('\n').trim();
}

shell.exec(`git config user.name "${gitUser}"`);
shell.exec(`git config user.email "${gitEmail}"`);
if (shouldGenerateChangefile) {
  shell.exec(
    `npx beachball change --no-fetch --no-commit --type ${bumpType} --message "${message}"`,
  );
}
shell.exec('git add .');
shell.exec(`git commit --amend -m "${message}"`);
shell.exec('git push --force-with-lease');

if (shouldGenerateChangefile) {
  // fail the CI if we updated the changefile
  shell.exit(1);
}
