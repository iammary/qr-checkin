import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ManualEntryForm } from './ManualEntryForm';

describe('ManualEntryForm', () => {
  it('submits the typed facility ID', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const handleSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());

    render(<ManualEntryForm onChange={handleChange} onSubmit={handleSubmit} value="" />);

    await user.type(screen.getByLabelText('Facility ID'), 'facility-001');
    await user.click(screen.getByRole('button', { name: /check in manually/i }));

    expect(handleChange).toHaveBeenCalled();
    expect(handleSubmit).toHaveBeenCalledOnce();
  });
});
