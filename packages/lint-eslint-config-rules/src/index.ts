import 'core-js/es/set/union'; // for Node.js <22.0.0
import 'core-js/es/set/intersection'; // for Node.js <22.0.0
import 'core-js/es/set/difference'; // for Node.js <22.0.0

import { join } from 'node:path';

import { FlatCompat } from '@eslint/eslintrc';
import * as fsWalk from '@nodelib/fs.walk';
import { ESLint, type Rule } from 'eslint';
import { builtinRules } from 'eslint/use-at-your-own-risk';

const defaultCwd = process.cwd();

export interface IUsableRule {
  /** ruleId (including plugin prefix) */
  fullRuleId: string;
  /** ruleId (without plugin prefix) */
  shortRuleId: string;
  meta?: Rule.RuleMetaData;
}
export type UsableRulesMap = Map<
  /** equivalent to {@link UsableRule.fullRuleId} */
  string,
  IUsableRule
>;

export interface IESLintConfigRulesLintResult {
  // other context
  readonly eslint: ESLint;
  readonly compat: FlatCompat;

  readonly pluginsMap: Map<string, ESLint.Plugin>;
  readonly rulesMap: UsableRulesMap;

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
export const lintESLintConfigRules = async (
  cwd = defaultCwd,
): Promise<IESLintConfigRulesLintResult> => {
  const eslint = new ESLint({ cwd });
  const compat = new FlatCompat({
    baseDirectory: cwd,
    resolvePluginsRelativeTo: cwd,
  });

  let usedRuleIds: Set<string> = new Set();
  let usedPluginSpecifiers: Set<string> = new Set();
  const rulesMap: UsableRulesMap = new Map(
    Array.from(builtinRules.entries()).map<[fullRuleId: string, IUsableRule]>(
      ([ruleId, rule]) => [
        ruleId,
        {
          fullRuleId: ruleId,
          shortRuleId: ruleId,
          meta: rule.meta,
        },
      ],
    ),
  );

  /**
   * Iterate over all files in the project to
   * collect used rules and plugin specifiers
   */
  for (const entry of fsWalk.walkSync(
    cwd,
    new fsWalk.Settings({
      deepFilter: (_entry) =>
        !(
          _entry.path.startsWith(join(cwd, 'node_modules')) ||
          _entry.path.startsWith(join(cwd, '.git'))
        ),
      entryFilter: (_entry) => _entry.dirent.isFile(),
    }),
  )) {
    // eslint-disable-next-line no-await-in-loop
    const config = (await eslint.calculateConfigForFile(entry.path)) as
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
  }

  // resolve all plugins
  const pluginsMap: Map<string, ESLint.Plugin> = new Map(
    Object.entries(compat.plugins(...usedPluginSpecifiers)[0].plugins),
  );

  for (const [pluginName, plugin] of pluginsMap.entries()) {
    /**
     * MEMO: do not use plugin.meta.name, it is not always available
     */
    for (const [ruleId, rule] of Object.entries(plugin.rules)) {
      rulesMap.set(`${pluginName}/${ruleId}`, {
        fullRuleId: `${pluginName}/${ruleId}`,
        shortRuleId: ruleId,
        meta: rule.meta,
      });
    }
  }

  const usedUnknownRules = usedRuleIds.difference(rulesMap);
  const usedKnownRules = usedRuleIds.intersection(rulesMap);
  const usedDeprecatedRules = new Set(
    Array.from(usedKnownRules).filter((ruleId) => {
      if (ruleId.startsWith('react/')) {
        console.log(rulesMap.get(ruleId));
      }
      return rulesMap.get(ruleId)?.meta?.deprecated;
    }),
  );

  return {
    eslint,
    compat,

    usedRuleIds,
    usedPluginSpecifiers,
    pluginsMap,
    rulesMap,

    usedUnknownRuleIds: usedUnknownRules,
    usedKnownRuleIds: usedKnownRules,
    usedDeprecatedRuleIds: usedDeprecatedRules,
  };
};
