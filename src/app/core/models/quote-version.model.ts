/* eslint-disable @typescript-eslint/no-namespace */
export type Version = `v${number}.${number}` | `v${number}.${number}.${number}`;
/**
 * Breaking change types
 * - all: workflow and configurationa versions are breaking changes
 * - workflow: only workflow versions are breaking changes
 * - none: no breaking changes
 */
export type Breakingchange = 'all' | 'workflow' | 'none';
export interface VersionInfo {
  value: Version;
  date?: number; // timestamp
  breakingchange?: Breakingchange;
}

export namespace VersionInfo {
  export const compare = (a: VersionInfo, b: VersionInfo): number => {
    if (!b?.value) {
      return 1;
    }

    const parseVersion = (version: string) => {
      const [major, minor, patch] = version
        .slice(1)
        .split('.')
        .map(v => parseInt(v, 10));
      return { major, minor, patch: patch ?? 0 };
    };

    const aParsed = parseVersion(a.value);
    const bParsed = parseVersion(b.value);

    if (aParsed.major !== bParsed.major) {
      return bParsed.major - aParsed.major;
    }

    if (aParsed.minor !== bParsed.minor) {
      return bParsed.minor - aParsed.minor;
    }

    return bParsed.patch - aParsed.patch;
  };
  export const sort = (versions: VersionInfo[]): VersionInfo[] => {
    return versions.sort((a, b) => {
      return compare(a, b);
    });
  };
  export const breakingChange = (before: VersionInfo[] = [], after: VersionInfo[] = []): Breakingchange => {
    const majorVersionBreakingchange = (versions: VersionInfo[] = []): VersionInfo | undefined =>
      versions.find(info => info.breakingchange === 'all' || info.breakingchange === 'workflow');

    if (after.length === 0) {
      return 'none';
    }

    const afterSorted = sort(after);

    if (before.length === 0) {
      return majorVersionBreakingchange(afterSorted)?.breakingchange ?? 'none';
    }

    const lastBeforeVersion = last(before);

    // remove after versions that are before the last before version
    const filteredAfterSorted = afterSorted.filter(info => compare(lastBeforeVersion, info) > 0);

    return majorVersionBreakingchange(filteredAfterSorted)?.breakingchange ?? 'none';
  };
  export const last = (versions: VersionInfo[] = []): VersionInfo => {
    return versions.length ? sort(versions)[0] : { value: 'v0.0.0' };
  };
}
