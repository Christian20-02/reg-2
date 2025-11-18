import { Component } from '@angular/core';
import { NgIf, NgForOf } from '@angular/common';
import { AuthService } from '../auth.service';
import { CourseService, Course } from '../course.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, NgForOf],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  role: string | null = null;

  // Student view
  myCourses: Course[] = [];

  // Instructor view
  instructorSessions: Course[] = [];

  // Admin view
  allCourses: Course[] = [];

  constructor(
    private auth: AuthService,
    private courseSvc: CourseService
  ) {
    this.role = this.auth.getRole();

    // student schedule = enrolled courses
    this.myCourses = this.courseSvc.enrolled();

    // for now, instructor teaches all listed courses
    this.instructorSessions = this.courseSvc.list();

    // admin overview uses all courses
    this.allCourses = this.courseSvc.list();
  }

  // Admin summary helpers
  get totalCourses(): number {
    return this.allCourses.length;
  }

  get totalCapacity(): number {
    return this.allCourses.reduce((sum, c) => sum + c.capacity, 0);
  }

  get totalEnrolled(): number {
    return this.allCourses.reduce((sum, c) => sum + c.enrolled, 0);
  }

  get averageFillPercent(): number {
    if (!this.totalCapacity) return 0;
    return Math.round((this.totalEnrolled / this.totalCapacity) * 100);
  }
}
