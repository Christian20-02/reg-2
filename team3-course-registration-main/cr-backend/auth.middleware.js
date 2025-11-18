// auth.middleware.js - Authentication Middleware
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] ;   

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) { 
            return res.status(401).json({ message: 'Invalid/Expired Token' });
        }

        req.userId = decoded.id;
        next();
    }   );
}

//Check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Require Admin Role' });
    }
}

//Check if user is student
const isStudent = (req, res, next) => {
    if (req.user && req.user.role === 'student') {
        next();
    } else {
        return res.status(403).json({ message: 'Require Student Role' });
    }
}

//Check if user is instructor
const isInstructor = (req, res, next) => {
    if (req.user && req.user.role === 'instructor') {
        next();
    } else {
        return res.status(403).json({ message: 'Require Instructor Role' });
    }
}

//Check if user is authenticated for any role
const isAuthenticated = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(403).json({ message: 'Require Authentication' });
    }
}

module.exports = {
    verifyToken,
    isAdmin,
    isStudent,
    isInstructor,
    isAuthenticated
};