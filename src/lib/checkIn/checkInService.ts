import type { CheckInError, CheckInResult, CheckInServiceResult, CheckInSource, CurrentMember, Facility } from './checkIn.type';
import { getFacilities } from './facilities';

const facilityIdPattern = /facility-\d+/i;

const errorMessages = {
  invalidFacility: {
    code: 'invalid_facility',
    message: 'That facility ID was not found.',
    recovery: 'Check the QR code or type the facility ID exactly, for example facility-001.',
  },
  userUnavailable: {
    code: 'user_unavailable',
    message: 'Member context is still loading.',
    recovery: 'Wait a moment, then try again.',
  },
} as const satisfies Record<string, CheckInError>;

export const normalizeFacilityCode = (rawCode: string) => rawCode.trim();

export const extractFacilityId = (rawCode: string) => {
  const trimmed = normalizeFacilityCode(rawCode);

  if (trimmed.length === 0) {
    return '';
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;

    if (parsed && typeof parsed === 'object') {
      let facilityId: unknown;

      if ('facilityId' in parsed) {
        facilityId = parsed.facilityId;
      } else if ('id' in parsed) {
        facilityId = parsed.id;
      }

      if (typeof facilityId === 'string') {
        return facilityId.trim().toLowerCase();
      }
    }
  } catch {
    // Plain text QR payloads are the expected facility check-in format.
  }

  try {
    const url = new URL(trimmed);
    const queryValue = url.searchParams.get('facility') ?? url.searchParams.get('facilityId') ?? url.searchParams.get('id');
    const pathMatch = url.pathname.match(facilityIdPattern);

    return (queryValue ?? pathMatch?.[0] ?? trimmed).trim().toLowerCase();
  } catch {
    const match = trimmed.match(facilityIdPattern);

    return (match?.[0] ?? trimmed).trim().toLowerCase();
  }
};

export const findFacilityById = (facilityId: string, facilities: Facility[] = getFacilities()) => {
  const normalizedId = extractFacilityId(facilityId);

  return facilities.find(facility => facility.id.toLowerCase() === normalizedId);
};

export const createCheckInResult = ({
  checkedInAt,
  facility,
  source,
  user,
}: {
  checkedInAt: string;
  facility: Facility;
  source: CheckInSource;
  user: CurrentMember;
}) =>
  ({
    checkedInAt,
    facility,
    id: `checkin-${user.id}-${facility.id}-${Date.parse(checkedInAt)}`,
    member: {
      id: user.id,
      membershipStatus: user.membershipStatus,
      membershipType: user.membershipDetails?.tier ?? user.membershipType,
      name: user.name,
    },
    source,
    status: 'confirmed',
  }) satisfies CheckInResult;

export const checkInWithFacilityCode = ({
  checkedInAt,
  code,
  facilities = getFacilities(),
  source,
  user,
}: {
  checkedInAt: string;
  code: string;
  facilities?: Facility[];
  source: CheckInSource;
  user?: CurrentMember;
}): CheckInServiceResult => {
  if (!user) {
    return { error: errorMessages.userUnavailable, ok: false };
  }

  const facility = findFacilityById(code, facilities);

  if (!facility) {
    return { error: errorMessages.invalidFacility, ok: false };
  }

  return {
    ok: true,
    result: createCheckInResult({ checkedInAt, facility, source, user }),
  };
};

export const createCameraError = (code: CheckInError['code'], message?: string): CheckInError => {
  if (code === 'camera_permission_denied') {
    return {
      code,
      message: message ?? 'Camera permission was denied.',
      recovery: 'Allow camera access, then start the scanner again. Manual entry still works.',
    };
  }

  if (code === 'camera_unavailable') {
    return {
      code,
      message: message ?? 'Camera access is unavailable on this device.',
      recovery: 'Use manual facility ID entry or try another device.',
    };
  }

  if (code === 'offline_camera_limited') {
    return {
      code,
      message: message ?? 'You are offline.',
      recovery: 'Manual entry can still validate saved facility IDs. Camera scanning may depend on this device.',
    };
  }

  return {
    code: 'scanner_error',
    message: message ?? 'The QR scanner could not start.',
    recovery: 'Refresh the app or use manual entry.',
  };
};
