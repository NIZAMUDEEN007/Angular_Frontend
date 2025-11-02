import { ApprovalStatus, ServiceStatus } from './enums';

// For listing services
export interface ServiceView {
  id: number;
  name: string;
  description: string;
  price: number;
  durationInMinutes: number;
  approvalStatus: ApprovalStatus;
  serviceStatus: ServiceStatus;
  spaId: number;
}

// For POST /api/client/spas/{id}/services
export interface ServiceCreateRequest {
  name: string;
  description: string;
  price: number;
  durationInMinutes: number;
}
