import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { CourseService, Course } from '../course.service'; // service lives in /app

@Component({
  selector: 'app-course-browsing',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './course-browsing.html',
  styleUrls: ['./course-browsing.css']
})
export class CourseBrowsingComponent {
  q = '';
  dept = '';
  courses: Course[] = [];
  msg = '';
  err = '';

  constructor(private svc: CourseService) {
    this.apply();
  }

  apply() {
    this.courses = this.svc.list(this.q, this.dept);
    this.msg = this.courses.length ? '' : 'No courses found.';
    this.err = '';
  }

  enroll(id: string) {
    const r = this.svc.enroll(id);
    if (r.ok) {
      this.msg = r.msg;
      this.err = '';
      this.apply();
    } else {
      this.err = r.msg;
      this.msg = '';
    }
  }

  drop(id: string) {
    this.svc.drop(id);
    this.msg = 'Dropped successfully';
    this.err = '';
    this.apply();
  }
}
