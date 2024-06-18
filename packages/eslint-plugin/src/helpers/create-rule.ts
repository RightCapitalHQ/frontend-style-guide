import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';

import { getDocumentUrl } from './get-document-url';

export const createRule = RuleCreator(getDocumentUrl);
