import type { ConfigObject } from '@eslint/core';

import bestPracticesConfig from './best-practices.ts';
import errorsConfig from './errors.ts';
import es6Config from './es6.ts';
import importsConfig from './imports.ts';
import styleConfig from './style.ts';
import variablesConfig from './variables.ts';

const config: readonly ConfigObject[] = [
  ...bestPracticesConfig,
  ...errorsConfig,
  ...es6Config,
  ...importsConfig,
  ...styleConfig,
  ...variablesConfig,
];

export default config;
