import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getCurrentMember } from '@/lib/checkIn/facilities';

import { FacilityCheckInPage } from './FacilityCheckInPage';

type UseCheckInFlowModule = typeof import('@/lib/checkIn/useCheckInFlow');
type UseCheckInFlowOptions = Parameters<UseCheckInFlowModule['useCheckInFlow']>[0];
type UseCheckInFlowReturn = ReturnType<UseCheckInFlowModule['useCheckInFlow']>;

const flowMock = vi.hoisted(() => ({
  implementation: undefined as undefined | (() => UseCheckInFlowReturn),
}));

vi.mock('@/lib/checkIn/useCheckInFlow', async () => {
  const actual = await vi.importActual<UseCheckInFlowModule>('@/lib/checkIn/useCheckInFlow');

  return {
    useCheckInFlow: (options?: UseCheckInFlowOptions) => flowMock.implementation?.() ?? actual.useCheckInFlow(options),
  };
});

vi.mock('@/components/checkIn/ScannerPanel', () => ({
  ScannerPanel: ({
    enabled,
    onIssue,
    onScan,
    onSetEnabled,
  }: {
    enabled: boolean;
    onIssue: (error: { code: 'camera_unavailable'; message: string; recovery: string }, status: 'unavailable') => void;
    onScan: (value: string) => void;
    onSetEnabled: (enabled: boolean) => void;
  }) => (
    <section aria-label="Scanner panel">
      <p>{enabled ? 'Scanner enabled' : 'Scanner disabled'}</p>
      <button onClick={() => onSetEnabled(true)} type="button">
        Start camera
      </button>
      <button onClick={() => onScan('facility-002')} type="button">
        Scan facility-002
      </button>
      <button
        onClick={() =>
          onIssue(
            {
              code: 'camera_unavailable',
              message: 'Camera is unavailable.',
              recovery: 'Use manual facility ID entry.',
            },
            'unavailable',
          )
        }
        type="button">
        Report camera unavailable
      </button>
    </section>
  ),
}));

describe('FacilityCheckInPage', () => {
  afterEach(() => {
    flowMock.implementation = undefined;
  });

  it('renders the loading state while member context is unavailable', () => {
    flowMock.implementation = () => ({
      reportCameraIssue: vi.fn(),
      reportScannerError: vi.fn(),
      reset: vi.fn(),
      setScannerStatus: vi.fn(),
      state: {
        manualCode: '',
        online: true,
        phase: 'loading',
        scannerStatus: 'idle',
      },
      submitManualCode: vi.fn(),
      submitScannedCode: vi.fn(),
      updateManualCode: vi.fn(),
    });

    render(<FacilityCheckInPage />);

    expect(screen.getByRole('status', { name: 'Loading check-in' })).toBeInTheDocument();
  });

  it('shows offline status when the browser is offline', () => {
    flowMock.implementation = () => ({
      reportCameraIssue: vi.fn(),
      reportScannerError: vi.fn(),
      reset: vi.fn(),
      setScannerStatus: vi.fn(),
      state: {
        manualCode: '',
        online: false,
        phase: 'ready',
        scannerStatus: 'idle',
        user: getCurrentMember(),
      },
      submitManualCode: vi.fn(),
      submitScannedCode: vi.fn(),
      updateManualCode: vi.fn(),
    });

    render(<FacilityCheckInPage />);

    expect(screen.getByText('Offline')).toBeInTheDocument();
  });

  it('lets a member check in with facility-001 manually', async () => {
    const user = userEvent.setup();

    render(<FacilityCheckInPage />);

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Scan a QR code or enter a facility ID' })).toBeInTheDocument());

    await user.type(screen.getByLabelText('Facility ID'), 'facility-001');
    await user.click(screen.getByRole('button', { name: /check in manually/i }));

    expect(screen.getByRole('heading', { name: 'Check-in confirmed' })).toBeInTheDocument();
    expect(screen.getByText('City Fitness Central')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /start another check-in/i }));

    expect(screen.getByRole('heading', { name: 'Scan a QR code or enter a facility ID' })).toBeInTheDocument();
    expect(screen.getByLabelText('Facility ID')).toHaveValue('');
  });

  it('shows a clear recovery message for invalid manual codes', async () => {
    const user = userEvent.setup();

    render(<FacilityCheckInPage />);

    await waitFor(() => expect(screen.getByLabelText('Facility ID')).toBeInTheDocument());

    await user.type(screen.getByLabelText('Facility ID'), 'facility-nope');
    await user.click(screen.getByRole('button', { name: /check in manually/i }));

    const invalidCodeAlert = screen.getByText('That facility ID was not found.').closest('[role="alert"]');

    expect(invalidCodeAlert).toHaveTextContent('That facility ID was not found.');
    expect(invalidCodeAlert).toHaveTextContent('facility-001');
  });

  it('checks in a scanned facility ID and stops the scanner', async () => {
    const user = userEvent.setup();

    render(<FacilityCheckInPage />);

    await waitFor(() => expect(screen.getByText('Scanner disabled')).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /start camera/i }));

    expect(screen.getByText('Scanner enabled')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /scan facility-002/i }));

    expect(screen.getByRole('heading', { name: 'Check-in confirmed' })).toBeInTheDocument();
    expect(screen.getByText('Suburban Strength & Co')).toBeInTheDocument();
  });

  it('disables scanner mode when the scanner reports a startup issue', async () => {
    const user = userEvent.setup();

    render(<FacilityCheckInPage />);

    await waitFor(() => expect(screen.getByText('Scanner disabled')).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /start camera/i }));
    await user.click(screen.getByRole('button', { name: /report camera unavailable/i }));

    expect(screen.getByText('Scanner disabled')).toBeInTheDocument();
    expect(screen.getByText('Camera is unavailable.')).toBeInTheDocument();
    expect(screen.getByText('Use manual facility ID entry.')).toBeInTheDocument();
  });
});
