#!/usr/bin/env tsx

import { readFile, writeFile } from 'node:fs/promises';
import { relative, dirname } from 'node:path';
import * as glob from '@actions/glob';
import type { ChangelogJson, ChangelogJsonEntry, ChangeType } from 'beachball';

const repoUrl = process.env.REPO_URL;
const repoBlobUrl: string = `${repoUrl}/blob/main`;

function usage(): void {
  console.log(`Usage: generate-release-note-for-tag.ts <git tag> [output file]
\tgit tag: git tag to generate release note for
\toutput file: file to write release note to, default to release-note.md

\tExample: generate-release-note-for-tag.ts @scope/package_v1.0.0 release-note.md`);
}

function parseGitTag(tag: string):
  | undefined
  | {
      name: string;
      version: string;
    } {
  // @scope/package_v1.0.0
  // package_v1.0.0
  const beachballTagPattern =
    /^(?<name>(?:@[\w\-.]+\/)?[\w\-.]+)_v(?<version>\d\.\d\.\d.*)$/;

  const match = tag.match(beachballTagPattern);
  if (match) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { name, version } = match.groups!;
    return { name, version };
  }
  return undefined;
}

function generateReleaseNotes(
  changelog: ChangelogJsonEntry,
  changelogJsonPath: string,
): string {
  const changeTypes: ChangeType[] = ['major', 'minor', 'patch', 'none'];
  const releaseNotes = `## What's Changed

${changeTypes
  .map((changeType) => {
    const entryList = changelog.comments[changeType];
    if (entryList) {
      return entryList
        .map((changelogEntry) => {
          const { commit, comment } = changelogEntry;
          const commitLink =
            commit === 'not available'
              ? ''
              : ` [${commit.substring(0, 8)}](${repoUrl}/commit/${commit}) `;
          return `* ${commitLink}${comment}`;
        })
        .join('\n');
    }
    return '';
  })
  .join('\n\n')}

**Full Changelog**: ${repoBlobUrl}/${relative(
    process.cwd(),
    dirname(changelogJsonPath),
  )}/CHANGELOG.md`;

  return releaseNotes;
}

async function main(): Promise<number> {
  const argv = process.argv.slice(2);
  const gitTag: string | undefined = argv[0];
  const outputFilePath: string = argv[1] ?? 'release-note.md';

  if (!gitTag) {
    console.log('Missing git tag, exiting...');
    usage();
    return 1;
  }

  const parsedTag = parseGitTag(gitTag);
  if (!parsedTag) {
    console.log(
      `Cannot extract package name and version from git tag: ${gitTag}, exiting...`,
    );
    usage();
    return 1;
  }

  const { name, version } = parsedTag;
  const globber = await glob.create(`**/CHANGELOG.json`, {
    followSymbolicLinks: false,
  });
  for await (const changelogJsonPath of globber.globGenerator()) {
    const changelogJson = JSON.parse(
      await readFile(changelogJsonPath, 'utf-8'),
    ) as ChangelogJson;

    if (changelogJson.name !== name) {
      // eslint-disable-next-line no-continue
      continue;
    }

    console.log(`Found changelog for package ${name} at ${changelogJsonPath}`);
    const currentChangelog = changelogJson.entries.find(
      (entry) => entry.version === version,
    );

    if (!currentChangelog) {
      console.log(`Cannot find changelog for version ${version}, try next...`);
      // eslint-disable-next-line no-continue
      continue;
    }

    const releaseNotes = generateReleaseNotes(
      currentChangelog,
      changelogJsonPath,
    );
    await writeFile(outputFilePath, releaseNotes);
    return 0;
  }
  return 1;
}

if (require.main === module) {
  void main()
    .then((exitCode) => {
      process.exitCode = exitCode;
    })
    .catch((e) => {
      console.log(e);
      process.exitCode = 1;
    });
}
