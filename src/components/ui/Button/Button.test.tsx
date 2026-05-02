import { render, screen } from '@testing-library/react';

import { Button } from './Button';

describe('Button', () => {
  it('renders an accessible button', () => {
    render(<Button>Check in</Button>);

    expect(screen.getByRole('button', { name: 'Check in' })).toBeEnabled();
  });

  it('can render as a child element', () => {
    render(
      <Button asChild>
        <a href="/qr">QR</a>
      </Button>,
    );

    expect(screen.getByRole('link', { name: 'QR' })).toHaveAttribute('href', '/qr');
  });
});
