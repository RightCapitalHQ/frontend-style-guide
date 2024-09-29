// eslint-disable-next-line import-x/extensions
import 'core-js/es/set/index.js'; // for Node.js <22.0.0

import { cpus } from 'node:os';
import { basename } from 'node:path';

import { FlatCompat } from '@eslint/eslintrc';
import type { Entry } from '@nodelib/fs.walk';
import * as fsWalk from '@nodelib/fs.walk';
import { ESLint, type Rule } from 'eslint';
import { builtinRules } from 'eslint/use-at-your-own-risk';

const defaultCwd = process.cwd();

/** `${ruleId}` (from ESLint core) or `${pluginName}/${ruleName}` (from ESLint plugin) */
export type ESLintRuleId = string;
export interface IESLintRule {
  id: ESLintRuleId;
  meta: Rule.RuleMetaData | undefined;
}
export type ESLintRuleMap = Map<ESLintRuleId, IESLintRule>;

export interface IESLintConfigRulesLintResult {
  // other context
  readonly eslint: ESLint;
  readonly compat: FlatCompat;

  readonly pluginMap: Map<string, ESLint.Plugin>;
  /** all rules that can be used */
  readonly ruleMap: ESLintRuleMap;

  // calculated result
  /**
   * Rules that specified in the config file
   *
   * Whether the rule is 'off' or 'warn' or 'error' is not considered.
   */
  readonly usedRuleIds: Set<string>;
  readonly usedPluginSpecifiers: Set<string>;

  readonly usedUnknownRuleIds: Set<string>;
  readonly usedKnownRuleIds: Set<string>;
  readonly usedDeprecatedRuleIds: Set<string>;
}

const collator = new Intl.Collator('en');
/**
 * Sort ruleIds in a way that
 * core rules come first, then plugin rules
 * for human readability
 */
export const sortedRuleIds = (ruleIds: Iterable<string>): string[] =>
  Array.from(ruleIds).sort((a, b) => {
    if (a.includes('/') && !b.includes('/')) {
      return 1;
    }
    if (!a.includes('/') && b.includes('/')) {
      return -1;
    }
    return collator.compare(a, b);
  });

export const lintESLintConfigRules = async (
  /**
   * The directory to lint, default to `process.cwd()`
   */
  cwd = defaultCwd,
): Promise<IESLintConfigRulesLintResult> => {
  const eslint = new ESLint({ cwd });
  const compat = new FlatCompat({
    baseDirectory: cwd,
    resolvePluginsRelativeTo: cwd,
  });

  let usedRuleIds: Set<string> = new Set();
  let usedPluginSpecifiers: Set<string> = new Set();
  const ruleMap: ESLintRuleMap = new Map(
    Array.from(builtinRules.entries(), ([ruleId, rule]) => [
      ruleId,
      { id: ruleId, meta: rule.meta } satisfies IESLintRule,
    ]),
  );

  /**
   * Iterate over all files in the project to
   * collect used rules and plugin specifiers
   */
  await fsWalk
    .walkStream(
      cwd,
      new fsWalk.Settings({
        deepFilter: (_entry) =>
          !['.git', 'node_modules'].includes(basename(_entry.path)),
        entryFilter: (_entry) => _entry.dirent.isFile(),
      }),
    )
    .forEach(
      async (entry: Promise<Entry>) => {
        const config = (await eslint.calculateConfigForFile(
          (await entry).path,
        )) as
          | undefined
          | {
              rules: Record<string, unknown>;
              plugins: string[];
            };

        if (config !== undefined) {
          usedRuleIds = usedRuleIds.union(new Set(Object.keys(config.rules)));
          usedPluginSpecifiers = usedPluginSpecifiers.union(
            new Set(config.plugins),
          );
        }

        /**
         * config === undefined, means the file is ignored by ESLint
         * @see https://github.com/eslint/eslint/blob/63881dc11299aba1d0960747c199a4cf48d6b9c8/lib/eslint/eslint.js#L1208-L1212
         */
      },
      {
        concurrency: cpus().length * 2,
      },
    );

  // resolve all plugins
  const pluginMap: Map<string, ESLint.Plugin> = new Map(
    Object.entries(compat.plugins(...usedPluginSpecifiers)[0].plugins ?? {}),
  );

  for (const [pluginName, plugin] of pluginMap.entries()) {
    /**
     * MEMO: do not use plugin.meta.name, it is not always available
     */
    for (const [ruleId, rule] of Object.entries(plugin.rules ?? {})) {
      if (typeof rule === 'object') {
        ruleMap.set(`${pluginName}/${ruleId}`, {
          id: `${pluginName}/${ruleId}`,
          meta: rule.meta,
        });
      }
    }
  }

  const usedUnknownRules = usedRuleIds.difference(ruleMap);
  const usedKnownRules = usedRuleIds.intersection(ruleMap);
  const usedDeprecatedRules = new Set(
    Array.from(usedKnownRules).filter((ruleId) => {
      return ruleMap.get(ruleId)?.meta?.deprecated;
    }),
  );

  return {
    eslint,
    compat,

    usedRuleIds,
    usedPluginSpecifiers,
    pluginMap,
    ruleMap,

    usedUnknownRuleIds: usedUnknownRules,
    usedKnownRuleIds: usedKnownRules,
    usedDeprecatedRuleIds: usedDeprecatedRules,
  };
};
