import * as core from '@actions/core';
import { $ } from 'execa';

import { discoverPackages } from './discover.js';
import { createGitHubReleases } from './release.js';
import { createAndPushTags } from './tagging.js';

async function run(): Promise<void> {
  const token = core.getInput('token', { required: true });
  core.setSecret(token);
  const publish = core.getBooleanInput('publish');
  const createRelease = core.getBooleanInput('create-release');
  const dryRun = core.getBooleanInput('dry-run');

  // 1. Discover packages
  const packages = await discoverPackages();
  core.info(
    `Discovered ${packages.length} package(s): ${packages.map((p) => p.npmName).join(', ')}`,
  );

  // 2. Create git tags
  const newTags = await createAndPushTags(packages, dryRun);
  core.setOutput('new-tags', JSON.stringify(newTags));

  if (newTags.length === 0) {
    core.info('No new tags created');
  }

  // 3. Create GitHub releases
  if (createRelease) {
    await createGitHubReleases(packages, token, dryRun);
  }

  // 4. Publish to npm
  if (publish) {
    if (dryRun) {
      core.info('[dry-run] Would publish to npm');
      core.setOutput('published', 'false');
    } else {
      await $`pnpm exec nx release publish`;
      core.info('Published packages to npm');
      core.setOutput('published', 'true');
    }
  } else {
    core.setOutput('published', 'false');
  }
}

run().catch((error: unknown) => {
  core.setFailed(error instanceof Error ? error.message : String(error));
});
