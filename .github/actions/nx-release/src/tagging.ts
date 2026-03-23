import * as core from '@actions/core';
import { $ } from 'execa';

import type { IPackageInfo } from './discover.js';

export async function getExistingTags(): Promise<Set<string>> {
  const { stdout } = await $`git tag --list`;
  return new Set(stdout.split('\n').filter(Boolean));
}

export async function createAndPushTags(
  packages: IPackageInfo[],
  dryRun: boolean,
): Promise<string[]> {
  const existingTags = await getExistingTags();

  const tagsToCreate = packages.filter(
    (pkg) => !existingTags.has(pkg.expectedTag),
  );

  for (const pkg of packages) {
    if (existingTags.has(pkg.expectedTag)) {
      core.info(`Tag ${pkg.expectedTag} already exists, skipping`);
    }
  }

  // Tags must be created sequentially (git tag is a local operation)
  for (const pkg of tagsToCreate) {
    if (dryRun) {
      core.info(`[dry-run] Would create tag ${pkg.expectedTag}`);
    } else {
      // eslint-disable-next-line no-await-in-loop
      await $`git tag ${pkg.expectedTag}`;
      core.info(`Created tag ${pkg.expectedTag}`);
    }
  }

  if (tagsToCreate.length > 0 && !dryRun) {
    const newTags = tagsToCreate.map((pkg) => pkg.expectedTag);
    await $`git push origin ${newTags}`;
    core.info(`Pushed ${tagsToCreate.length} new tag(s)`);
  }

  return tagsToCreate.map((pkg) => pkg.expectedTag);
}
