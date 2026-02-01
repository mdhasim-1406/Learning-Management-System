const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/auth');

// GET /api/certificates/my - Get my certificates
router.get('/my', protect, asyncHandler(async (req, res) => {
  const certificates = await Certificate.find({ user: req.user._id })
    .populate('course', 'title description thumbnail category duration level')
    .sort({ issuedAt: -1 });

  res.json(certificates);
}));

// GET /api/certificates/:id - Get certificate by ID
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const certificate = await Certificate.findById(req.params.id)
    .populate('user', 'name email')
    .populate('course', 'title description thumbnail category');

  if (!certificate) {
    return res.status(404).json({ message: 'Certificate not found' });
  }

  res.json(certificate);
}));

// GET /api/certificates/verify/:number - Verify certificate by number
router.get('/verify/:number', asyncHandler(async (req, res) => {
  const certificate = await Certificate.findOne({ certificateNumber: req.params.number })
    .populate('user', 'name')
    .populate('course', 'title');

  if (!certificate) {
    return res.status(404).json({ message: 'Certificate not found', valid: false });
  }

  res.json({
    valid: true,
    certificateNumber: certificate.certificateNumber,
    userName: certificate.user.name,
    courseTitle: certificate.course.title,
    issuedAt: certificate.issuedAt,
  });
}));

// POST /api/certificates/issue/:enrollmentId - Issue certificate (auto on completion)
router.post('/issue/:enrollmentId', protect, asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.enrollmentId)
    .populate('course');

  if (!enrollment) {
    return res.status(404).json({ message: 'Enrollment not found' });
  }

  // Check ownership
  if (enrollment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  // Check if completed
  if (enrollment.status !== 'completed') {
    return res.status(400).json({ message: 'Course not completed yet' });
  }

  // Check if certificate already exists
  const existingCert = await Certificate.findOne({ enrollment: enrollment._id });
  if (existingCert) {
    return res.json(existingCert);
  }

  // Create certificate
  const certificate = await Certificate.create({
    user: req.user._id,
    course: enrollment.course._id,
    enrollment: enrollment._id,
  });

  await certificate.populate('course', 'title description thumbnail category');

  res.status(201).json(certificate);
}));

module.exports = router;
