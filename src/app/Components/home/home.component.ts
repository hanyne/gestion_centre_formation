// src/app/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ReviewService } from '../../services/review.service';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service'; // Import UserService
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course } from 'src/app/model/course';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  reviews: any[] = [];
  courses: Course[] = [];
  instructors: any[] = []; // Add property to store instructors
  reviewForm: FormGroup;
  isLoggedIn: boolean = false;
  isApprenant: boolean = false;
  isSubmitting: boolean = false;
  selectedRating: number = 5;

  constructor(
    private authService: AuthService,
    private reviewService: ReviewService,
    private courseService: CourseService,
    private userService: UserService, // Inject UserService
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isApprenant = this.authService.isApprenant();
    this.loadReviews();
    this.loadCourses();
    this.loadInstructors(); // Load instructors
  }

  loadReviews(): void {
    this.reviewService.getReviews().subscribe({
      next: (reviews) => {
        this.reviews = reviews;
      },
      error: (err) => {
        console.error('Error fetching reviews:', err);
      },
    });
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        console.log('Courses loaded:', courses);
        this.courses = courses;
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
      },
    });
  }

  loadInstructors(): void {
  this.userService.getInstructors().subscribe({
    next: (instructors) => {
      console.log('Instructors loaded:', instructors);
      this.instructors = instructors;
    },
    error: (err) => {
      console.error('Error fetching instructors:', err);
      if (err.status === 401) {
        console.warn('User not authorized to fetch instructors');
        this.instructors = []; // Fallback to empty array
      }
    },
  });
}

  submitReview(): void {
    if (this.reviewForm.valid) {
      this.isSubmitting = true;
      this.reviewService.createReview(this.reviewForm.value).subscribe({
        next: (review) => {
          this.reviews.unshift(review);
          this.reviewForm.reset({ rating: 5, comment: '' });
          this.selectedRating = 5;
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Error submitting review:', err);
          alert('Erreur lors de la soumission de l’avis. Veuillez réessayer.');
          this.isSubmitting = false;
        },
      });
    }
  }

  selectRating(rating: number): void {
    this.selectedRating = rating;
    this.reviewForm.patchValue({ rating });
  }
}