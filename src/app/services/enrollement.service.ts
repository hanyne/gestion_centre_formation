// src/app/services/enrollment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from '../model/enrollement';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = 'http://localhost:5000/api/enrollments';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }

  enroll(courseId: string, nom: string, prenom: string, email: string, telephone?: string): Observable<Enrollment> {
    const body = { courseId, nom, prenom, email, telephone };
    console.log('Envoi de la requête POST avec body:', body); // Log pour déboguer
    return this.http.post<Enrollment>(this.apiUrl, body, { headers: this.getHeaders() });
  }
}