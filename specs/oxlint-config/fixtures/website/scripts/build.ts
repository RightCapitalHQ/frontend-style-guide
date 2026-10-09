import { readFileSync } from 'fs';

console.log('building');
process.exit(0);
export const file = readFileSync('a.txt', 'utf8');

// global types are not reported as undefined
export const timer: NodeJS.Timeout | undefined = undefined;
