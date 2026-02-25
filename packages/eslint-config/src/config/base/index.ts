import type { ConfigObject } from '@eslint/core';

import bestPracticesConfig from './best-practices.js';
import errorsConfig from './errors.js';
import es6Config from './es6.js';
import importsConfig from './imports.js';
import styleConfig from './style.js';
import variablesConfig from './variables.js';

const config: readonly ConfigObject[] = [
  ...bestPracticesConfig,
  ...errorsConfig,
  ...es6Config,
  ...importsConfig,
  ...styleConfig,
  ...variablesConfig,
];

export default config;
