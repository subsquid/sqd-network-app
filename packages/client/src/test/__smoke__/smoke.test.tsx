import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '../render';

describe('vitest scaffold', () => {
  it('renders trivial JSX through TestProviders', () => {
    const { getByText } = renderWithProviders(<div>hello vitest</div>);
    expect(getByText('hello vitest')).toBeInTheDocument();
  });
});
