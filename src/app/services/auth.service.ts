import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserView, LoginRequest, RegistrationRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<UserView | null>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private initializedSubject = new ReplaySubject<boolean>(1);
  public initialized$ = this.initializedSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in on service initialization
    console.log('AuthService: Checking if user is already logged in...');
    this.checkMe().subscribe({
      next: (user) => {
        console.log("hitted");
        console.log('AuthService: User is logged in:', user);
        this.currentUserSubject.next(user);
        this.initializedSubject.next(true);
      },
      error: (error) => {
        console.log('AuthService: User not logged in or session expired:', error);
        this.currentUserSubject.next(null);
        this.initializedSubject.next(true);
      }
    });
  }

  login(data: LoginRequest): Observable<UserView> {
    console.log('AuthService: Attempting login with:', data);
    return this.http.post<UserView>(`${this.baseUrl}/login`, data, {
      withCredentials: true
    }).pipe(
      tap(user => {
        console.log('AuthService: Login successful:', user);
        this.currentUserSubject.next(user);
      })
    );
  }

  register(data: RegistrationRequest): Observable<UserView> {
    return this.http.post<UserView>(`${this.baseUrl}/register`, data, {
      withCredentials: true
    })
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}, {
      withCredentials: true,
      responseType: 'text' // Expect text response instead of JSON
    }).pipe(
      tap(() => this.currentUserSubject.next(null))
    );
  }

  checkMe(): Observable<UserView> {
    return this.http.get<UserView>(`${this.baseUrl}/me`, {
      withCredentials: true
    });
  }


  getCurrentUser(): UserView | null {
    return this.currentUserSubject.value;
  }

  refreshCurrentUser(): Observable<UserView> {
    return this.checkMe().pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      })
    );
  }
}



