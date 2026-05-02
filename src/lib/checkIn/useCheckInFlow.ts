import { useCallback, useEffect, useReducer } from 'react';

import type { CheckInError, CheckInSource, CurrentMember, ScannerStatus } from './checkIn.type';
import { checkInReducer, initialCheckInState } from './checkInReducer';
import { checkInWithFacilityCode, createCameraError } from './checkInService';
import { getCurrentMember } from './facilities';

export const getNavigatorOnlineStatus = () => (globalThis.navigator === undefined ? true : globalThis.navigator.onLine);

const defaultNow = () => new Date();

type UseCheckInFlowOptions = {
  initialOnline?: boolean;
  now?: () => Date;
  user?: CurrentMember;
};

type PreventableSubmitEvent = {
  preventDefault: () => void;
};

export const useCheckInFlow = ({ initialOnline, now = defaultNow, user = getCurrentMember() }: UseCheckInFlowOptions = {}) => {
  const [state, dispatch] = useReducer(checkInReducer, {
    ...initialCheckInState,
    online: initialOnline ?? true,
    phase: 'ready',
    user,
  });

  useEffect(() => {
    const handleOnline = () => dispatch({ online: true, type: 'onlineChanged' });
    const handleOffline = () => dispatch({ online: false, type: 'onlineChanged' });

    if (initialOnline === undefined) {
      dispatch({ online: getNavigatorOnlineStatus(), type: 'onlineChanged' });
    }

    globalThis.addEventListener('online', handleOnline);
    globalThis.addEventListener('offline', handleOffline);

    return () => {
      globalThis.removeEventListener('online', handleOnline);
      globalThis.removeEventListener('offline', handleOffline);
    };
  }, [initialOnline]);

  const submitCode = useCallback(
    (code: string, source: CheckInSource) => {
      const result = checkInWithFacilityCode({
        checkedInAt: now().toISOString(),
        code,
        source,
        user: state.user,
      });

      if (result.ok) {
        dispatch({ result: result.result, type: 'checkInSucceeded' });
      } else {
        dispatch({ error: result.error, type: 'checkInFailed' });
      }
    },
    [now, state.user],
  );

  const submitManualCode = useCallback(
    (event?: PreventableSubmitEvent) => {
      event?.preventDefault();
      submitCode(state.manualCode, 'manual');
    },
    [state.manualCode, submitCode],
  );

  const submitScannedCode = useCallback(
    (code: string) => {
      submitCode(code, 'qr');
    },
    [submitCode],
  );

  const updateManualCode = useCallback((value: string) => dispatch({ type: 'manualCodeChanged', value }), []);

  const reportCameraIssue = useCallback((error: CheckInError, scannerStatus: ScannerStatus = 'error') => {
    dispatch({ error, scannerStatus, type: 'cameraIssueReported' });
  }, []);

  const reportScannerError = useCallback(
    (message?: string) => {
      reportCameraIssue(createCameraError('scanner_error', message), 'error');
    },
    [reportCameraIssue],
  );

  const reset = useCallback(() => dispatch({ type: 'reset' }), []);

  const setScannerStatus = useCallback((scannerStatus: ScannerStatus) => dispatch({ scannerStatus, type: 'scannerStatusChanged' }), []);

  return {
    reportCameraIssue,
    reportScannerError,
    reset,
    setScannerStatus,
    state,
    submitManualCode,
    submitScannedCode,
    updateManualCode,
  };
};
