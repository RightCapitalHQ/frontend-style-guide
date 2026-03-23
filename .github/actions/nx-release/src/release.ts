import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';

import type { IPackageInfo } from './discover.js';

async function extractLatestNotes(changelogPath: string): Promise<string> {
  let content: string;
  try {
    content = await readFile(changelogPath, 'utf8');
  } catch {
    return '';
  }

  const lines = content.split('\n');
  let found = false;
  const noteLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (found) {
        break;
      }
      found = true;
    } else if (found) {
      noteLines.push(line);
    }
  }

  return noteLines.join('\n').trim();
}

async function releaseExists(
  octokit: ReturnType<typeof getOctokit>,
  tag: string,
): Promise<boolean> {
  try {
    await octokit.rest.repos.getReleaseByTag({
      ...context.repo,
      tag,
    });
    return true;
  } catch (error) {
    // 404 means no release exists.
    // Re-throw anything else (auth errors, rate limits, etc.)
    if (
      error != null &&
      typeof error === 'object' &&
      'status' in error &&
      error.status === 404
    ) {
      return false;
    }
    throw error;
  }
}

export async function createGitHubReleases(
  packages: IPackageInfo[],
  token: string,
  dryRun: boolean,
): Promise<void> {
  const octokit = getOctokit(token);

  for (const pkg of packages) {
    if (dryRun) {
      core.info(`[dry-run] Would create GitHub release for ${pkg.expectedTag}`);
      // eslint-disable-next-line no-await-in-loop
    } else if (await releaseExists(octokit, pkg.expectedTag)) {
      core.info(
        `GitHub release for ${pkg.expectedTag} already exists, skipping`,
      );
    } else {
      const changelogPath = join(pkg.root, 'CHANGELOG.md');
      // eslint-disable-next-line no-await-in-loop
      const notes = await extractLatestNotes(changelogPath);

      // eslint-disable-next-line no-await-in-loop
      await octokit.rest.repos.createRelease({
        ...context.repo,
        tag_name: pkg.expectedTag,
        name: pkg.expectedTag,
        body: notes,
      });

      core.info(`Created GitHub release for ${pkg.expectedTag}`);
    }
  }
}
