import { lintESLintConfigRules } from './index.js';

const cwd = process.cwd();
console.info(`Checking ESLint rules in ${cwd}`);

const result = await lintESLintConfigRules(cwd);

console.log('usedKnownRules', result.usedKnownRuleIds);
console.log('usedUnknownRules', result.usedUnknownRuleIds);
console.log('usedDeprecatedRules', result.usedDeprecatedRuleIds);
