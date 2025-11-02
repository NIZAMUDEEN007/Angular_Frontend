import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  UserView, 
  SpaView, 
  ServiceView, 
  MembershipView, 
  MembershipCreateRequest, 
  ApprovalStatus, 
  MembershipStatus 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly baseUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) { }

  approveSpa(spaId: number, status: ApprovalStatus): Observable<SpaView> {
    return this.http.put<SpaView>(`${this.baseUrl}/spas/${spaId}/approve`, { status }, {
      withCredentials: true
    });
  }

  approveService(serviceId: number, status: ApprovalStatus): Observable<ServiceView> {
    return this.http.put<ServiceView>(`${this.baseUrl}/services/${serviceId}/approve`, { status }, {
      withCredentials: true
    });
  }

  getAllClients(): Observable<UserView[]> {
    return this.http.get<UserView[]>(`${this.baseUrl}/clients`, {
      withCredentials: true
    });
  }

  createMembership(data: MembershipCreateRequest): Observable<MembershipView> {
    return this.http.post<MembershipView>(`${this.baseUrl}/memberships`, data, {
      withCredentials: true
    });
  }

  getAllMemberships(): Observable<MembershipView[]> {
    return this.http.get<MembershipView[]>(`${this.baseUrl}/memberships`, {
      withCredentials: true
    });
  }

  deleteMembership(membershipId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/memberships/${membershipId}`, {
      withCredentials: true
    });
  }

  getUsersByStatus(status: MembershipStatus): Observable<UserView[]> {
    return this.http.get<UserView[]>(`${this.baseUrl}/users/filter/status`, {
      params: { status },
      withCredentials: true
    });
  }

  getUsersByMembership(membershipId: number): Observable<UserView[]> {
    return this.http.get<UserView[]>(`${this.baseUrl}/users/filter/membership`, {
      params: { membershipId: membershipId.toString() },
      withCredentials: true
    });
  }

  // Get all spas for admin dashboard
  getAllSpas(status?: ApprovalStatus): Observable<SpaView[]> {
    let params: any = {};
    if (status) {
      params.status = status.toString();
    }
    return this.http.get<SpaView[]>(`${this.baseUrl}/spas`, {
      params,
      withCredentials: true
    });
  }

  // Get all services for admin dashboard
  getAllServices(status?: ApprovalStatus): Observable<ServiceView[]> {
    let params: any = {};
    if (status) {
      params.status = status.toString();
    }
    return this.http.get<ServiceView[]>(`${this.baseUrl}/services`, {
      params,
      withCredentials: true
    });
  }
}
