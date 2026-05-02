import { render, screen } from '@testing-library/react';

import type { CheckInError } from '@/lib/checkIn/checkIn.type';

import { RecoveryNotice } from './RecoveryNotice';

describe('RecoveryNotice', () => {
  it('shows invalid facility recovery copy', () => {
    const error: CheckInError = {
      code: 'invalid_facility',
      message: 'That facility code was not found.',
      recovery: 'Try facility-001.',
    };

    render(<RecoveryNotice error={error} online />);

    expect(screen.getByRole('alert')).toHaveTextContent('Try facility-001.');
  });

  it('shows offline recovery copy', () => {
    render(<RecoveryNotice online={false} />);

    expect(screen.getByRole('alert')).toHaveTextContent('You are offline.');
  });

  it('shows default camera guidance while online', () => {
    render(<RecoveryNotice online />);

    expect(screen.getByRole('alert')).toHaveTextContent('Camera scanning needs a secure browser context');
  });

  it('uses warning tone for camera permission errors', () => {
    const error: CheckInError = {
      code: 'camera_permission_denied',
      message: 'Camera permission was denied.',
      recovery: 'Allow camera access.',
    };

    render(<RecoveryNotice error={error} online />);

    expect(screen.getByRole('alert')).toHaveTextContent('Allow camera access.');
  });

  it('shows generic scanner recovery for scanner errors', () => {
    const error: CheckInError = {
      code: 'scanner_error',
      message: 'The scanner failed.',
      recovery: 'Refresh or use manual entry.',
    };

    render(<RecoveryNotice error={error} online />);

    expect(screen.getByRole('alert')).toHaveTextContent('Refresh or use manual entry.');
  });
});
