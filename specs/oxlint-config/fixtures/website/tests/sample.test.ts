import { readFileSync } from 'node:fs';

// both Node and browser globals are available in tests
export const text = readFileSync('a.txt', 'utf8') + window.location.href;
