#!/usr/bin/env tsx
import 'zx/globals';

export interface IReleaseJson {
  name: string;
  packagePath: string;
  gitTag: string;
  releaseNotes: string;
}

const main = async (): Promise<void> => {
  const cwd = process.cwd();
  echo('Trying to create GitHub release under: ', cwd);
  let releaseJson: IReleaseJson | undefined;
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, import/no-dynamic-require, global-require
    releaseJson = require(`${cwd}/RELEASE.json`);
  } catch (e) {
    echo(e);
    echo('Skipping release creation');
  }
  if (releaseJson) {
    const { releaseNotes, gitTag } = releaseJson;
    {
      const gh = $`gh release create ${gitTag} --verify-tag -F -`;
      gh.stdin.write(releaseNotes);
      gh.stdin.end();
      await gh;
    }
  }
};

// eslint-disable-next-line no-void
void main();
