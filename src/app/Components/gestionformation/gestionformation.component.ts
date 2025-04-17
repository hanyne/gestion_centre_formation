// src/app/gestionformation/gestionformation.component.ts
import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service'; // Importer UserService
import { Course } from '../../model/course';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-gestionformation',
  templateUrl: './gestionformation.component.html',
  styleUrls: ['./gestionformation.component.css']
})
export class GestionformationComponent implements OnInit {
  courses: Course[] = [];
  instructors: any[] = []; // Liste des formateurs
  newCourse: Course = {
    _id: '',
    title: '',
    description: '',
    instructor: { _id: '', email: '' }, // Initialisation comme objet
    image: '',
    rating: 0,
    duration: '',
    price: 0,
    createdAt: new Date()
  };
  selectedCourse: Course = { ...this.newCourse };
  successMessage: string = '';
  errorMessage: string = '';
  newCourseImageFile: File | null = null;
  selectedCourseImageFile: File | null = null;
  newCourseImagePreview: string | null = null;
  selectedCourseImagePreview: string | null = null;

  constructor(
    private courseService: CourseService,
    private userService: UserService, // Injecter UserService
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadInstructors(); // Charger les formateurs
  }

  // Charger les formateurs
  loadInstructors(): void {
    this.userService.getInstructors().subscribe({
      next: (instructors) => {
        this.instructors = instructors;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des formateurs : ' + err.message;
        console.error('Error loading instructors:', err);
      }
    });
  }

  // Load all courses
  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        console.log('Courses loaded:', courses);
        this.courses = courses;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des formations : ' + err.message;
        console.error('Error loading courses:', err);
      }
    });
  }

  // Handle file selection and preview
  onFileSelected(event: Event, target: 'newCourse' | 'selectedCourse'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (target === 'newCourse') {
        this.newCourseImageFile = file;
        this.newCourseImagePreview = URL.createObjectURL(file);
      } else {
        this.selectedCourseImageFile = file;
        this.selectedCourseImagePreview = URL.createObjectURL(file);
      }
    }
  }

  // Open create modal
  openCreateModal(): void {
    if (!this.authService.isAdmin()) {
      this.errorMessage = 'Vous devez être administrateur pour ajouter une formation.';
      return;
    }
    this.newCourseImageFile = null;
    this.newCourseImagePreview = null;
    const modal = document.getElementById('createCourseModal');
    if (modal) {
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
  }

  createCourse(): void {
    if (!this.authService.isAdmin()) {
      this.errorMessage = 'Vous devez être administrateur pour ajouter une formation.';
      return;
    }

    if (!this.newCourse.title || !this.newCourse.description || !this.newCourse.instructor._id) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.newCourse.title);
    formData.append('description', this.newCourse.description);
    formData.append('instructor', this.newCourse.instructor._id); // Envoyer l'ID du formateur
    formData.append('duration', this.newCourse.duration || '');
    formData.append('price', this.newCourse.price?.toString() || '0');
    formData.append('rating', (this.newCourse.rating ?? 0).toString());
    if (this.newCourseImageFile) {
      formData.append('image', this.newCourseImageFile);
    }

    this.courseService.createCourse(formData).subscribe({
      next: (course) => {
        this.courses.push(course);
        this.successMessage = 'Formation créée avec succès !';
        this.newCourse = {
          _id: '',
          title: '',
          description: '',
          instructor: { _id: '', email: '' },
          image: '',
          rating: 0,
          duration: '',
          price: 0,
          createdAt: new Date()
        };
        this.newCourseImageFile = null;
        this.newCourseImagePreview = null;
        this.closeModal('createCourseModal');
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la création de la formation : ' + (err.error?.message || err.message);
        console.error('Error creating course:', err);
      }
    });
  }

  openEditModal(course: Course): void {
    if (!this.authService.isAdmin()) {
      this.errorMessage = 'Vous devez être administrateur pour modifier une formation.';
      return;
    }
    if (!course._id) {
      this.errorMessage = 'ID de la formation manquant.';
      return;
    }
    this.selectedCourse = { ...course };
    this.selectedCourseImageFile = null;
    this.selectedCourseImagePreview = null;
    const modal = document.getElementById('editCourseModal');
    if (modal) {
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
  }

  updateCourse(): void {
    if (!this.authService.isAdmin()) {
      this.errorMessage = 'Vous devez être administrateur pour modifier une formation.';
      return;
    }
    if (!this.selectedCourse._id) {
      this.errorMessage = 'ID de la formation manquant pour la mise à jour.';
      return;
    }

    const formData = new FormData();
    formData.append('_id', this.selectedCourse._id);
    formData.append('title', this.selectedCourse.title);
    formData.append('description', this.selectedCourse.description);
    formData.append('instructor', this.selectedCourse.instructor._id); // Envoyer l'ID du formateur
    formData.append('duration', this.selectedCourse.duration || '');
    formData.append('price', this.selectedCourse.price?.toString() || '0');
    formData.append('rating', (this.selectedCourse.rating ?? 0).toString());
    if (this.selectedCourseImageFile) {
      formData.append('image', this.selectedCourseImageFile);
    } else {
      formData.append('imagePath', this.selectedCourse.image || '');
    }

    this.courseService.updateCourse(formData).subscribe({
      next: (updatedCourse) => {
        const index = this.courses.findIndex(c => c._id === updatedCourse._id);
        if (index !== -1) {
          this.courses[index] = updatedCourse;
        }
        this.successMessage = 'Formation mise à jour avec succès !';
        this.selectedCourseImageFile = null;
        this.selectedCourseImagePreview = null;
        this.closeModal('editCourseModal');
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la mise à jour de la formation : ' + (err.error?.message || err.message);
        console.error('Error updating course:', err);
      }
    });
  }

  deleteCourse(id: string): void {
    if (!this.authService.isAdmin()) {
      this.errorMessage = 'Vous devez être administrateur pour supprimer une formation.';
      return;
    }
    if (!id) {
      this.errorMessage = 'ID de la formation manquant pour la suppression.';
      return;
    }
  
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          this.courses = this.courses.filter(c => c._id !== id);
          this.successMessage = 'Formation supprimée avec succès !';
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la suppression de la formation : ' + (err.error?.message || err.message);
          console.error('Error deleting course:', err);
        }
      });
    }
  }

  closeModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) {
      return '';
    }
    const path = imagePath.startsWith('uploads/') ? imagePath : `uploads/${imagePath}`;
    const url = `http://localhost:5000/${path}`;
    console.log('Image URL:', url);
    return url;
  }

  onImageError(event: Event): void {
    console.error('Failed to load image:', (event.target as HTMLImageElement).src);
    (event.target as HTMLImageElement).style.display = 'none';
    const parent = (event.target as HTMLImageElement).parentElement;
    if (parent) {
      parent.innerHTML = '<span class="no-image">Image non disponible</span>';
    }
  }

  logout(): void {
    this.authService.logout();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}