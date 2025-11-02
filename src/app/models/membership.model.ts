// For listing memberships
export interface MembershipView {
  id: number;
  name: string;
  description: string;
  pricePerMonth: number;
  discountPercentage: number;
}

// For POST /api/admin/memberships
export interface MembershipCreateRequest {
  name: string;
  description: string;
  pricePerMonth: number;
  discountPercentage: number;
}

// For POST /api/user/membership/subscribe
export interface MembershipSubscribeRequest {
  membershipId: number;
}
