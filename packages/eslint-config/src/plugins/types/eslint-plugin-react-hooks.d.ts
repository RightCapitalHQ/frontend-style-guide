declare module 'eslint-plugin-react-hooks' {
  import type { TSESLint } from '@typescript-eslint/utils';

  export const rules: Record<string, TSESLint.LooseRuleDefinition>;
}
