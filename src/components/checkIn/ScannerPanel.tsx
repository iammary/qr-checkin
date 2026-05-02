'use client';

import { Camera, CameraOff } from 'lucide-react';

import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import type { CheckInError, ScannerStatus } from '@/lib/checkIn/checkIn.type';

import { QrScanner } from './QrScanner';

type ScannerPanelProps = {
  enabled: boolean;
  onIssue: (error: CheckInError, status: ScannerStatus) => void;
  onScan: (value: string) => void;
  onSetEnabled: (enabled: boolean) => void;
  onStatusChange: (status: ScannerStatus) => void;
  online: boolean;
  status: ScannerStatus;
};

const statusLabel = {
  active: 'Scanning',
  error: 'Needs attention',
  idle: 'Ready',
  permissionDenied: 'Permission denied',
  starting: 'Starting',
  unavailable: 'Unavailable',
} satisfies Record<ScannerStatus, string>;

const getScannerBadgeStatus = (status: ScannerStatus) => {
  if (status === 'active') {
    return 'success';
  }

  if (status === 'error' || status === 'permissionDenied') {
    return 'warning';
  }

  return 'info';
};

export const ScannerPanel = ({ enabled, onIssue, onScan, onSetEnabled, onStatusChange, online, status }: ScannerPanelProps) => {
  const cameraBlocked = globalThis.window !== undefined && !globalThis.isSecureContext;

  return (
    <Card as="section" className="grid gap-4" padding="md">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="grid gap-1">
            <CardTitle>Scan facility QR code</CardTitle>
            <CardDescription>Use a facility QR code or enter the facility ID manually.</CardDescription>
          </div>
          <Badge status={getScannerBadgeStatus(status)}>{statusLabel[status]}</Badge>
        </div>
      </CardHeader>

      {enabled ? (
        <QrScanner enabled={enabled} onIssue={onIssue} onScan={onScan} onStatusChange={onStatusChange} />
      ) : (
        <div className="grid aspect-square place-items-center rounded-lg border border-dashed border-border bg-muted/45 p-6 text-center">
          <div className="grid max-w-64 gap-3">
            <Camera className="mx-auto size-10 text-primary" />
            <p className="text-sm leading-6 text-muted-foreground">Start the camera when you are ready. Manual entry stays available.</p>
          </div>
        </div>
      )}

      {cameraBlocked ? <Alert tone="warning">Camera access is blocked right now. Use manual entry below.</Alert> : null}
      {online ? null : <Alert tone="warning">Offline mode is active. Manual entry is the dependable path.</Alert>}

      <Button
        className="w-full"
        contrast={enabled ? 'outline' : 'solid'}
        disabled={cameraBlocked && !enabled}
        onClick={() => onSetEnabled(!enabled)}
        tone={enabled ? 'secondary' : 'default'}
        type="button">
        {enabled ? <CameraOff /> : <Camera />}
        {enabled ? 'Stop camera' : 'Start camera'}
      </Button>
    </Card>
  );
};
