import currentUserJson from '@/data/current-user.json';
import facilitiesJson from '@/data/facilities.json';

import type { CurrentMember, Facility } from './checkIn.type';

const facilities = facilitiesJson as Facility[];
const currentMember = currentUserJson as CurrentMember;

export const getFacilities = () => facilities;

export const getCurrentMember = () => currentMember;
