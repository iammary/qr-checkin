import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createCheckInResult } from '@/lib/checkIn/checkInService';
import { getCurrentMember, getFacilities } from '@/lib/checkIn/facilities';

import { CheckInConfirmation } from './CheckInConfirmation';

describe('CheckInConfirmation', () => {
  it('shows staff-ready check-in details', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    const result = createCheckInResult({
      checkedInAt: '2026-05-02T09:30:00.000Z',
      facility: getFacilities()[0],
      source: 'manual',
      user: getCurrentMember(),
    });

    render(<CheckInConfirmation onReset={onReset} result={result} />);

    expect(screen.getByRole('heading', { name: 'Check-in confirmed' })).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('City Fitness Central')).toBeInTheDocument();
    expect(screen.getByText('123 Market St, Sydney, NSW 2000')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /start another check-in/i }));

    expect(onReset).toHaveBeenCalledOnce();
  });

  it('falls back when optional membership labels are missing', () => {
    const result = createCheckInResult({
      checkedInAt: '2026-05-02T09:30:00.000Z',
      facility: getFacilities()[0],
      source: 'qr',
      user: {
        email: 'sam@example.com',
        id: 'user-456',
        memberSince: '2026-01-01',
        name: 'Sam Lee',
      },
    });

    render(<CheckInConfirmation onReset={vi.fn()} result={result} />);

    expect(screen.getAllByText('Member')).toHaveLength(2);
    expect(screen.getAllByText('Confirmed')).toHaveLength(2);
  });
});
