// src/app/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ReviewService } from '../../services/review.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  reviews: any[] = [];
  reviewForm: FormGroup;
  isLoggedIn: boolean = false;
  isApprenant: boolean = false;
  isSubmitting: boolean = false;
  selectedRating: number = 5; // Default rating for star input

  constructor(
    private authService: AuthService,
    private reviewService: ReviewService,
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

  submitReview(): void {
    if (this.reviewForm.valid) {
      this.isSubmitting = true;
      this.reviewService.createReview(this.reviewForm.value).subscribe({
        next: (review) => {
          this.reviews.unshift(review);
          this.reviewForm.reset({ rating: 5, comment: '' });
          this.selectedRating = 5; // Reset star rating
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

  // Handle star rating selection
  selectRating(rating: number): void {
    this.selectedRating = rating;
    this.reviewForm.patchValue({ rating });
  }
}