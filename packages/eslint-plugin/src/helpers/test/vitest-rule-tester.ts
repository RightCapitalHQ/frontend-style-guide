import { RuleTester } from 'eslint';
import { describe, test } from 'vitest';

export class VitestRuleTester extends RuleTester {
  static describe: typeof describe = describe;

  static it: typeof test = test;
}
