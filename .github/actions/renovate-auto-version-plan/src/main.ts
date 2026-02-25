import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import { $ } from 'execa';

const bumpTypeHeader = 'Nx-version-bump: ';

function gitHeadInfo(...args: string[]) {
  return $`git rev-list --max-count=1 --no-commit-header ${args} HEAD`;
}

async function configureGitUser() {
  const gitUser = await gitHeadInfo('--format=%an');
  const gitEmail = await gitHeadInfo('--format=%ae');

  await $`git config user.name ${gitUser}`;
  await $`git config user.email ${gitEmail}`;
}

async function parseBumpTypeAndMessage(): Promise<{
  bumpType: string;
  message: string;
} | null> {
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

async function getAffectedPackages(): Promise<string[]> {
  // Get list of changed files in this commit
  const { stdout } = await $`git diff-tree --no-commit-id --name-only -r HEAD`;
  const files = stdout.split('\n').filter(Boolean);

  // Map files to package names (Nx project names are the directory names)
  const packages = new Set<string>();
  for (const file of files) {
    if (file.startsWith('packages/')) {
      const parts = file.split('/');
      if (parts.length >= 2) {
        // Nx project name is the directory name
        const pkgDir = parts[1];
        packages.add(pkgDir);
      }
    }
  }

  if (packages.size === 0) {
    return [];
  }

  return Array.from(packages);
}

async function generateVersionPlan({
  bumpType,
  message,
}: {
  bumpType: string;
  message: string;
}) {
  const affectedPackages = await getAffectedPackages();

  // Skip if bump type is 'none'
  if (bumpType === 'none') {
    console.log('Bump type is "none", skipping version plan generation');
    return;
  }

  if (affectedPackages.length === 0) {
    console.log(
      'No package changes detected, skipping version plan generation',
    );
    return;
  }

  const planContent = `---
${affectedPackages.map((pkg) => `"${pkg}": ${bumpType}`).join('\n')}
---

${message}
`;

  const versionPlansDir = '.nx/version-plans';
  await fs.mkdir(versionPlansDir, { recursive: true });

  const fileName = `version-plan-${Date.now()}.md`;
  const filePath = path.join(versionPlansDir, fileName);

  await fs.writeFile(filePath, planContent);
  console.log(`Created version plan: ${filePath}`);
}

async function checkVersionPlan() {
  try {
    const result = await $({ reject: false })`pnpm exec nx release plan:check`;
    return result.exitCode === 0;
  } catch {
    return false;
  }
}

async function updateRenovateCommit({ message }: { message: string }) {
  await $`git add .`;
  await $`git commit --amend -m ${message}`;
  await $`git push --force-with-lease`;
}

async function main() {
  const hasVersionPlan = await checkVersionPlan();

  await configureGitUser();
  const bumpTypeAndMessage = await parseBumpTypeAndMessage();

  // do nothing if we cannot find the bump type from the Renovate commit
  // otherwise, we will later try to generate a version plan
  // and trim `bumpTypeHeader` from the commit message
  if (!bumpTypeAndMessage) {
    if (!hasVersionPlan) {
      console.log(`Version plan is missing, and auto generating failed.
\tCannot find ${bumpTypeHeader} in the commit message`);
      process.exitCode = 1;
      return;
    }
    console.log(`Everything is ok, nothing to do.`);
    process.exitCode = 0;
    return;
  }

  const { bumpType, message } = bumpTypeAndMessage;
  if (!hasVersionPlan) {
    await generateVersionPlan({ bumpType, message });
  }
  await updateRenovateCommit({ message });

  if (!hasVersionPlan) {
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
