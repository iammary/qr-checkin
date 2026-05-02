import { render, screen } from '@testing-library/react';

import type { CurrentMember } from '@/lib/checkIn/checkIn.type';

import { MemberSummary } from './MemberSummary';

describe('MemberSummary', () => {
  it('falls back gracefully when optional membership details are absent', () => {
    const user: CurrentMember = {
      email: 'sam@example.com',
      id: 'user-456',
      memberSince: '2026-01-01',
      name: 'Sam Lee',
    };

    render(<MemberSummary user={user} />);

    expect(screen.getByText('Sam Lee')).toBeInTheDocument();
    expect(screen.getAllByText('Member')).toHaveLength(2);
    expect(screen.getByText('Standard')).toBeInTheDocument();
  });
});
