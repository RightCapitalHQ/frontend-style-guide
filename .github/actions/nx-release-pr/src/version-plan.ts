import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

export type BumpType = 'major' | 'minor' | 'patch';

export interface VersionPlan {
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
  let highestPriority = BUMP_PRIORITY['patch']!;

  for (const bump of bumpValues) {
    const priority = BUMP_PRIORITY[bump];
    if (priority !== undefined && priority < highestPriority) {
      highest = bump as BumpType;
      highestPriority = priority;
    }
  }

  return highest;
}

export function parseVersionPlan(content: string): VersionPlan | null {
  const lines = content.split('\n');

  // Find front matter delimiters (---)
  let firstDelim = -1;
  let secondDelim = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i]!.trim() === '---') {
      if (firstDelim === -1) {
        firstDelim = i;
      } else {
        secondDelim = i;
        break;
      }
    }
  }

  if (firstDelim === -1 || secondDelim === -1) return null;

  // Parse bump types from front matter
  const bumps: Record<string, string> = {};
  const bumpValues: string[] = [];
  for (let i = firstDelim + 1; i < secondDelim; i++) {
    const line = lines[i]!.trim();
    if (!line) continue;
    // Handles both: package-name: patch  and  "package-name": patch
    const match = line.match(/^"?([^":]+)"?\s*:\s*(\S+)/);
    if (match) {
      bumps[match[1]!] = match[2]!;
      bumpValues.push(match[2]!);
    }
  }

  // Extract description (everything after second ---, trimmed of blank lines)
  const description = lines
    .slice(secondDelim + 1)
    .join('\n')
    .trim();

  if (!description) return null;

  return {
    bumps,
    description,
    highestBump: getHighestBump(bumpValues),
  };
}

export async function readVersionPlans(): Promise<VersionPlan[]> {
  const dir = '.nx/version-plans';
  let files: string[];
  try {
    files = (await readdir(dir)).filter((f) => f.endsWith('.md')).sort();
  } catch {
    return [];
  }

  const plans: VersionPlan[] = [];
  for (const file of files) {
    const content = await readFile(join(dir, file), 'utf-8');
    const plan = parseVersionPlan(content);
    if (plan) {
      plans.push(plan);
    }
  }

  return plans;
}
