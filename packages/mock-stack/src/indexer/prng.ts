/**
 * Deterministic seeded PRNG (mulberry32). Replaces `Math.random()` in the
 * indexer's synthetic-aggregate paths so test runs are reproducible.
 *
 * The seed is per-call so each operation can independently spin up a stream
 * keyed on its own context (typically block timestamp + variable hash).
 */
export interface PRNG {
  /** Returns a value in `[0, 1)`. */
  next(): number;
  /** Returns a uniform integer in `[min, max)`. */
  intRange(min: number, max: number): number;
  /** Returns a value in `[base * (1 - variance), base * (1 + variance))`. */
  variance(base: number, variance: number): number;
}

export function mulberry32(seed: number): PRNG {
  let state = seed >>> 0;
  function next(): number {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  return {
    next,
    intRange(min, max) {
      return Math.floor(min + next() * (max - min));
    },
    variance(base, variance) {
      return base * (1 + (next() - 0.5) * variance);
    },
  };
}

/**
 * Hash a string to a 32-bit seed. Cheap and good enough for non-cryptographic
 * uses (FNV-1a). Used by the synthetic aggregates to derive a deterministic
 * seed from operation name + variable JSON.
 */
export function hashSeed(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}
