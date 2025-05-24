import { Component, OnInit } from '@angular/core';
import { EnrollmentService } from '../../services/enrollement.service';
import { UserService } from '../../services/user.service';
import { CourseService } from '../../services/course.service';
import { ContactService } from '../../services/contact.service';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalEnrollments: number = 0;
  totalStudents: number = 0;
  totalInstructors: number = 0;
  totalCourses: number = 0;
  totalNewMessages: number = 0;
  error: string = '';

  constructor(
    private enrollmentService: EnrollmentService,
    private userService: UserService,
    private courseService: CourseService,
    private contactService: ContactService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    // Fetch all courses first
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.totalCourses = courses.length;
        console.log('Total courses:', this.totalCourses);

        // Fetch enrollments for each course
        const enrollmentObservables = courses.map(course =>
          this.enrollmentService.getEnrollments(course._id)
        );

        // Combine all enrollment requests
        forkJoin(enrollmentObservables).subscribe({
          next: (enrollmentsArrays) => {
            // Flatten enrollments and count total
            const allEnrollments = enrollmentsArrays.flat();
            this.totalEnrollments = allEnrollments.length;
            console.log('Total enrollments:', this.totalEnrollments);

            // Count unique students
            const uniqueStudentIds = new Set(allEnrollments.map(enrollment => enrollment.user?._id));
            this.totalStudents = uniqueStudentIds.size;
            console.log('Total students:', this.totalStudents);
          },
          error: (err) => {
            this.error = err.message || 'Erreur lors du chargement des inscriptions';
            console.error('Enrollment error:', err);
          }
        });
      },
      error: (err) => {
        this.error = err.message || 'Erreur lors du chargement des cours';
        console.error('Courses error:', err);
      }
    });

    // Fetch instructors
    this.userService.getInstructors().subscribe({
      next: (instructors) => {
        this.totalInstructors = instructors.length;
        console.log('Total instructors:', this.totalInstructors);
      },
      error: (err) => {
        this.error = err.message || 'Erreur lors du chargement des formateurs';
        console.error('Instructors error:', err);
      }
    });

    // Fetch new messages
    this.contactService.getMessages().subscribe({
      next: (messages) => {
        this.totalNewMessages = messages.length; // Adjust based on backend logic for "new" messages
        console.log('Total new messages:', this.totalNewMessages);
      },
      error: (err) => {
        this.error = err.message || 'Erreur lors du chargement des messages';
        console.error('Messages error:', err);
      }
    });
  }
  logout(): void {
    this.authService.logout();
  }
}