import { ESLintUtils } from '@typescript-eslint/utils';

import { getDocumentUrl } from './get-document-url.ts';

export const createRule = ESLintUtils.RuleCreator(getDocumentUrl);
