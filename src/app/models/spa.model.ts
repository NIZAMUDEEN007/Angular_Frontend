import { ApprovalStatus } from './enums';
import { ServiceView } from './service.model';

// For GET /api/public/spas
export interface SpaView {
  id: number;
  name: string;
  address: string;
  description: string;
  approvalStatus: ApprovalStatus;
  ownerId: number;
}

// For GET /api/public/spas/{id}
export interface SpaDetailView extends SpaView {
  services: ServiceView[];
}

// For POST /api/client/spas
export interface SpaCreateRequest {
  name: string;
  address: string;
  description: string;
}
