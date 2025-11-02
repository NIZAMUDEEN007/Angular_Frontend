import { ApprovalStatus, ServiceStatus, BookingStatus } from './enums';

// For PUT /api/admin/spas/{id}/approve
export interface ApprovalRequest {
  status: ApprovalStatus;
}

// For PUT /api/client/services/{id}/status
export interface ServiceStatusUpdateRequest {
  status: ServiceStatus;
}

// For PUT /api/client/bookings/{id}/status
export interface BookingStatusUpdateRequest {
  status: BookingStatus;
}
