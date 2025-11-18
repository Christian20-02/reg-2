// enrollment.routes.js – enroll/drop + views for students / instructors
const express = require('express');
const router = express.Router();
const { verifyToken, isAuthenticated } = require('./auth.middleware');
const { courses } = require('./course.routes');

// In-memory enrollment records: one per (studentEmail, courseId)
const enrollments = [];

// helper
function findCourse(id) {
  return courses.find(c => c.id === Number(id));
}

// POST /api/enrollments
// body: { courseId }
router.post('/', verifyToken, isAuthenticated, (req, res) => {
  const user = req.user; // from auth.middleware
  const { courseId } = req.body;

  if (user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can enroll.' });
  }

  const course = findCourse(courseId);
  if (!course) return res.status(404).json({ message: 'Course not found.' });

  const already = enrollments.find(
    e => e.studentEmail === user.email && e.courseId === course.id
  );
  if (already) {
    return res.status(400).json({ message: 'Already enrolled in this course.' });
  }

  if (course.enrolled >= course.maxEnrollment) {
    return res.status(400).json({ message: 'Course is full.' });
  }

  enrollments.push({ studentEmail: user.email, courseId: course.id });
  course.enrolled++;

  res.json({ message: 'Enrolled successfully.', course });
});

// DELETE /api/enrollments/:courseId  (drop)
router.delete('/:courseId', verifyToken, isAuthenticated, (req, res) => {
  const user = req.user;
  const courseId = Number(req.params.courseId);

  if (user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can drop.' });
  }

  const idx = enrollments.findIndex(
    e => e.studentEmail === user.email && e.courseId === courseId
  );
  if (idx === -1) {
    return res.status(404).json({ message: 'Not enrolled in that course.' });
  }

  enrollments.splice(idx, 1);
  const course = findCourse(courseId);
  if (course && course.enrolled > 0) course.enrolled--;

  res.json({ message: 'Dropped successfully.' });
});

// GET /api/enrollments/me – student schedule
router.get('/me', verifyToken, isAuthenticated, (req, res) => {
  const user = req.user;
  if (user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can view this.' });
  }

  const myCourseIds = enrollments
    .filter(e => e.studentEmail === user.email)
    .map(e => e.courseId);

  const myCourses = courses.filter(c => myCourseIds.includes(c.id));
  res.json(myCourses);
});

// GET /api/enrollments/instructor/sessions – instructor dashboard
router.get('/instructor/sessions', verifyToken, isAuthenticated, (req, res) => {
  const user = req.user;
  if (user.role !== 'instructor') {
    return res.status(403).json({ message: 'Only instructors can view this.' });
  }

  // sessions taught by this instructor
  const mySessions = courses
    .filter(c => c.instructorEmail === user.email)
    .map(c => {
      const enrolledStudents = enrollments
        .filter(e => e.courseId === c.id)
        .map(e => e.studentEmail);

      return {
        ...c,
        enrolledStudents
      };
    });

  res.json(mySessions);
});

module.exports = router;
