export type Facility = {
  address: string;
  facilities: string[];
  id: string;
  location: {
    latitude: number;
    longitude: number;
  };
  name: string;
};

export type CurrentMember = {
  email: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  id: string;
  memberSince: string;
  membershipDetails?: {
    accessLevel?: string;
    allowedFacilities?: string;
    expiryDate?: string;
    homeLocation?: string;
    tier?: string;
    visits?: number;
  };
  membershipStatus?: 'active' | 'expired' | 'paused' | 'pending' | string;
  membershipType?: 'basic' | 'premium' | 'elite' | string;
  name: string;
  profileImage?: string;
};

export type CheckInSource = 'manual' | 'qr';

export type CheckInErrorCode =
  | 'camera_permission_denied'
  | 'camera_unavailable'
  | 'invalid_facility'
  | 'offline_camera_limited'
  | 'scanner_error'
  | 'user_unavailable';

export type CheckInError = {
  code: CheckInErrorCode;
  message: string;
  recovery: string;
};

export type CheckInResult = {
  checkedInAt: string;
  facility: Facility;
  id: string;
  member: {
    id: string;
    membershipStatus?: string;
    membershipType?: string;
    name: string;
  };
  source: CheckInSource;
  status: 'confirmed';
};

export type CheckInServiceResult = { ok: true; result: CheckInResult } | { error: CheckInError; ok: false };

export type ScannerStatus = 'idle' | 'starting' | 'active' | 'unavailable' | 'permissionDenied' | 'error';

export type CheckInFlowState = {
  lastError?: CheckInError;
  manualCode: string;
  online: boolean;
  phase: 'loading' | 'ready' | 'confirmed';
  result?: CheckInResult;
  scannerStatus: ScannerStatus;
  user?: CurrentMember;
};
