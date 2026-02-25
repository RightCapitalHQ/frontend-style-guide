import { writeFile } from 'node:fs/promises';

import * as core from '@actions/core';
import { $ } from 'execa';
import { releaseVersion } from 'nx/release/index.js';

import { composePrBody } from './pr-body.js';
import { readVersionPlans } from './version-plan.js';

async function run(): Promise<void> {
  const branch = core.getInput('branch', { required: true });
  const base = core.getInput('base', { required: true });
  const prTitle = core.getInput('pr-title', { required: true });
  const banner = core.getInput('banner');
  const commitMessage =
    core.getInput('commit-message') || 'chore(release): prepare release';
  const label = core.getInput('label') || 'release';
  const token = core.getInput('token', { required: true });

  const gh$ = $({ env: { GH_TOKEN: token } });

  // Configure git user
  await $`git config user.email npm-publisher@rightcapital.com`;
  await $`git config user.name ${'GitHub Actions[bot]'}`;

  // Create or update release branch
  await $`git checkout -B ${branch}`;

  // Read version plans before releaseVersion() consumes them
  const plans = await readVersionPlans();

  // Run version bump via Nx programmatic API
  const { projectsVersionData } = await releaseVersion({
    dryRun: false,
    verbose: false,
  });

  // Update lock file after version bumps
  await $`pnpm install --no-frozen-lockfile`;

  // Stage, commit, and push
  await $`git add .`;
  try {
    await $`git commit -m ${commitMessage}`;
  } catch {
    core.info('No changes to commit');
  }
  await $`git push origin ${branch} --force`;

  // Generate PR body
  const body = composePrBody(banner, projectsVersionData, plans);
  await writeFile('pr-body.md', body);

  // Check for existing PR
  let prNumber = '';
  try {
    const { stdout } = await gh$`gh pr list --head ${branch} --json number --jq ${`.[0].number // empty`}`;
    prNumber = stdout.trim();
  } catch {
    // No existing PR found
  }

  let prUrl = '';

  if (!prNumber) {
    // Create new PR
    const result = await gh$`gh pr create --base ${base} --head ${branch} --title ${prTitle} --body-file pr-body.md --label ${label}`;
    prUrl = result.stdout.trim();
    const match = prUrl.match(/\/pull\/(\d+)$/);
    if (match) {
      prNumber = match[1]!;
    }
  } else {
    // Update existing PR
    await gh$`gh pr edit ${prNumber} --body-file pr-body.md`;
    const result = await gh$`gh pr view ${prNumber} --json url --jq ${'.url'}`;
    prUrl = result.stdout.trim();
  }

  core.setOutput('pr-url', prUrl);
  core.setOutput('pr-number', prNumber);

  core.info(`PR URL: ${prUrl}`);
  core.info(`PR Number: ${prNumber}`);
}

run().catch((error: unknown) => {
  core.setFailed(error instanceof Error ? error.message : String(error));
});
