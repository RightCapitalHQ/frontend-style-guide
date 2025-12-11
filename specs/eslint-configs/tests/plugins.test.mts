import fs from 'node:fs';
import { describe, expect, test } from 'vitest';
import {
  generateTypeContent,
  outputPath,
} from '../../../packages/eslint-config/scripts/generate-eslint-react-types.mts';

describe('@eslint-react plugin names typing', () => {
  test('generated ESLintReactPluginNames should be up to date with @eslint-react/eslint-plugin', async () => {
    const expectedContent = await generateTypeContent();
    const actualContent = fs.readFileSync(outputPath, 'utf-8');

    expect(
      actualContent,
      'ESLintReactPluginNames is out of date. Run `pnpm --filter @rightcapital/eslint-config generate:types` to fix.',
    ).toBe(expectedContent);
  });
});
