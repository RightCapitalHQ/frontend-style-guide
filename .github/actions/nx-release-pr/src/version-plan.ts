import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

export type BumpType = 'major' | 'minor' | 'patch';

export interface IVersionPlan {
  bumps: Record<string, string>;
  description: string;
  highestBump: BumpType;
}

const BUMP_PRIORITY: Record<string, number> = {
  major: 0,
  minor: 1,
  patch: 2,
};

function getHighestBump(bumpValues: string[]): BumpType {
  let highest: BumpType = 'patch';
  let highestPriority = BUMP_PRIORITY.patch;

  for (const bump of bumpValues) {
    const priority = BUMP_PRIORITY[bump];
    if (priority !== undefined && priority < highestPriority) {
      highest = bump as BumpType;
      highestPriority = priority;
    }
  }

  return highest;
}

export function parseVersionPlan(content: string): IVersionPlan | null {
  const lines = content.split('\n');

  // Find front matter delimiters (---)
  let firstDelim = -1;
  let secondDelim = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i]?.trim() === '---') {
      if (firstDelim === -1) {
        firstDelim = i;
      } else {
        secondDelim = i;
        break;
      }
    }
  }

  if (firstDelim === -1 || secondDelim === -1) {
    return null;
  }

  // Parse bump types from front matter
  const bumps: Record<string, string> = {};
  const bumpValues: string[] = [];
  for (let i = firstDelim + 1; i < secondDelim; i += 1) {
    const line = lines[i]?.trim();
    if (line) {
      // Handles both: package-name: patch  and  "package-name": patch
      const match = line.match(/^"?([^":]+)"?\s*:\s*(\S+)/);
      if (match?.[1] && match[2]) {
        const [, pkg, bump] = match;
        bumps[pkg] = bump;
        bumpValues.push(bump);
      }
    }
  }

  // Extract description (everything after second ---, trimmed of blank lines)
  const description = lines
    .slice(secondDelim + 1)
    .join('\n')
    .trim();

  if (!description) {
    return null;
  }

  return {
    bumps,
    description,
    highestBump: getHighestBump(bumpValues),
  };
}

export async function readVersionPlans(): Promise<IVersionPlan[]> {
  const dir = '.nx/version-plans';
  let files: string[];
  try {
    files = (await readdir(dir)).filter((f) => f.endsWith('.md')).sort();
  } catch {
    return [];
  }

  const contents = await Promise.all(
    files.map((file) => readFile(join(dir, file), 'utf8')),
  );

  return contents
    .map((content) => parseVersionPlan(content))
    .filter((plan): plan is IVersionPlan => plan !== null);
}
