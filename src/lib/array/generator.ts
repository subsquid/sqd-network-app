/**
 * Creates a generator that cycles through values
 */
export function createGenerator<T>(v: T[]) {
  let i = -1;

  return {
    next() {
      i = (i + 1) % v.length;
      return v[i];
    },
  };
}

