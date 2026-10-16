import { fileURLToPath } from 'node:url';

import type { Options } from 'prettier';

const config: Options = {
  arrowParens: 'always',
  printWidth: 80,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  plugins: [fileURLToPath(import.meta.resolve('prettier-plugin-packagejson'))],
};

export default config;
// Keep native require() consumers receiving the config object instead of an ESM namespace.
export { config as 'module.exports' };
