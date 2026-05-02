import { render, screen } from '@testing-library/react';

import { Input } from './Input';

describe('Input', () => {
  it('renders with a label', () => {
    render(<Input aria-label="Facility code" defaultValue="facility-001" />);

    expect(screen.getByLabelText('Facility code')).toHaveValue('facility-001');
  });
});
