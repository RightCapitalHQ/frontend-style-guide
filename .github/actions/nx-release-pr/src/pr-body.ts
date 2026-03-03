import type { VersionData } from 'nx/src/command-line/release/utils/shared.js';

import type { IVersionPlan } from './version-plan.js';

export interface IReleaseGroup {
  name: string;
  projects: string[];
}

function buildGroupProjectsMap(
  releaseGroups: IReleaseGroup[],
): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const group of releaseGroups) {
    map[group.name] = group.projects;
  }
  return map;
}

function resolveAffectedProjects(
  bumps: Record<string, string>,
  groupProjectsMap: Record<string, string[]>,
): string[] {
  const projects: string[] = [];
  for (const key of Object.keys(bumps)) {
    const groupProjects = groupProjectsMap[key];
    if (groupProjects) {
      projects.push(...groupProjects);
    } else {
      projects.push(key);
    }
  }
  return projects;
}

function formatPackageTags(
  projects: string[],
  npmNameMap: Record<string, string>,
): string {
  return projects.map((p) => `\`${npmNameMap[p] ?? p}\``).join(', ');
}

export function renderVersionTable(
  projectsVersionData: VersionData,
  npmNameMap: Record<string, string>,
): string {
  const rows = Object.entries(projectsVersionData)
    .filter(
      ([, data]) => data.newVersion && data.newVersion !== data.currentVersion,
    )
    .map(
      ([name, data]) =>
        `| \`${npmNameMap[name] ?? name}\` | \`${data.currentVersion}\` | \`${data.newVersion}\` |`,
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

export function renderChangesSection(
  plans: IVersionPlan[],
  releaseGroups: IReleaseGroup[],
  npmNameMap: Record<string, string>,
): string {
  const groupProjectsMap = buildGroupProjectsMap(releaseGroups);

  const breaking: string[] = [];
  const features: string[] = [];
  const fixes: string[] = [];

  for (const plan of plans) {
    const tags = formatPackageTags(
      resolveAffectedProjects(plan.bumps, groupProjectsMap),
      npmNameMap,
    );
    const entry = `- ${plan.description} (${tags})`;

    if (plan.highestBump === 'major') {
      breaking.push(entry);
    } else if (plan.highestBump === 'minor') {
      features.push(entry);
    } else {
      fixes.push(entry);
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
  releaseGroups: IReleaseGroup[],
  npmNameMap: Record<string, string>,
): string {
  const versionTable = renderVersionTable(projectsVersionData, npmNameMap);
  const changesSection = renderChangesSection(plans, releaseGroups, npmNameMap);

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
