import { RuleTester } from '@typescript-eslint/rule-tester';
import { afterAll, describe, test } from 'vitest';

export class VitestRuleTester extends RuleTester {
  static describe: typeof describe = describe;

  static describeSkip: typeof describe.skip = describe.skip;

  static it: typeof test = test;

  static itOnly: typeof test.only = test.only;

  static itSkip: typeof test.skip = test.skip;

  static afterAll: typeof afterAll = afterAll;
}
