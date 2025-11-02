import { BookingStatus, PaymentStatus } from './enums';

// For GET /api/user/bookings
export interface BookingView {
  id: number;
  bookingTime: string; // ISO date string
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  customerId: number;
  customerName: string;
  spaId: number;
  spaName: string;
  serviceId: number;
  serviceName: string;
  originalPrice: number;
  finalPrice: number;
}

// For POST /api/user/bookings
export interface BookingRequest {
  serviceId: number;
  bookingTime: string; // ISO date string
}

// For POST /api/user/services/{id}/availability
export interface AvailabilityRequest {
  date: string; // 'YYYY-MM-DD'
}

export interface AvailabilityResponse {
  availableSlots: string[]; // 'HH:mm'
}

// For POST payment endpoint
export interface PaymentRequest {
  fromUpiId: string;
  toUpiId: string;
  toAccountNumber: string;
  amount: number;
  remarks?: string;
}
