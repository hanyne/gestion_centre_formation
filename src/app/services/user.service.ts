// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/auth/users'; // Adjust to your backend URL

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // Get all users (formateurs and apprenants)
  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  // Get a single user by ID
  getUser(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Create a new user
  createUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user, { headers: this.getHeaders() });
  }

  // Update a user
  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user, { headers: this.getHeaders() });
  }

  // Delete a user
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}