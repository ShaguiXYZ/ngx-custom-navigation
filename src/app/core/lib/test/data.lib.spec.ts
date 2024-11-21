import { patch } from '../data.lib';

describe('patch', () => {
  it('should patch simple properties', () => {
    const data: { a: number; b: number; c?: number } = { a: 1, b: 2 };
    const newData: { b: number; c: number } = { b: 3, c: 4 };
    const result = patch(data, newData);
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('should recursively patch nested properties', () => {
    const data: { a: number; b: { x: number; y: number; z: number | undefined } } = { a: 1, b: { x: 2, y: 3, z: undefined } };
    const newData: { b: { y: number; z: number } } = { b: { y: 4, z: 5 } };
    const result = patch(data, newData);
    expect(result).toEqual({ a: 1, b: { x: 2, y: 4, z: 5 } });
  });

  it('should add new nested properties', () => {
    const data: { a: number; b?: { x: number } } = { a: 1 };
    const newData = { b: { x: 2 } };
    const result = patch(data, newData);
    expect(result).toEqual({ a: 1, b: { x: 2 } });
  });

  it('should handle null and undefined values', () => {
    const data = { a: 1, b: 2 };
    const newData = { b: null, c: undefined };
    const result = patch(data, newData);
    expect(result).toEqual({ a: 1, b: null as any, c: undefined } as any);
  });

  it('should not modify the original data object', () => {
    const data: { a: number; b: { x: number; y: number; z?: number } } = { a: 1, b: { x: 2, y: 3 } };
    const newData = { b: { y: 4, z: 5 } };
    const result = patch(data, newData);
    expect(data).toEqual({ a: 1, b: { x: 2, y: 3 } });
    expect(result).toEqual({ a: 1, b: { x: 2, y: 4, z: 5 } });
  });

  it('should return the original data if newData is null or undefined', () => {
    const data = { a: 1, b: 2 };
    expect(patch(data, null)).toEqual(data);
    expect(patch(data, undefined)).toEqual(data);
  });

  it('should return the original data if data is null or undefined', () => {
    const newData = { a: 1, b: 2 };
    expect(patch(null, newData)).toBeNull();
    expect(patch(undefined, newData)).toBeUndefined();
  });
});
