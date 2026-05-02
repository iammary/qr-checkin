import { act, renderHook, waitFor } from '@testing-library/react';
import type { FormEvent } from 'react';
import { renderToString } from 'react-dom/server';

import { getNavigatorOnlineStatus, useCheckInFlow } from './useCheckInFlow';

const fixedNow = () => new Date('2026-05-02T09:30:00.000Z');

describe('useCheckInFlow', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads online defaults from the browser environment', () => {
    vi.stubGlobal('navigator', { onLine: false });

    expect(getNavigatorOnlineStatus()).toBe(false);

    vi.stubGlobal('navigator', undefined);

    expect(getNavigatorOnlineStatus()).toBe(true);
  });

  it('keeps the server render online state deterministic before hydration', () => {
    const OnlineStateProbe = () => <span>{useCheckInFlow().state.online ? 'Online' : 'Offline'}</span>;

    vi.stubGlobal('navigator', { onLine: false });

    expect(renderToString(<OnlineStateProbe />)).toContain('Online');
  });

  it('syncs browser online status after hydration', async () => {
    vi.stubGlobal('navigator', { onLine: false });

    const { result } = renderHook(() => useCheckInFlow({ now: fixedNow }));

    await waitFor(() => expect(result.current.state.online).toBe(false));
  });

  it('submits a valid manual code', async () => {
    const { result } = renderHook(() => useCheckInFlow({ initialOnline: true, now: fixedNow }));

    await waitFor(() => expect(result.current.state.phase).toBe('ready'));

    act(() => result.current.updateManualCode('facility-001'));
    act(() => result.current.submitManualCode());

    expect(result.current.state.phase).toBe('confirmed');
    expect(result.current.state.result?.facility.name).toBe('City Fitness Central');
    expect(result.current.state.result?.source).toBe('manual');
  });

  it('supports default options and browser online events', async () => {
    const { result } = renderHook(() => useCheckInFlow());

    await waitFor(() => expect(result.current.state.phase).toBe('ready'));

    act(() => globalThis.dispatchEvent(new Event('offline')));

    expect(result.current.state.online).toBe(false);

    act(() => globalThis.dispatchEvent(new Event('online')));

    expect(result.current.state.online).toBe(true);

    act(() => result.current.updateManualCode('facility-001'));
    act(() => result.current.submitManualCode());

    expect(result.current.state.result?.id).toMatch(/^checkin-user-123-facility-001-/);
  });

  it('prevents default form submission before checking in manually', async () => {
    const preventDefault = vi.fn();
    const { result } = renderHook(() => useCheckInFlow({ initialOnline: true, now: fixedNow }));

    await waitFor(() => expect(result.current.state.phase).toBe('ready'));

    act(() => result.current.updateManualCode('facility-001'));
    act(() =>
      result.current.submitManualCode({
        preventDefault,
      } as unknown as FormEvent<HTMLFormElement>),
    );

    expect(preventDefault).toHaveBeenCalled();
    expect(result.current.state.phase).toBe('confirmed');
  });

  it('shows a recoverable error for invalid manual codes', async () => {
    const { result } = renderHook(() => useCheckInFlow({ initialOnline: true, now: fixedNow }));

    await waitFor(() => expect(result.current.state.phase).toBe('ready'));

    act(() => result.current.updateManualCode('not-real'));
    act(() => result.current.submitManualCode());

    expect(result.current.state.phase).toBe('ready');
    expect(result.current.state.lastError?.code).toBe('invalid_facility');
  });

  it('submits scanned QR content through the same validation path', async () => {
    const { result } = renderHook(() => useCheckInFlow({ initialOnline: false, now: fixedNow }));

    await waitFor(() => expect(result.current.state.phase).toBe('ready'));

    act(() => result.current.submitScannedCode('{"facilityId":"facility-001"}'));

    expect(result.current.state.phase).toBe('confirmed');
    expect(result.current.state.online).toBe(false);
    expect(result.current.state.result?.source).toBe('qr');
  });

  it('supports scanner recovery actions and reset', async () => {
    const { result } = renderHook(() => useCheckInFlow({ initialOnline: true, now: fixedNow }));

    await waitFor(() => expect(result.current.state.phase).toBe('ready'));

    act(() => result.current.reportScannerError('Camera failed'));

    expect(result.current.state.lastError?.code).toBe('scanner_error');
    expect(result.current.state.scannerStatus).toBe('error');

    act(() => result.current.setScannerStatus('active'));

    expect(result.current.state.scannerStatus).toBe('active');

    act(() => result.current.submitScannedCode('facility-001'));
    act(() => result.current.reset());

    expect(result.current.state.phase).toBe('ready');
    expect(result.current.state.result).toBeUndefined();
  });

  it('reports camera issues directly', async () => {
    const { result } = renderHook(() => useCheckInFlow({ initialOnline: true, now: fixedNow }));

    await waitFor(() => expect(result.current.state.phase).toBe('ready'));

    act(() =>
      result.current.reportCameraIssue(
        {
          code: 'camera_unavailable',
          message: 'Camera is missing',
          recovery: 'Use manual entry.',
        },
        'unavailable',
      ),
    );

    expect(result.current.state.lastError?.message).toBe('Camera is missing');
    expect(result.current.state.scannerStatus).toBe('unavailable');
  });
});
