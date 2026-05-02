import { render, screen } from '@testing-library/react';

import { Alert } from './Alert';

describe('Alert', () => {
  it('renders alert content with alert semantics', () => {
    render(<Alert tone="warning">Camera permission was denied.</Alert>);

    expect(screen.getByRole('alert')).toHaveTextContent('Camera permission was denied.');
  });
});
