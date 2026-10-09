import { mkdir, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { execa } from 'execa';
import { afterAll, beforeAll, expect, test } from 'vitest';

const packageDir = resolve(
  import.meta.dirname,
  '../../../packages/oxlint-config',
);

let workDir: string;
let consumerDir: string;

beforeAll(async () => {
  workDir = await mkdtemp(join(tmpdir(), 'oxlint-config-packed-'));
  const packDir = join(workDir, 'pack');
  consumerDir = join(workDir, 'consumer');
  await mkdir(packDir);
  await mkdir(join(consumerDir, 'src'), { recursive: true });

  await execa('pnpm', ['pack', '--pack-destination', packDir], {
    cwd: packageDir,
  });
  const [tarball] = await readdir(packDir);

  await writeFile(
    join(consumerDir, 'package.json'),
    JSON.stringify({
      private: true,
      type: 'module',
      // The consumer installs the peer dependencies directly:
      // Oxlint only looks for `oxlint-tsgolint` next to itself,
      // so a transitive dependency of the config is not enough.
      devDependencies: {
        '@rightcapital/oxlint-config': `file:../pack/${tarball}`,
        oxlint: '1.80.0',
        'oxlint-tsgolint': '7.0.2001',
        typescript: '7.0.2',
      },
    }),
  );
  await writeFile(
    join(consumerDir, 'oxlint.config.ts'),
    `import { createConfig } from '@rightcapital/oxlint-config';
export default createConfig({ runtime: 'node', recommended: true });
`,
  );
  await writeFile(
    join(consumerDir, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        module: 'nodenext',
        strict: true,
        noEmit: true,
        types: [],
      },
      include: ['src'],
    }),
  );
  await writeFile(
    join(consumerDir, 'src/index.ts'),
    'const load = async () => 1;\nload();\n',
  );

  await execa('pnpm', ['install', '--ignore-workspace'], { cwd: consumerDir });
}, 180_000);

afterAll(async () => {
  await rm(workDir, { recursive: true, force: true });
});

test('packed package runs type-aware rules in a consumer project', async () => {
  const { stdout } = await execa(
    'pnpm',
    ['exec', 'oxlint', '-c', 'oxlint.config.ts', '-f', 'json', 'src'],
    { cwd: consumerDir, reject: false },
  );
  expect(
    JSON.parse(stdout).diagnostics.map((d: { code: string }) => d.code),
  ).toEqual(['typescript(no-floating-promises)']);
}, 60_000);
