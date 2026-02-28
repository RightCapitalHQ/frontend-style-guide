import { $ } from 'execa';

const bumpTypeHeader = 'Nx-version-bump: ';
const baseRef = process.env.GITHUB_BASE_REF
  ? `origin/${process.env.GITHUB_BASE_REF}`
  : 'HEAD~1';

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

async function generateVersionPlan({
  bumpType,
  message,
}: {
  bumpType: string;
  message: string;
}) {
  // nx release plan handles:
  // - detecting affected projects (--onlyTouched defaults to true)
  // - mapping to release groups (e.g., eslint-config → "eslint" fixed group)
  // - writing the version plan file in .nx/version-plans/
  const result = await $({
    reject: false,
  })`pnpm exec nx release plan ${bumpType} --message ${message} --base ${baseRef}`;

  console.log(result.stdout);
  if (result.stderr) {
    console.error(result.stderr);
  }

  if (result.exitCode !== 0) {
    throw new Error(
      `nx release plan failed with exit code ${String(result.exitCode)}`,
    );
  }
}

async function checkVersionPlan() {
  try {
    const result = await $({
      reject: false,
    })`pnpm exec nx release plan:check --base ${baseRef}`;
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
