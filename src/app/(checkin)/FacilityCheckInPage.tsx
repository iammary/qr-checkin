'use client';

import { useCallback, useState } from 'react';

import { CheckInConfirmation } from '@/components/checkIn/CheckInConfirmation';
import { CheckInLoading } from '@/components/checkIn/CheckInLoading';
import { ManualEntryForm } from '@/components/checkIn/ManualEntryForm';
import { MemberSummary } from '@/components/checkIn/MemberSummary';
import { RecoveryNotice } from '@/components/checkIn/RecoveryNotice';
import { ScannerPanel } from '@/components/checkIn/ScannerPanel';
import { Badge } from '@/components/ui/Badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { useCheckInFlow } from '@/lib/checkIn/useCheckInFlow';

export const FacilityCheckInPage = () => {
  const { reportCameraIssue, reset, setScannerStatus, state, submitManualCode, submitScannedCode, updateManualCode } = useCheckInFlow();
  const [scannerEnabled, setScannerEnabled] = useState(false);

  const handleScan = useCallback((value: string) => {
    setScannerEnabled(false);
    submitScannedCode(value);
  }, [submitScannedCode]);

  const handleScannerIssue = useCallback((...parameters: Parameters<typeof reportCameraIssue>) => {
    setScannerEnabled(false);
    reportCameraIssue(...parameters);
  }, [reportCameraIssue]);

  const handleReset = useCallback(() => {
    setScannerEnabled(false);
    reset();
  }, [reset]);

  if (state.phase === 'loading' || !state.user) {
    return <CheckInLoading />;
  }

  return (
    <main className="min-h-screen bg-background px-4 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto grid w-full max-w-5xl gap-5">
        <header className="grid gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="grid max-w-2xl gap-2">
              <Badge status="info">Facility Check-In PWA</Badge>
              <Typography scale="title">Scan or enter a facility code</Typography>
              <Typography tone="muted">
                Validate the local facility list and produce a staff-ready confirmation screen. Manual entry works even when camera access is unavailable.
              </Typography>
            </div>
            <Badge status={state.online ? 'success' : 'warning'}>{state.online ? 'Online' : 'Offline'}</Badge>
          </div>
          <MemberSummary user={state.user} />
        </header>

        {state.result ? (
          <CheckInConfirmation onReset={handleReset} result={state.result} />
        ) : (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
            <ScannerPanel
              enabled={scannerEnabled}
              onIssue={handleScannerIssue}
              onScan={handleScan}
              onSetEnabled={setScannerEnabled}
              onStatusChange={setScannerStatus}
              online={state.online}
              status={state.scannerStatus}
            />

            <section className="grid content-start gap-5">
              <Card className="grid gap-4" padding="md">
                <CardHeader>
                  <CardTitle>Manual fallback</CardTitle>
                  <CardDescription>Type the facility ID if the camera is blocked, unavailable, or inconvenient.</CardDescription>
                </CardHeader>
                <ManualEntryForm onChange={updateManualCode} onSubmit={submitManualCode} value={state.manualCode} />
              </Card>

              <RecoveryNotice error={state.lastError} online={state.online} />
            </section>
          </div>
        )}
      </div>
    </main>
  );
};
