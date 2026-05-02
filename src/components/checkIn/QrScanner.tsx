'use client';

import { useEffect, useId, useMemo, useRef } from 'react';

import type { Html5Qrcode } from 'html5-qrcode';

import type { CheckInError, ScannerStatus } from '@/lib/checkIn/checkIn.type';
import { createCameraError } from '@/lib/checkIn/checkInService';

type QrScannerProps = {
  enabled: boolean;
  onIssue: (error: CheckInError, status: ScannerStatus) => void;
  onScan: (value: string) => void;
  onStatusChange: (status: ScannerStatus) => void;
};

const getScannerError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  const permissionDenied = /notallowed|permission|denied/i.test(message);

  return permissionDenied ? createCameraError('camera_permission_denied', message) : createCameraError('scanner_error', message);
};

export const QrScanner = ({ enabled, onIssue, onScan, onStatusChange }: QrScannerProps) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasScannedRef = useRef(false);
  const reactId = useId();
  const scannerElementId = useMemo(() => `qr-scanner-${reactId.replaceAll(':', '')}`, [reactId]);

  useEffect(() => {
    if (!enabled) {
      hasScannedRef.current = false;
      onStatusChange('idle');
      return;
    }

    if (!globalThis.isSecureContext) {
      onIssue(createCameraError('camera_unavailable', 'Camera access is blocked right now.'), 'unavailable');
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      onIssue(createCameraError('camera_unavailable'), 'unavailable');
      return;
    }

    let mounted = true;

    const startScanner = async () => {
      onStatusChange('starting');

      try {
        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode');
        const cameras = await Html5Qrcode.getCameras();

        if (!mounted) {
          return;
        }

        const preferredCamera = cameras.find(camera => /back|rear|environment/i.test(camera.label)) ?? cameras[0];

        if (!preferredCamera) {
          onIssue(createCameraError('camera_unavailable'), 'unavailable');
          return;
        }

        const scanner = new Html5Qrcode(scannerElementId, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
        });

        scannerRef.current = scanner;

        await scanner.start(
          preferredCamera.id,
          {
            fps: 10,
            qrbox: { height: 240, width: 240 },
          },
          decodedText => {
            if (hasScannedRef.current) {
              return;
            }

            hasScannedRef.current = true;
            onScan(decodedText);
          },
          () => {},
        );

        if (mounted) {
          onStatusChange('active');
        }
      } catch (error) {
        if (mounted) {
          const scannerError = getScannerError(error);
          onIssue(scannerError, scannerError.code === 'camera_permission_denied' ? 'permissionDenied' : 'error');
        }
      }
    };

    startScanner().catch(() => null);

    return () => {
      mounted = false;
      const scanner = scannerRef.current;
      scannerRef.current = null;

      if (scanner?.isScanning) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => null);
      } else {
        scanner?.clear();
      }
    };
  }, [enabled, onIssue, onScan, onStatusChange, scannerElementId]);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-black">
      <div className="grid aspect-square place-items-center text-sm text-white/75" id={scannerElementId}>
        Starting camera...
      </div>
    </div>
  );
};
