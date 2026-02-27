import useLocalStorageState from 'use-local-storage-state';

export { useLocalStorageState };

export const localStorageStringSerializer = {
  stringify: (value: unknown) => String(value),
  parse: (value: unknown) => String(value),
};

export const localStorageNumberSerializer = {
  stringify: (value: unknown) => String(value),
  parse: (value: unknown) => Number(value),
};

export const localStorageBoolSerializer = {
  stringify: (value: unknown) => String(value),
  parse: (value: unknown) => value === 'true',
};
