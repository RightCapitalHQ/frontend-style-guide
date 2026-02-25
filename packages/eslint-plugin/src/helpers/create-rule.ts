import { ESLintUtils } from '@typescript-eslint/utils';

import { getDocumentUrl } from './get-document-url';

export const createRule = ESLintUtils.RuleCreator(getDocumentUrl);
