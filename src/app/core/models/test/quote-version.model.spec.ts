import { VersionInfo } from '../quote-version.model';

describe('VersionInfo', () => {
  describe('sort', () => {
    it('should sort versions correctly', () => {
      const versions: VersionInfo[] = [{ value: 'v1.0.0' }, { value: 'v2.0.0' }, { value: 'v1.1.0' }, { value: 'v1.0.1' }];
      const sorted = VersionInfo.sort(versions);
      expect(sorted.map(v => v.value)).toEqual(['v2.0.0', 'v1.1.0', 'v1.0.1', 'v1.0.0']);
    });
  });

  describe('isBreakingChange', () => {
    it('should return false if after is empty', () => {
      expect(VersionInfo.breakingChange([], [])).toBe('none');
    });

    it('should return true if there is a breaking change in after', () => {
      const after: VersionInfo[] = [{ value: 'v1.0.0', breakingchange: 'all' }];
      expect(VersionInfo.breakingChange([], after)).toBe('all');
    });

    it('should return false if there is no breaking change in after', () => {
      const after: VersionInfo[] = [{ value: 'v1.0.0' }];
      expect(VersionInfo.breakingChange([], after)).toBe('none');
    });

    it('should return true if there is a breaking change after the last before version', () => {
      const before: VersionInfo[] = [{ value: 'v1.0.0' }];
      const after: VersionInfo[] = [{ value: 'v1.0.1' }, { value: 'v1.1.0', breakingchange: 'all' }];
      expect(VersionInfo.breakingChange(before, after)).toBe('all');
    });

    it('should return false if there is no breaking change after the last before version', () => {
      const before: VersionInfo[] = [{ value: 'v1.0.0' }];
      const after: VersionInfo[] = [{ value: 'v1.0.1' }, { value: 'v1.1.0' }];
      expect(VersionInfo.breakingChange(before, after)).toBe('none');
    });
  });

  describe('last', () => {
    it('should return the last version', () => {
      const versions: VersionInfo[] = [{ value: 'v1.0.0' }, { value: 'v2.0.0' }, { value: 'v1.1.0' }];
      expect(VersionInfo.last(versions).value).toBe('v2.0.0');
    });

    it('should return v0.0.0 if versions is empty', () => {
      expect(VersionInfo.last([]).value).toBe('v0.0.0');
    });
  });
});
