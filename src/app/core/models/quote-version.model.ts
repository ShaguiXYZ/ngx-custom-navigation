export type Version = `v${number}.${number}` | `v${number}.${number}.${number}`;
export type VersionInfo = { value: Version; breakingchange?: boolean };

export namespace VersionInfo {
  export const sort = (versions: VersionInfo[]): VersionInfo[] => {
    return versions.sort((a, b) => {
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
    });
  };
  export const isBreakingChange = (before: VersionInfo[] = [], after: VersionInfo[] = []): boolean => {
    if (after.length === 0) {
      return false;
    }

    let afterSorted = sort(after);

    if (before.length === 0) {
      return afterSorted.some(after => after.breakingchange);
    }

    const lastBeforeVersion = last(before);

    // remove after versions that are before the last before version
    afterSorted = afterSorted.filter(after => {
      const parsed = sort([lastBeforeVersion, after]);
      return parsed[0] === after;
    });

    return afterSorted.some(after => after.breakingchange);
  };
  export const last = (versions: VersionInfo[] = []): VersionInfo => {
    return versions.length ? sort(versions)[0] : { value: 'v0.0.0' };
  };
}
