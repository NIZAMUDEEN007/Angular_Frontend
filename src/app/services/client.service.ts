import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  SpaView, 
  SpaCreateRequest, 
  ServiceView, 
  ServiceCreateRequest, 
  BookingView, 
  ServiceStatus, 
  BookingStatus,
  ApprovalStatus,
  PaymentStatus
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly baseUrl = 'http://localhost:8080/api/client';

  constructor(private http: HttpClient) { }

  // POST /api/client/spas - Creates a new spa (Feature 10)
  addSpa(data: SpaCreateRequest): Observable<SpaView> {
    return this.http.post<SpaView>(`${this.baseUrl}/spas`, data, {
      withCredentials: true
    });
  }

  // POST /api/client/spas/{id}/services - Adds a new service to a specific spa (Feature 11)
  addService(spaId: number, data: ServiceCreateRequest): Observable<ServiceView> {
    return this.http.post<ServiceView>(`${this.baseUrl}/spas/${spaId}/services`, data, {
      withCredentials: true
    });
  }

  // PUT /api/client/services/{id}/status - Toggles a service's status (Feature 12)
  updateServiceStatus(serviceId: number, status: ServiceStatus): Observable<ServiceView> {
    return this.http.put<ServiceView>(`${this.baseUrl}/services/${serviceId}/status`, { status }, {
      withCredentials: true
    });
  }

  // PUT /api/client/bookings/{id}/status - Confirms or declines a booking (Feature 13)
  updateBookingStatus(bookingId: number, status: BookingStatus): Observable<BookingView> {
    return this.http.put<BookingView>(`${this.baseUrl}/bookings/${bookingId}/status`, { status }, {
      withCredentials: true
    });
  }

  // GET /api/client/spas/{id}/bookings - Gets all bookings for a specific spa (Feature 16)
  getBookingsForSpa(spaId: number): Observable<BookingView[]> {
    return this.http.get<BookingView[]>(`${this.baseUrl}/spas/${spaId}/bookings`, {
      withCredentials: true
    });
  }

  // GET /api/client/spas/{id}/bookings/filter - Filters bookings by status (Feature 17)
  getFilteredBookings(spaId: number, status: BookingStatus): Observable<BookingView[]> {
    return this.http.get<BookingView[]>(`${this.baseUrl}/spas/${spaId}/bookings/filter`, {
      params: { status },
      withCredentials: true
    });
  }

  // Note: The backend doesn't have endpoints for getting all client spas or recent bookings
  // These would need to be implemented in the backend or we use mock data for dashboard
  getMySpas(): Observable<SpaView[]> {
    return this.http.get<SpaView[]>(`${this.baseUrl}/spas`, {
      withCredentials: true
    });
  }

  getRecentBookings(): Observable<BookingView[]> {
    // Since there's no GET /api/client/recent-bookings endpoint, we'll use mock data
    // In a real implementation, you'd need to add this endpoint to the backend
    return new Observable(observer => {
      observer.next([
        {
          id: 1,
          bookingTime: '2024-01-15T10:00:00Z',
          status: BookingStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          customerId: 1,
          customerName: 'John Doe',
          spaId: 1,
          spaName: 'Serenity Spa',
          serviceId: 1,
          serviceName: 'Deep Tissue Massage',
          originalPrice: 120,
          finalPrice: 120
        }
      ]);
      observer.complete();
    });
  }

  getSpaServices(spaId: number): Observable<ServiceView[]> {
    return this.http.get<ServiceView[]>(`${this.baseUrl}/spas/${spaId}/services`, {
      withCredentials: true
    });
  }
}
