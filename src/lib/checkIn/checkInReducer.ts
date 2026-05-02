import type { CheckInError, CheckInFlowState, CheckInResult, CurrentMember, ScannerStatus } from './checkIn.type';

export type CheckInAction =
  | { type: 'cameraIssueReported'; error: CheckInError; scannerStatus: ScannerStatus }
  | { type: 'checkInFailed'; error: CheckInError }
  | { type: 'checkInSucceeded'; result: CheckInResult }
  | { type: 'initialized'; user: CurrentMember }
  | { type: 'manualCodeChanged'; value: string }
  | { type: 'onlineChanged'; online: boolean }
  | { type: 'reset' }
  | { type: 'scannerStatusChanged'; scannerStatus: ScannerStatus };

export const initialCheckInState: CheckInFlowState = {
  manualCode: '',
  online: true,
  phase: 'loading',
  scannerStatus: 'idle',
};

export const checkInReducer = (state: CheckInFlowState, action: CheckInAction): CheckInFlowState => {
  if (action.type === 'initialized') {
    return {
      ...state,
      phase: 'ready',
      user: action.user,
    };
  }

  if (action.type === 'manualCodeChanged') {
    return {
      ...state,
      lastError: undefined,
      manualCode: action.value,
    };
  }

  if (action.type === 'checkInSucceeded') {
    return {
      ...state,
      lastError: undefined,
      manualCode: '',
      phase: 'confirmed',
      result: action.result,
    };
  }

  if (action.type === 'checkInFailed') {
    return {
      ...state,
      lastError: action.error,
      phase: 'ready',
      result: undefined,
    };
  }

  if (action.type === 'cameraIssueReported') {
    if (state.lastError === action.error && state.scannerStatus === action.scannerStatus) {
      return state;
    }

    return {
      ...state,
      lastError: action.error,
      scannerStatus: action.scannerStatus,
    };
  }

  if (action.type === 'scannerStatusChanged') {
    if (state.scannerStatus === action.scannerStatus) {
      return state;
    }

    return {
      ...state,
      scannerStatus: action.scannerStatus,
    };
  }

  if (action.type === 'onlineChanged') {
    if (state.online === action.online) {
      return state;
    }

    return {
      ...state,
      online: action.online,
    };
  }

  return {
    ...initialCheckInState,
    online: state.online,
    phase: state.user ? 'ready' : 'loading',
    user: state.user,
  };
};
