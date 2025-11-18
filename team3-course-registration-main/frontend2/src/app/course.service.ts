import { Injectable } from '@angular/core';

export interface Course {
  id: string;
  code: string;
  title: string;
  department: string;
  instructor: string;
  credits: number;
  capacity: number;
  enrolled: number;
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  private courses: Course[] = [
    {
      id: '1',
      code: 'CSCI-201',
      title: 'Data Structures',
      department: 'CSCI',
      instructor: 'Dr. Nguyen',
      credits: 3,
      capacity: 30,
      enrolled: 28,
    },
    {
      id: '2',
      code: 'MATH-221',
      title: 'Calculus III',
      department: 'MATH',
      instructor: 'Prof. Ortiz',
      credits: 4,
      capacity: 25,
      enrolled: 25,
    },
    {
      id: '3',
      code: 'STAT-301',
      title: 'Applied Stats',
      department: 'STAT',
      instructor: 'Dr. Patel',
      credits: 3,
      capacity: 35,
      enrolled: 10,
    },
  ];

  // ------- existing methods -------

  list(q = '', dept = ''): Course[] {
    const qq = q.toLowerCase();
    return this.courses.filter(
      (c) =>
        (!dept || c.department.toLowerCase() === dept.toLowerCase()) &&
        (!q ||
          c.title.toLowerCase().includes(qq) ||
          c.code.toLowerCase().includes(qq) ||
          c.instructor.toLowerCase().includes(qq))
    );
  }

  // all courses with at least 1 enrolled student
  enrolled(): Course[] {
    return this.courses.filter((c) => c.enrolled > 0);
  }

  enroll(id: string) {
    const c = this.courses.find((x) => x.id === id);
    if (!c) return { ok: false, msg: 'Not found' };
    if (c.enrolled >= c.capacity)
      return { ok: false, msg: 'Course is full' };
    c.enrolled++;
    return { ok: true, msg: 'Enrolled successfully' };
  }

  drop(id: string) {
    const c = this.courses.find((x) => x.id === id);
    if (c && c.enrolled > 0) c.enrolled--;
  }

  add(course: Omit<Course, 'id' | 'enrolled'>) {
    this.courses.push({
      ...course,
      id: crypto.randomUUID(),
      enrolled: 0,
    });
  }

  remove(id: string) {
    this.courses = this.courses.filter((c) => c.id !== id);
  }

  // ------- NEW methods for Dashboard / Instructor view -------

  /**
   * Used by the student "My Schedule" view.
   * Right now, we treat any course with enrolled > 0 as on the student's schedule.
   */
  getMySchedule(): Course[] {
    return this.courses.filter((c) => c.enrolled > 0);
  }

  /**
   * Used by the instructor dashboard.
   * For Sprint 2 we just return all courses and attach a fake roster
   * so the UI can show "enrolled students".
   */
  getInstructorSessions(): (Course & { enrolledStudents: string[] })[] {
    const fakeRoster = [
      'student1@example.com',
      'student2@example.com',
      'student3@example.com',
    ];

    return this.courses.map((c) => ({
      ...c,
      enrolledStudents: fakeRoster,
    }));
  }
}
