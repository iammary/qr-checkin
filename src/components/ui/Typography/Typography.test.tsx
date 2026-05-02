import { render, screen } from '@testing-library/react';

import { Typography } from './Typography';

describe('Typography', () => {
  it('uses semantic fallback elements for titles', () => {
    render(<Typography scale="title">Facility Check-In</Typography>);

    expect(screen.getByRole('heading', { level: 1, name: 'Facility Check-In' })).toBeInTheDocument();
  });
});
