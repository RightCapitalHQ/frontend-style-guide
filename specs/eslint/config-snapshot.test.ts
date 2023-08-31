import { readdirSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { test, describe, expect } from '@jest/globals';
import { execa } from 'execa';

const eslintExec = resolve(__dirname, 'node_modules', '.bin', 'eslint');
const srcDir = resolve(__dirname, 'src');

const sampleFiles = readdirSync(srcDir).map((filename) =>
  resolve(srcDir, filename),
);

/**
 * Make snapshot for the result of `eslint --print-config <file>`
 * Thus we can easily inspect the upgrade of upstream configs.
 *
 * @see https://eslint.org/docs/latest/use/command-line-interface#--print-config
 */
describe('resolved config matches snapshot', () => {
  for (const file of sampleFiles) {
    test(basename(file), async () => {
      expect({
        ...JSON.parse(
          (await execa(eslintExec, ['--print-config', file])).stdout,
        ),
        // this field contains environment related path, which is not suitable for snapshot
        parser: '<OMITTED>',
      }).toMatchSnapshot();
    });
  }
});
