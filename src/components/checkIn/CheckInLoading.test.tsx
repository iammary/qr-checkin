import { render, screen } from '@testing-library/react';

import { CheckInLoading } from './CheckInLoading';

describe('CheckInLoading', () => {
  it('renders accessible loading placeholders', () => {
    render(<CheckInLoading />);

    expect(screen.getByRole('status', { name: 'Loading heading' })).toBeInTheDocument();
  });
});
