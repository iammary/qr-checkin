import { render, screen } from '@testing-library/react';

import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('allows status labeling for loading placeholders', () => {
    render(<Skeleton aria-label="Loading member" role="status" />);

    expect(screen.getByRole('status', { name: 'Loading member' })).toBeInTheDocument();
  });
});
