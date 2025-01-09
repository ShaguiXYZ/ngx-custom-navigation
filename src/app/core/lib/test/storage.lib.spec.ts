import { StorageLib } from '../storage.lib';

describe('StorageLib', () => {
  const testKey = 'testKey';
  const testValue = 'testValue';

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should set and get an item in localStorage', () => {
    StorageLib.set(testKey, testValue, 'local');
    const result = StorageLib.get(testKey, 'local');
    expect(result).toBe(testValue);
  });

  it('should set and get an item in sessionStorage', () => {
    StorageLib.set(testKey, testValue, 'session');
    const result = StorageLib.get(testKey, 'session');
    expect(result).toBe(testValue);
  });

  it('should remove an item from localStorage', () => {
    StorageLib.set(testKey, testValue, 'local');
    StorageLib.remove(testKey, 'local');
    const result = StorageLib.get(testKey, 'local');
    expect(result).toBeNull();
  });

  it('should remove an item from sessionStorage', () => {
    StorageLib.set(testKey, testValue, 'session');
    StorageLib.remove(testKey, 'session');
    const result = StorageLib.get(testKey, 'session');
    expect(result).toBeNull();
  });

  it('should retrieve all items matching a RegExp from localStorage', () => {
    StorageLib.set('testKey1', 'value1', 'local');
    StorageLib.set('testKey2', 'value2', 'local');
    StorageLib.set('otherKey', 'value3', 'local');
    const result = StorageLib.clear(/^test/, 'local');
    expect(result).toEqual({ testKey1: 'value1', testKey2: 'value2' });
  });

  it('should retrieve all items matching a RegExp from sessionStorage', () => {
    StorageLib.set('testKey1', 'value1', 'session');
    StorageLib.set('testKey2', 'value2', 'session');
    StorageLib.set('otherKey', 'value3', 'session');
    const result = StorageLib.clear(/^test/, 'session');
    expect(result).toEqual({ testKey1: 'value1', testKey2: 'value2' });
  });

  it('should return an empty object if no items match the RegExp', () => {
    StorageLib.set('otherKey', 'value3', 'local');
    const result = StorageLib.clear(/^test/, 'local');
    expect(result).toEqual({});
  });
});
