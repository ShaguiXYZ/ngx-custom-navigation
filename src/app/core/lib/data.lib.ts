import { deepCopy } from '@shagui/ng-shagui/core';

/**
 * Recursively patches the properties of the `data` object with the properties from the `newData` object.
 * If a property in `newData` is an object and exists in `data`, the function will recursively patch that object.
 * Otherwise, it will directly assign the value from `newData` to `data`.
 *
 * @param data - The original data object to be patched.
 * @param newData - The new data object containing properties to patch into the original data object.
 */
export function patch<T = Record<string, unknown>, P = Partial<T>>(data: T, newData: P): T {
  if (!data || !newData) {
    return data;
  }

  const toPatch: Record<string, unknown> = deepCopy(data);

  Object.entries(newData).forEach(([key, value]) => {
    if (value && typeof value === 'object' && key in toPatch) {
      toPatch[key] = patch(toPatch[key] as Record<string, unknown>, value as Record<string, unknown>);
    } else {
      toPatch[key] = value;
    }
  });

  return toPatch as T;
}
