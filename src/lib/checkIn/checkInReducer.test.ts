import type { CheckInError, CheckInResult } from './checkIn.type';
import { checkInReducer, initialCheckInState } from './checkInReducer';
import { createCheckInResult } from './checkInService';
import { getCurrentMember, getFacilities } from './facilities';

const invalidFacilityError: CheckInError = {
  code: 'invalid_facility',
  message: 'That facility code was not found.',
  recovery: 'Try another code.',
};

const makeResult = (): CheckInResult =>
  createCheckInResult({
    checkedInAt: '2026-05-02T09:30:00.000Z',
    facility: getFacilities()[0],
    source: 'manual',
    user: getCurrentMember(),
  });

describe('checkInReducer', () => {
  it('initializes member context', () => {
    const state = checkInReducer(initialCheckInState, { type: 'initialized', user: getCurrentMember() });

    expect(state.phase).toBe('ready');
    expect(state.user?.name).toBe('Jane Doe');
  });

  it('updates manual code and clears stale errors', () => {
    const state = checkInReducer({ ...initialCheckInState, lastError: invalidFacilityError }, { type: 'manualCodeChanged', value: 'facility-001' });

    expect(state.manualCode).toBe('facility-001');
    expect(state.lastError).toBeUndefined();
  });

  it('stores successful check-in results', () => {
    const result = makeResult();
    const state = checkInReducer({ ...initialCheckInState, manualCode: 'facility-001', phase: 'ready' }, { result, type: 'checkInSucceeded' });

    expect(state.phase).toBe('confirmed');
    expect(state.manualCode).toBe('');
    expect(state.result?.facility.id).toBe('facility-001');
  });

  it('keeps the user recoverable after invalid facility errors', () => {
    const state = checkInReducer(
      { ...initialCheckInState, phase: 'confirmed', result: makeResult() },
      { error: invalidFacilityError, type: 'checkInFailed' },
    );

    expect(state.phase).toBe('ready');
    expect(state.result).toBeUndefined();
    expect(state.lastError?.code).toBe('invalid_facility');
  });

  it('resets to ready while preserving member and online state', () => {
    const state = checkInReducer(
      { ...initialCheckInState, online: false, phase: 'confirmed', result: makeResult(), user: getCurrentMember() },
      { type: 'reset' },
    );

    expect(state).toMatchObject({
      manualCode: '',
      online: false,
      phase: 'ready',
      user: {
        name: 'Jane Doe',
      },
    });
  });

  it('stores camera issues and scanner status changes', () => {
    const withIssue = checkInReducer(initialCheckInState, {
      error: invalidFacilityError,
      scannerStatus: 'error',
      type: 'cameraIssueReported',
    });

    expect(withIssue.lastError?.code).toBe('invalid_facility');
    expect(withIssue.scannerStatus).toBe('error');

    const withScannerStatus = checkInReducer(withIssue, { scannerStatus: 'active', type: 'scannerStatusChanged' });

    expect(withScannerStatus.scannerStatus).toBe('active');
  });

  it('ignores duplicate camera issue reports', () => {
    const state = {
      ...initialCheckInState,
      lastError: invalidFacilityError,
      scannerStatus: 'error' as const,
    };
    const nextState = checkInReducer(state, {
      error: invalidFacilityError,
      scannerStatus: 'error',
      type: 'cameraIssueReported',
    });

    expect(nextState).toBe(state);
  });

  it('tracks online state', () => {
    const state = checkInReducer(initialCheckInState, { online: false, type: 'onlineChanged' });

    expect(state.online).toBe(false);
  });

  it('ignores no-op scanner and online updates', () => {
    const activeState = { ...initialCheckInState, online: true, scannerStatus: 'starting' as const };
    const sameScannerState = checkInReducer(activeState, { scannerStatus: 'starting', type: 'scannerStatusChanged' });
    const sameOnlineState = checkInReducer(activeState, { online: true, type: 'onlineChanged' });

    expect(sameScannerState).toBe(activeState);
    expect(sameOnlineState).toBe(activeState);
  });

  it('resets to loading when member context is not available yet', () => {
    const state = checkInReducer({ ...initialCheckInState, phase: 'confirmed', result: makeResult() }, { type: 'reset' });

    expect(state.phase).toBe('loading');
    expect(state.user).toBeUndefined();
  });
});
