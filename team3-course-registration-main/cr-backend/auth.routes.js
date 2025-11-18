// auth.routes.js - simple login routes for the demo system
const express = require('express');
const router = express.Router();

// Temporary in-memory users for this assignment
// These match the test accounts in the planning sheet
const users = [
  {
    email: 'student@example.com',
    password: 'password123',
    role: 'student',
    name: 'Student User',
  },
  {
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    name: 'Admin User',
  },
  {
    email: 'instructor@example.com',
    password: 'password123',
    role: 'instructor',
    name: 'Instructor User',
  },
];

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);

  // If no user, or wrong password, send 401
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // For this project we don't need real JWT — just send a dummy token
  const fakeToken = 'dummy-token-' + user.role;

  return res.json({
    token: fakeToken,
    role: user.role,
    name: user.name,
  });
});

module.exports = router;
