import { RuleTester } from '@typescript-eslint/rule-tester';
import { afterAll, describe, test } from 'vitest';

export class VitestRuleTester extends RuleTester {
  public static describe: typeof describe = describe;

  public static describeSkip: typeof describe.skip = describe.skip;

  public static it: typeof test = test;

  public static itOnly: typeof test.only = test.only;

  public static itSkip: typeof test.skip = test.skip;

  public static afterAll: typeof afterAll = afterAll;
}
