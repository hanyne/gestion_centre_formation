// src/app/coursedetails/coursedetails.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../model/course';
import { EnrollmentService } from 'src/app/services/enrollement.service';

@Component({
  selector: 'app-coursedetails',
  templateUrl: './coursedetails.component.html',
  styleUrls: ['./coursedetails.component.css']
})
export class CoursedetailsComponent implements OnInit {
  course: Course | null = null;
  courseId: string | null = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId) {
      this.loadCourseDetails(this.courseId);
    } else {
      this.errorMessage = 'ID de la formation non fourni.';
    }
  }

  loadCourseDetails(courseId: string): void {
    this.courseService.getCourse(courseId).subscribe({
      next: (course) => this.course = course,
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des détails de la formation.';
        console.error(err);
      }
    });
  }

  enrollInCourse(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
  
    if (!this.courseId) {
      this.errorMessage = 'ID de la formation non disponible.';
      return;
    }
  
    this.router.navigate(['/enrollment', this.courseId]);
  }

  onImageError(event: any): void {
    event.target.src = 'assets/img/courses-1.jpg';
  }
}