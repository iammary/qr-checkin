import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ScannerPanel } from './ScannerPanel';

const renderScannerPanel = (overrides: Partial<React.ComponentProps<typeof ScannerPanel>> = {}) => {
  const props: React.ComponentProps<typeof ScannerPanel> = {
    enabled: false,
    onIssue: vi.fn(),
    onScan: vi.fn(),
    onSetEnabled: vi.fn(),
    onStatusChange: vi.fn(),
    online: true,
    status: 'idle',
    ...overrides,
  };

  render(<ScannerPanel {...props} />);

  return props;
};

describe('ScannerPanel', () => {
  it('starts the scanner from the idle state', async () => {
    const user = userEvent.setup();
    const originalSecureContext = globalThis.isSecureContext;

    Object.defineProperty(globalThis, 'isSecureContext', { configurable: true, value: true });

    const props = renderScannerPanel();

    await user.click(screen.getByRole('button', { name: /start camera/i }));

    expect(props.onSetEnabled).toHaveBeenCalledWith(true);

    Object.defineProperty(globalThis, 'isSecureContext', { configurable: true, value: originalSecureContext });
  });

  it('shows offline camera guidance', () => {
    renderScannerPanel({ online: false, status: 'active' });

    expect(screen.getByText('Scanning')).toBeInTheDocument();
    expect(screen.getByText('Offline mode is active. Manual entry is the dependable path.')).toBeInTheDocument();
  });

  it('stops an enabled scanner', async () => {
    const user = userEvent.setup();
    const props = renderScannerPanel({ enabled: true, status: 'error' });

    await user.click(screen.getByRole('button', { name: /stop camera/i }));

    expect(props.onSetEnabled).toHaveBeenCalledWith(false);
    expect(screen.getByText('Needs attention')).toBeInTheDocument();
  });
});
