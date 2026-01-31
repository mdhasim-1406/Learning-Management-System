const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/auth');

// GET /api/dashboard/stats - Role-based stats
router.get('/stats', protect, asyncHandler(async (req, res) => {
  const { role } = req.user;

  if (role === 'admin' || role === 'superadmin') {
    // Admin stats
    const totalUsers = await User.countDocuments({});
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalCourses = await Course.countDocuments({});
    const publishedCourses = await Course.countDocuments({ status: 'published' });
    const totalEnrollments = await Enrollment.countDocuments({});
    const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });
    
    const completionRate = totalEnrollments > 0 
      ? Math.round((completedEnrollments / totalEnrollments) * 100) 
      : 0;

    return res.json({
      totalUsers,
      activeUsers,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      completedEnrollments,
      completionRate,
    });
  }

  if (role === 'trainer') {
    // Trainer stats
    const myCourses = await Course.countDocuments({ createdBy: req.user._id });
    const myPublishedCourses = await Course.countDocuments({ 
      createdBy: req.user._id, 
      status: 'published' 
    });
    
    const courseIds = await Course.find({ createdBy: req.user._id }).select('_id');
    const enrollmentsInMyCourses = await Enrollment.countDocuments({
      course: { $in: courseIds.map(c => c._id) }
    });
    const completedInMyCourses = await Enrollment.countDocuments({
      course: { $in: courseIds.map(c => c._id) },
      status: 'completed'
    });

    const avgCompletion = enrollmentsInMyCourses > 0 
      ? Math.round((completedInMyCourses / enrollmentsInMyCourses) * 100) 
      : 0;

    return res.json({
      myCourses,
      myPublishedCourses,
      enrollmentsInMyCourses,
      completedInMyCourses,
      avgCompletion,
    });
  }

  // Learner stats
  const myEnrollments = await Enrollment.countDocuments({ user: req.user._id });
  const completedCourses = await Enrollment.countDocuments({ 
    user: req.user._id, 
    status: 'completed' 
  });
  const inProgressCourses = await Enrollment.countDocuments({ 
    user: req.user._id, 
    status: 'in-progress' 
  });

  // Calculate overall progress
  const enrollments = await Enrollment.find({ user: req.user._id }).populate('course');
  let totalLessons = 0;
  let completedLessons = 0;

  enrollments.forEach(enrollment => {
    if (enrollment.course && enrollment.course.modules) {
      enrollment.course.modules.forEach(mod => {
        totalLessons += mod.lessons.length;
      });
      completedLessons += enrollment.progress.filter(p => p.completed).length;
    }
  });

  const overallProgress = totalLessons > 0 
    ? Math.round((completedLessons / totalLessons) * 100) 
    : 0;

  res.json({
    myEnrollments,
    completedCourses,
    inProgressCourses,
    totalLessons,
    completedLessons,
    overallProgress,
  });
}));

module.exports = router;
