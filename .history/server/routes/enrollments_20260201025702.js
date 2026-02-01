const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// GET /api/enrollments - My enrollments (learner) or all (admin)
router.get('/', protect, asyncHandler(async (req, res) => {
  let query = {};

  // Non-admins only see their own enrollments
  if (!['admin', 'superadmin'].includes(req.user.role)) {
    query.user = req.user._id;
  }

  const enrollments = await Enrollment.find(query)
    .populate('course', 'title description thumbnail status modules category duration level')
    .populate('user', 'name email')
    .sort({ enrolledAt: -1 });

  // Transform to include progress and completedLessons count
  const enrichedEnrollments = enrollments.map(e => {
    const doc = e.toObject();
    const totalLessons = doc.course?.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
    const completedLessons = doc.progress?.filter(p => p.completed) || [];
    doc.completedLessons = completedLessons;
    doc.progress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;
    return doc;
  });

  res.json(enrichedEnrollments);
}));

// GET /api/enrollments/my - My enrollments only
router.get('/my', protect, asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ user: req.user._id })
    .populate('course', 'title description thumbnail status modules category duration level')
    .sort({ enrolledAt: -1 });

  // Transform to include progress and completedLessons count
  const enrichedEnrollments = enrollments.map(e => {
    const doc = e.toObject();
    const totalLessons = doc.course?.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
    const completedLessons = doc.progress?.filter(p => p.completed) || [];
    doc.completedLessons = completedLessons;
    doc.progress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;
    return doc;
  });

  res.json(enrichedEnrollments);
}));

// POST /api/enrollments - Enroll (self or admin batch)
router.post('/', protect, asyncHandler(async (req, res) => {
  const { courseId, userId } = req.body;

  if (!courseId) {
    return res.status(400).json({ message: 'Course ID is required' });
  }

  // Admins can enroll others, users can only enroll themselves
  const enrollUserId = ['admin', 'superadmin'].includes(req.user.role) && userId 
    ? userId 
    : req.user._id;

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  if (course.status !== 'published') {
    return res.status(400).json({ message: 'Cannot enroll in unpublished course' });
  }

  // Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({
    user: enrollUserId,
    course: courseId,
  });

  if (existingEnrollment) {
    return res.status(400).json({ message: 'Already enrolled in this course' });
  }

  const enrollment = await Enrollment.create({
    user: enrollUserId,
    course: courseId,
  });

  await enrollment.populate('course', 'title description thumbnail');
  await enrollment.populate('user', 'name email');

  res.status(201).json(enrollment);
}));

// PUT /api/enrollments/:id/progress - Mark lesson complete
router.put('/:id/progress', protect, asyncHandler(async (req, res) => {
  const { lessonId } = req.body;

  if (!lessonId) {
    return res.status(400).json({ message: 'Lesson ID is required' });
  }

  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    return res.status(404).json({ message: 'Enrollment not found' });
  }

  // Verify ownership
  if (enrollment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  // Update or add progress
  const progressIndex = enrollment.progress.findIndex(
    p => p.lessonId === lessonId
  );

  if (progressIndex > -1) {
    enrollment.progress[progressIndex].completed = true;
    enrollment.progress[progressIndex].completedAt = new Date();
  } else {
    enrollment.progress.push({
      lessonId,
      completed: true,
      completedAt: new Date(),
    });
  }

  // Check if all lessons are completed
  const course = await Course.findById(enrollment.course);
  const totalLessons = course.modules.reduce(
    (acc, mod) => acc + mod.lessons.length, 0
  );
  const completedLessons = enrollment.progress.filter(p => p.completed).length;

  if (completedLessons >= totalLessons && totalLessons > 0) {
    enrollment.status = 'completed';
    enrollment.completedAt = new Date();
  }

  await enrollment.save();
  await enrollment.populate('course', 'title description thumbnail modules');

  res.json(enrollment);
}));

module.exports = router;
