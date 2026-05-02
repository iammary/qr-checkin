import { checkInWithFacilityCode, createCameraError, createCheckInResult, extractFacilityId, findFacilityById } from './checkInService';
import { getCurrentMember, getFacilities } from './facilities';

describe('checkInService', () => {
  it('looks up a facility by plain ID', () => {
    const facility = findFacilityById('facility-001');

    expect(facility?.name).toBe('City Fitness Central');
  });

  it('extracts facility IDs from supported QR payload shapes', () => {
    expect(extractFacilityId('   ')).toBe('');
    expect(extractFacilityId(' facility-001 ')).toBe('facility-001');
    expect(extractFacilityId('{"facilityId":"facility-002"}')).toBe('facility-002');
    expect(extractFacilityId('{"id":"facility-004"}')).toBe('facility-004');
    expect(extractFacilityId('https://example.test/checkin?facility=facility-003')).toBe('facility-003');
    expect(extractFacilityId('https://example.test/checkin?facilityId=FACILITY-006')).toBe('facility-006');
    expect(extractFacilityId('https://example.test/checkin?id=facility-007')).toBe('facility-007');
    expect(extractFacilityId('https://example.test/checkin/facility-005')).toBe('facility-005');
    expect(extractFacilityId('https://example.test/checkin')).toBe('https://example.test/checkin');
    expect(extractFacilityId('{"facilityId":42}')).toBe('{"facilityid":42}');
    expect(extractFacilityId('{"name":"Harbour View Wellness"}')).toBe('{"name":"harbour view wellness"}');
    expect(extractFacilityId('prefix-FACILITY-008-suffix')).toBe('facility-008');
  });

  it('creates a valid check-in result', () => {
    const facility = getFacilities()[0];
    const user = getCurrentMember();

    const result = createCheckInResult({
      checkedInAt: '2026-05-02T09:30:00.000Z',
      facility,
      source: 'manual',
      user,
    });

    expect(result).toMatchObject({
      checkedInAt: '2026-05-02T09:30:00.000Z',
      facility: {
        id: 'facility-001',
      },
      member: {
        name: 'Jane Doe',
      },
      source: 'manual',
      status: 'confirmed',
    });
  });

  it('falls back to the legacy membership type when no membership details tier is present', () => {
    const result = createCheckInResult({
      checkedInAt: '2026-05-02T09:30:00.000Z',
      facility: getFacilities()[0],
      source: 'qr',
      user: {
        ...getCurrentMember(),
        membershipDetails: undefined,
        membershipType: 'elite',
      },
    });

    expect(result.member.membershipType).toBe('elite');
  });

  it('returns an invalid facility error for unknown codes', () => {
    const result = checkInWithFacilityCode({
      checkedInAt: '2026-05-02T09:30:00.000Z',
      code: 'facility-9999',
      source: 'manual',
      user: getCurrentMember(),
    });

    expect(result).toEqual({
      error: {
        code: 'invalid_facility',
        message: 'That facility code was not found.',
        recovery: 'Check the QR code or type the facility ID exactly, for example facility-001.',
      },
      ok: false,
    });
  });

  it('reports unavailable member context', () => {
    const result = checkInWithFacilityCode({
      checkedInAt: '2026-05-02T09:30:00.000Z',
      code: 'facility-001',
      source: 'manual',
    });

    expect(result.ok).toBe(false);
    expect(result.ok ? undefined : result.error.code).toBe('user_unavailable');
  });

  it('creates camera recovery errors', () => {
    expect(createCameraError('camera_permission_denied').recovery).toContain('Manual entry still works');
    expect(createCameraError('camera_unavailable').message).toContain('No usable camera');
    expect(createCameraError('offline_camera_limited').message).toBe('You are offline.');
    expect(createCameraError('scanner_error').recovery).toContain('HTTPS');
  });

  it('preserves custom camera recovery messages', () => {
    expect(createCameraError('camera_permission_denied', 'Permission blocked').message).toBe('Permission blocked');
    expect(createCameraError('camera_unavailable', 'No device').message).toBe('No device');
    expect(createCameraError('offline_camera_limited', 'Network down').message).toBe('Network down');
    expect(createCameraError('scanner_error', 'Scanner crashed').message).toBe('Scanner crashed');
  });
});
