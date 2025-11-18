// course.routes.js – Routes for managing course data
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { verifyToken, isAdmin, isAuthenticated } = require('./auth.middleware');

// ---- In-memory course “database” ----
const courses = [
  {
    id: 1,
    code: 'CSCI-201',
    title: 'Data Structures',
    department: 'CSCI',
    instructor: 'Dr. Nguyen',
    instructorEmail: 'instructor@example.com',
    credits: 3,
    room: 'ENGR 201',
    days: 'MWF',
    time: '9:00–9:50 AM',
    maxEnrollment: 30,
    enrolled: 28
  },
  {
    id: 2,
    code: 'MATH-221',
    title: 'Calculus III',
    department: 'MATH',
    instructor: 'Prof. Ortiz',
    instructorEmail: 'instructor@example.com',
    credits: 4,
    room: 'HIBBS 110',
    days: 'TR',
    time: '11:00–12:15 PM',
    maxEnrollment: 25,
    enrolled: 25
  },
  {
    id: 3,
    code: 'STAT-301',
    title: 'Applied Stats',
    department: 'STAT',
    instructor: 'Dr. Patel',
    instructorEmail: 'instructor@example.com',
    credits: 3,
    room: 'BUSN 210',
    days: 'MWF',
    time: '2:00–2:50 PM',
    maxEnrollment: 35,
    enrolled: 10
  }
];

// simple validation used for admin create/update later if you want
const validateCourse = [
  body('courseCode').trim().notEmpty(),
  body('courseName').trim().notEmpty(),
  body('credits').isInt({ min: 1, max: 6 }),
  body('maxEnrollment').optional().isInt({ min: 1 })
];

// GET /api/courses  (public – used for browsing)
router.get('/', (req, res) => {
  res.json(courses);
});

// OPTIONAL: example POST for admins to add a course
router.post(
  '/',
  verifyToken,
  isAdmin,
  validateCourse,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const nextId = courses.length ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    const course = {
      id: nextId,
      code: req.body.courseCode,
      title: req.body.courseName,
      department: req.body.department || 'TBD',
      instructor: req.body.instructor || 'TBD',
      instructorEmail: req.body.instructorEmail || 'instructor@example.com',
      credits: req.body.credits,
      room: req.body.room || 'TBD',
      days: req.body.days || 'TBD',
      time: req.body.time || 'TBD',
      maxEnrollment: req.body.maxEnrollment || 30,
      enrolled: 0
    };

    courses.push(course);
    res.status(201).json(course);
  }
);

module.exports = router;
module.exports.courses = courses; // export array so other routes can reuse it
