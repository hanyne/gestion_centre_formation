// course.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../model/course';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:5000/api/courses';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No token found. User might not be logged in.');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`
    });
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getCourse(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  // course.service.ts
createCourse(formData: FormData): Observable<Course> {
  console.log('Sending FormData to backend:', formData); // Debug
  return this.http.post<Course>(this.apiUrl, formData, { headers: this.getHeaders() });
}

  updateCourse(formData: FormData): Observable<Course> {
    console.log('Updating course with data:', formData);
    const id = formData.get('_id') as string;
    return this.http.put<Course>(`${this.apiUrl}/${id}`, formData, { headers: this.getHeaders() });
  }

  deleteCourse(id: string): Observable<void> {
    const headers = this.getHeaders();
    console.log('Deleting course with ID:', id);
    console.log('Authorization Header:', headers.get('Authorization'));
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}