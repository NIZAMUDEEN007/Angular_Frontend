import { Role, MembershipStatus } from './enums';

// The main object we get on login/auth/me
export interface UserView {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: Role;
  membershipName: string | null;
  membershipStatus: MembershipStatus | null;
}

// For POST /api/auth/login
export interface LoginRequest {
  email: string;
  password?: string; // Make password optional in the interface, handle in form
}

// For POST /api/auth/register
export interface RegistrationRequest {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: Role; // Will be USER or CLIENT
}

// For PUT /api/user/profile
export interface ProfileUpdateRequest {
  firstName: string;
  lastName: string;
  phone: string;
}
