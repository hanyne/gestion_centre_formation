// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role); // Store role in localStorage
        }
      })
    );
  }

  register(email: string, password: string, role: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { email, password, role }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role); // Store role in localStorage
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string {
    return localStorage.getItem('role') || 'apprenant'; // Changed 'étudiant' to 'apprenant'
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  isFormateur(): boolean {
    return this.getRole() === 'formateur';
  }

  isApprenant(): boolean { // Changed 'isEtudiant' to 'isApprenant'
    return this.getRole() === 'apprenant'; // Changed 'étudiant' to 'apprenant'
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Remove role on logout
  }
}