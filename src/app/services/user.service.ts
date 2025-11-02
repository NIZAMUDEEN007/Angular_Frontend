import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  UserView, 
  ProfileUpdateRequest, 
  BookingView, 
  BookingRequest, 
  AvailabilityResponse, 
  ServiceView, 
  MembershipSubscribeRequest,
  MembershipView,
  PaymentRequest
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) { }

  updateProfile(data: ProfileUpdateRequest): Observable<UserView> {
    // Common profile endpoint for all roles
    return this.http.put<UserView>(`http://localhost:8080/api/profile`, data, {
      withCredentials: true
    });
  }

  createBooking(data: BookingRequest): Observable<BookingView> {
    return this.http.post<BookingView>(`${this.baseUrl}/bookings`, data, {
      withCredentials: true
    });
  }

  getMyBookings(): Observable<BookingView[]> {
    return this.http.get<BookingView[]>(`${this.baseUrl}/bookings`, {
      withCredentials: true
    });
  }

  cancelBooking(bookingId: number): Observable<BookingView> {
    return this.http.put<BookingView>(`${this.baseUrl}/bookings/${bookingId}/cancel`, {}, {
      withCredentials: true
    });
  }

  checkAvailability(serviceId: number, date: string): Observable<AvailabilityResponse> {
    return this.http.post<AvailabilityResponse>(`${this.baseUrl}/services/${serviceId}/availability`, { date }, {
      withCredentials: true
    });
  }

  addToWishlist(serviceId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/wishlist/service/${serviceId}`, {}, {
      withCredentials: true
    });
  }

  getWishlist(): Observable<ServiceView[]> {
    return this.http.get<ServiceView[]>(`${this.baseUrl}/wishlist`, {
      withCredentials: true
    });
  }

  removeFromWishlist(serviceId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/wishlist/service/${serviceId}`, {
      withCredentials: true
    });
  }

  subscribeToMembership(membershipId: number): Observable<UserView> {
    return this.http.post<UserView>(`${this.baseUrl}/membership/subscribe`, { membershipId }, {
      withCredentials: true
    });
  }

  cancelMembership(): Observable<UserView> {
    return this.http.post<UserView>(`${this.baseUrl}/membership/cancel`, {}, {
      withCredentials: true
    });
  }

  getAllMemberships(): Observable<MembershipView[]> {
    // Common endpoint accessible to any logged-in user
    return this.http.get<MembershipView[]>(`http://localhost:8080/api/common/memberships`, {
      withCredentials: true
    });
  }

  // POST payment endpoint
  processPayment(paymentData: PaymentRequest): Observable<string> {
    // Mock payment response since backend endpoint doesn't exist
    return new Observable(observer => {
      setTimeout(() => {
        observer.next('Transaction Successful');
        observer.complete();
      }, 1000);
    });
  }

  // POST /api/user/bookings/{bookingId}/confirm-payment
  confirmBookingPayment(bookingId: number): Observable<BookingView> {
    return this.http.post<BookingView>(`${this.baseUrl}/bookings/${bookingId}/confirm-payment`, {}, {
      withCredentials: true
    });
  }
}
