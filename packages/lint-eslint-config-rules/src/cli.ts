#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { lintESLintConfigRules, sortedRuleIds } from './index.js';

export interface IESLintConfigRulesLintResultJSON {
  knownRuleIds: string[];
  usedRuleIds: string[];
  usedPluginSpecifiers: string[];
  usedDeprecatedRuleIds: string[];
  usedUnknownRuleIds: string[];
}

const main = async () => {
  const args = parseArgs({
    options: {
      help: {
        type: 'boolean',
        short: 'h',
        default: false,
      },
      version: {
        type: 'boolean',
        default: false,
      },
      cwd: {
        type: 'string',
        default: process.cwd(),
      },
      json: {
        type: 'boolean',
        default: false,
      },
    },
  });

  const { help, version, cwd, json } = args.values as {
    [key in keyof typeof args.values]: NonNullable<(typeof args.values)[key]>;
  };

  if (help || version) {
    // MEMO: use JSON modules when it's stable to simplify this
    // https://nodejs.org/api/esm.html#json-modules
    const packageJson = JSON.parse(
      await readFile(fileURLToPath(import.meta.resolve('../package.json')), {
        encoding: 'utf8',
      }),
    ) as { name: string; version: string; description: string };

    if (version) {
      console.log(packageJson.version);
      return;
    }

    // print help
    console.log(
      `
${packageJson.name} v${packageJson.version}
${packageJson.description}

Usage: lint-eslint-config-rules [options]

Options:
  -h, --help\tDisplay this help message
  --cwd <path>\tThe directory to lint (default: process.cwd())
  --json\tOutput all information in JSON format
  --version\tDisplay version number

Note:
  "used" means the rule is specified in the config (including all extended configs), whether it's "off" or "warn" or "error".
      `.trim(),
    );
    return;
  }

  if (!json) {
    console.log(`Checking ESLint rules in ${cwd}`);
  }

  const {
    ruleMap: rulesMap,
    usedRuleIds,
    usedDeprecatedRuleIds,
    usedUnknownRuleIds,
    usedPluginSpecifiers,
  } = await lintESLintConfigRules(cwd);

  if (json) {
    console.log(
      JSON.stringify(
        {
          knownRuleIds: sortedRuleIds(rulesMap.keys()),
          usedRuleIds: sortedRuleIds(usedRuleIds),
          usedPluginSpecifiers: Array.from(usedPluginSpecifiers),
          usedDeprecatedRuleIds: sortedRuleIds(usedDeprecatedRuleIds),
          usedUnknownRuleIds: sortedRuleIds(usedUnknownRuleIds),
        } satisfies IESLintConfigRulesLintResultJSON,
        null,
        2,
      ),
    );
  } else {
    // default output
    console.log(
      `Discovered ${usedRuleIds.size}/${rulesMap.size} used/available rules`,
    );

    if (usedDeprecatedRuleIds.size > 0) {
      console.log(
        `Found used deprecated rules:\n\t${sortedRuleIds(usedDeprecatedRuleIds)
          .map((ruleId) => {
            const replacedByMeta = rulesMap.get(ruleId)?.meta?.replacedBy;
            const replacedByInfo =
              Array.isArray(replacedByMeta) && replacedByMeta.length > 0
                ? ` (replaced by ${replacedByMeta.join(', ')})`
                : '';
            return `${ruleId}${replacedByInfo}`;
          })
          .join('\n\t')}`,
      );
    } else {
      console.log('No used deprecated rules found');
    }

    if (usedUnknownRuleIds.size > 0) {
      console.log(
        `Found used unknown rules:\n\t${sortedRuleIds(usedUnknownRuleIds).join(
          '\n\t',
        )}`,
      );
    } else {
      console.log('No used unknown rules found');
    }
  }

  if (usedDeprecatedRuleIds.size > 0 || usedUnknownRuleIds.size > 0) {
    process.exitCode = 1;
  }
};

await main();
