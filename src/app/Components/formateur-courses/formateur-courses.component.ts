// formateur-courses.component.ts
import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../model/course';

@Component({
  selector: 'app-formateur-courses',
  templateUrl: './formateur-courses.component.html',
  styleUrls: ['./formateur-courses.component.css']
})
export class FormateurCoursesComponent implements OnInit {
  courses: Course[] = [];
  errorMessage: string = '';

  constructor(
    private courseService: CourseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      if (!this.authService.isFormateur()) {
        this.errorMessage = 'Accès réservé aux formateurs.';
        return;
      }
      this.loadCourses();
    } else {
      this.errorMessage = 'Utilisateur non connecté. Veuillez vous connecter.';
    }
  }

  loadCourses(): void {
    this.courseService.getInstructorCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        console.log('Courses for instructor:', this.courses);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des formations : ' + (err.error?.message || err.message);
        console.error('Error loading courses:', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  // Optional: Add sorting functionality for schedules
  private sortKey: string = 'day';
  private sortDirection: 'asc' | 'desc' = 'asc';

  sortBy(key: string): void {
    this.courses = this.courses.map(course => ({
      ...course,
      schedule: [...(course.schedule || [])].sort((a, b) => {
        let valueA: string | number = a[key as keyof typeof a] || '';
        let valueB: string | number = b[key as keyof typeof b] || '';

        if (key === 'date' && valueA && valueB) {
          valueA = new Date(valueA as string).getTime() || 0;
          valueB = new Date(valueB as string).getTime() || 0;
        }

        if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      })
    }));

    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
  }
}