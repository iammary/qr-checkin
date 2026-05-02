type ObjectValue<T extends Record<string, string>> = T[keyof T];

export const MEMBERSHIP_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  PAUSED: 'paused',
  PENDING: 'pending',
} as const;

export type MembershipStatus = ObjectValue<typeof MEMBERSHIP_STATUS>;

export const MEMBERSHIP_TYPE = {
  BASIC: 'basic',
  ELITE: 'elite',
  PREMIUM: 'premium',
} as const;

export type MembershipType = ObjectValue<typeof MEMBERSHIP_TYPE>;

export const CHECK_IN_SOURCE = {
  MANUAL: 'manual',
  QR: 'qr',
} as const;

export type CheckInSource = ObjectValue<typeof CHECK_IN_SOURCE>;

export const CHECK_IN_ERROR_CODE = {
  CAMERA_PERMISSION_DENIED: 'camera_permission_denied',
  CAMERA_UNAVAILABLE: 'camera_unavailable',
  INVALID_FACILITY: 'invalid_facility',
  OFFLINE_CAMERA_LIMITED: 'offline_camera_limited',
  SCANNER_ERROR: 'scanner_error',
  USER_UNAVAILABLE: 'user_unavailable',
} as const;

export type CheckInErrorCode = ObjectValue<typeof CHECK_IN_ERROR_CODE>;

export const CHECK_IN_RESULT_STATUS = {
  CONFIRMED: 'confirmed',
} as const;

export type CheckInResultStatus = ObjectValue<typeof CHECK_IN_RESULT_STATUS>;

export const SCANNER_STATUS = {
  ACTIVE: 'active',
  ERROR: 'error',
  IDLE: 'idle',
  PERMISSION_DENIED: 'permissionDenied',
  STARTING: 'starting',
  UNAVAILABLE: 'unavailable',
} as const;

export type ScannerStatus = ObjectValue<typeof SCANNER_STATUS>;

export const CHECK_IN_PHASE = {
  CONFIRMED: 'confirmed',
  LOADING: 'loading',
  READY: 'ready',
} as const;

export type CheckInPhase = ObjectValue<typeof CHECK_IN_PHASE>;

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
  membershipStatus?: MembershipStatus;
  membershipType?: MembershipType;
  name: string;
  profileImage?: string;
};

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
  status: CheckInResultStatus;
};

export type CheckInServiceResult = { ok: true; result: CheckInResult } | { error: CheckInError; ok: false };

export type CheckInFlowState = {
  lastError?: CheckInError;
  manualCode: string;
  online: boolean;
  phase: CheckInPhase;
  result?: CheckInResult;
  scannerStatus: ScannerStatus;
  user?: CurrentMember;
};
