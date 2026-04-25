/**
 * Vitest global setup applied to every test.
 *
 * - Wires `@testing-library/jest-dom` matchers into Vitest's `expect`.
 * - Cleans up React Testing Library mounts after each test.
 * - Restores Vitest mocks after each test so test order doesn't leak state.
 */
import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
