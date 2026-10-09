import { createConfig } from '@rightcapital/oxlint-config';

export default createConfig({
  recommended: true,
  profiles: [
    { files: ['src/**'], runtime: 'browser', react: true },
    { files: ['tests/**'], runtime: ['node', 'browser'] },
    {
      files: ['scripts/**', '**/*.config.ts'],
      runtime: 'node',
      scripting: true,
    },
  ],
});
