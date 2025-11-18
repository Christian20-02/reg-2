// cr-backend/server.js

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./auth.routes');
const courseRoutes = require('./course.routes');
const enrollmentRoutes = require('./enrollment.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// Health check (optional, but useful)
app.get('/', (req, res) => {
  res.send('Course registration backend is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
