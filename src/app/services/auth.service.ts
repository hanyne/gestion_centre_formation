// services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any = null;
  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('user');
    if (user && user !== 'undefined' && user !== 'null') {
      try {
        this.currentUser = JSON.parse(user);
        console.log('Loaded user from localStorage:', this.currentUser);
      } catch (e) {
        console.error('Error parsing user from localStorage during initialization:', e);
        localStorage.removeItem('user');
        this.currentUser = null;
      }
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        console.log('Login response:', response);
        if (response.token && response.role) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          if (response.user && typeof response.user === 'object' && response.user !== null && response.user._id) {
            const userString = JSON.stringify(response.user);
            localStorage.setItem('user', userString);
            this.currentUser = response.user;
            console.log('Stored user in localStorage:', response.user);
          } else {
            console.warn('No valid user object or _id in login response:', response.user);
            localStorage.removeItem('user');
            this.currentUser = null;
          }
        } else {
          console.error('Missing token or role in login response:', response);
          throw new Error('Invalid login response');
        }
      })
    );
  }

  register(email: string, password: string, role: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { email, password, role }).pipe(
      tap((response) => {
        console.log('Register response:', response);
        if (response.token && response.role) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          if (response.user && typeof response.user === 'object' && response.user !== null && response.user._id) {
            const userString = JSON.stringify(response.user);
            localStorage.setItem('user', userString);
            this.currentUser = response.user;
            console.log('Stored user in localStorage:', response.user);
          } else {
            console.warn('No valid user object or _id in register response:', response.user);
            localStorage.removeItem('user');
            this.currentUser = null;
          }
        } else {
          console.error('Missing token or role in register response:', response);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  isApprenant(): boolean {
    return this.getRole() === 'apprenant';
  }

  isFormateur(): boolean {
    return this.getRole() === 'formateur';
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  getCurrentUser(): any {
    if (this.currentUser) {
      console.log('Current user from memory:', this.currentUser);
      return this.currentUser;
    }
    const user = localStorage.getItem('user');
    if (user && user !== 'undefined' && user !== 'null') {
      try {
        this.currentUser = JSON.parse(user);
        console.log('Current user from localStorage:', this.currentUser);
        return this.currentUser;
      } catch (e) {
        console.error('Error parsing user from localStorage in getCurrentUser:', e);
        return null;
      }
    }
    console.log('No user found in localStorage');
    return null;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    this.currentUser = null;
    console.log('Logged out, cleared localStorage');
    window.location.href = '/home';
  }
}