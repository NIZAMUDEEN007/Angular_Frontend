import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpaView, SpaDetailView } from '../models/spa.model';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  private readonly baseUrl = 'http://localhost:8080/api/public';

  constructor(private http: HttpClient) { }

  getAllSpas(): Observable<SpaView[]> {
    return this.http.get<SpaView[]>(`${this.baseUrl}/spas`, {
      withCredentials: true
    });
  }

  searchSpas(name: string): Observable<SpaView[]> {
    return this.http.get<SpaView[]>(`${this.baseUrl}/spas/search`, {
      params: { name },
      withCredentials: true
    });
  }

  getSpaById(spaId: number): Observable<SpaDetailView> {
    return this.http.get<SpaDetailView>(`${this.baseUrl}/spas/${spaId}`, {
      withCredentials: true
    });
  }
}
