const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// GET /api/courses - List courses
router.get('/', protect, asyncHandler(async (req, res) => {
  let query = {};
  
  // Learners only see published courses
  if (req.user.role === 'learner') {
    query.status = 'published';
  }

  const courses = await Course.find(query)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
  
  res.json(courses);
}));

// GET /api/courses/:id - Course detail
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('createdBy', 'name email');

  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  // Learners can only view published courses
  if (req.user.role === 'learner' && course.status !== 'published') {
    return res.status(404).json({ message: 'Course not found' });
  }

  res.json(course);
}));

// POST /api/courses - Create course (trainer+)
router.post('/', protect, roleCheck('trainer', 'admin', 'superadmin'), asyncHandler(async (req, res) => {
  const { title, description, thumbnail, status, modules } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Please provide title and description' });
  }

  const course = await Course.create({
    title,
    description,
    thumbnail: thumbnail || '',
    status: status || 'draft',
    modules: modules || [],
    createdBy: req.user._id,
  });

  res.status(201).json(course);
}));

// PUT /api/courses/:id - Update course (owner/admin)
router.put('/:id', protect, roleCheck('trainer', 'admin', 'superadmin'), asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  // Check ownership (trainers can only edit their own)
  const isOwner = course.createdBy.toString() === req.user._id.toString();
  const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: 'Not authorized to update this course' });
  }

  const { title, description, thumbnail, status, modules } = req.body;

  if (title) course.title = title;
  if (description) course.description = description;
  if (thumbnail !== undefined) course.thumbnail = thumbnail;
  if (status) course.status = status;
  if (modules) course.modules = modules;

  await course.save();

  res.json(course);
}));

// DELETE /api/courses/:id - Delete course (owner/admin)
router.delete('/:id', protect, roleCheck('trainer', 'admin', 'superadmin'), asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  // Check ownership
  const isOwner = course.createdBy.toString() === req.user._id.toString();
  const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: 'Not authorized to delete this course' });
  }

  await Course.findByIdAndDelete(req.params.id);

  res.json({ message: 'Course deleted' });
}));

module.exports = router;
