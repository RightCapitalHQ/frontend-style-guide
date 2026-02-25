import type { Options } from 'prettier';

const config: Options = {
  arrowParens: 'always',
  printWidth: 80,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  plugins: [require.resolve('prettier-plugin-packagejson')],
};

export = config;
