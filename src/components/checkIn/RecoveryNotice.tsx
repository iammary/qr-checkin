import { Alert } from '@/components/ui/Alert';
import type { CheckInError } from '@/lib/checkIn/checkIn.type';

type RecoveryNoticeProps = {
  error?: CheckInError;
  online: boolean;
};

const errorTone = (error: CheckInError) => {
  if (error.code === 'invalid_facility') {
    return 'danger';
  }

  if (error.code === 'camera_permission_denied' || error.code === 'camera_unavailable' || error.code === 'offline_camera_limited') {
    return 'warning';
  }

  return 'info';
};

export const RecoveryNotice = ({ error, online }: RecoveryNoticeProps) => {
  if (error) {
    return (
      <Alert tone={errorTone(error)}>
        <strong className="block font-semibold">{error.message}</strong>
        <span className="block">{error.recovery}</span>
      </Alert>
    );
  }

  if (!online) {
    return (
      <Alert tone="warning">
        <strong className="block font-semibold">You are offline.</strong>
        <span className="block">The app can still validate manual check-ins against bundled facility data after it has loaded.</span>
      </Alert>
    );
  }

  return (
    <Alert tone="info">
      Camera scanning needs a secure browser context and permission. Manual entry is always available as the fallback.
    </Alert>
  );
};
