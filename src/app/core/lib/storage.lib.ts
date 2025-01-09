const STORAGE_KEY_PREFIX = '@';

export type StorageType = 'local' | 'session';

export class StorageLib {
  public static set = (key: string, value: string, type: StorageType = 'session'): void => {
    StorageLib.storage(type).setItem(StorageLib.storageKey(key), value);
  };

  public static get = (key: string, type: StorageType = 'session'): string | null => {
    return StorageLib.storage(type).getItem(StorageLib.storageKey(key));
  };

  public static remove = (key: string, type: StorageType = 'session'): void => {
    StorageLib.storage(type).removeItem(StorageLib.storageKey(key));
  };

  public static clear = (regExp: string | RegExp = /.*/, type: StorageType = 'session'): Record<string, string> => {
    const storage = StorageLib.storage(type);
    const keys = Object.keys(storage)
      .filter(key => key.startsWith(STORAGE_KEY_PREFIX))
      .map(key => key.slice(STORAGE_KEY_PREFIX.length))
      .filter(key => key.match(regExp));

    return keys.reduce((acc, key) => ({ ...acc, [key]: storage.getItem(StorageLib.storageKey(key)) }), {});
  };

  private static storage = (type: StorageType = 'session'): Storage => (type === 'session' ? sessionStorage : localStorage);
  private static storageKey = (key: string) => `${STORAGE_KEY_PREFIX}${key}`;
}
