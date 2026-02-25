import type { VersionData } from 'nx/src/command-line/release/utils/shared.js';

import type { IVersionPlan } from './version-plan.js';

export function renderVersionTable(projectsVersionData: VersionData): string {
  const rows = Object.entries(projectsVersionData)
    .filter(
      ([, data]) => data.newVersion && data.newVersion !== data.currentVersion,
    )
    .map(
      ([name, data]) =>
        `| \`${name}\` | \`${data.currentVersion}\` | \`${data.newVersion}\` |`,
    );

  if (rows.length === 0) {
    return '';
  }

  const lines = [
    '| Package | Current | New |',
    '|---------|---------|-----|',
    ...rows,
  ];

  return lines.join('\n');
}

export function renderChangesSection(plans: IVersionPlan[]): string {
  const breaking: string[] = [];
  const features: string[] = [];
  const fixes: string[] = [];

  for (const plan of plans) {
    if (plan.highestBump === 'major') {
      breaking.push(`- ${plan.description}`);
    } else if (plan.highestBump === 'minor') {
      features.push(`- ${plan.description}`);
    } else {
      fixes.push(`- ${plan.description}`);
    }
  }

  if (breaking.length === 0 && features.length === 0 && fixes.length === 0) {
    return '';
  }

  const sections: string[] = [];

  if (breaking.length > 0) {
    sections.push(`### Breaking Changes\n\n${breaking.join('\n')}`);
  }
  if (features.length > 0) {
    sections.push(`### New Features\n\n${features.join('\n')}`);
  }
  if (fixes.length > 0) {
    sections.push(`### Fixes & Improvements\n\n${fixes.join('\n')}`);
  }

  return `## Changes\n\n${sections.join('\n\n')}`;
}

export function composePrBody(
  banner: string,
  projectsVersionData: VersionData,
  plans: IVersionPlan[],
): string {
  const versionTable = renderVersionTable(projectsVersionData);
  const changesSection = renderChangesSection(plans);

  const parts: string[] = [];

  if (banner) {
    parts.push(banner);
    parts.push('');
  }

  parts.push('## Release Summary');
  parts.push('');
  if (versionTable) {
    parts.push(versionTable);
  }

  if (changesSection) {
    parts.push(changesSection);
  }

  return parts.join('\n');
}
