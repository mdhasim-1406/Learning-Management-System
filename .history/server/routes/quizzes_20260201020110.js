const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Enrollment = require('../models/Enrollment');
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// GET /api/courses/:courseId/quiz - Get quiz for course
router.get('/courses/:courseId/quiz', protect, asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({ course: req.params.courseId });

  if (!quiz) {
    return res.status(404).json({ message: 'No quiz found for this course' });
  }

  // For learners, don't return correct answers
  if (req.user.role === 'learner') {
    const quizData = quiz.toObject();
    quizData.questions = quizData.questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      points: q.points,
    }));
    return res.json(quizData);
  }

  res.json(quiz);
}));

// POST /api/courses/:courseId/quiz - Create quiz (trainer+)
router.post('/courses/:courseId/quiz', protect, roleCheck('trainer', 'admin', 'superadmin'), asyncHandler(async (req, res) => {
  const { title, questions, passingScore } = req.body;

  if (!title || !questions || questions.length === 0) {
    return res.status(400).json({ message: 'Title and questions are required' });
  }

  // Check if quiz already exists
  const existingQuiz = await Quiz.findOne({ course: req.params.courseId });
  if (existingQuiz) {
    return res.status(400).json({ message: 'Quiz already exists for this course. Update instead.' });
  }

  const quiz = await Quiz.create({
    course: req.params.courseId,
    title,
    questions,
    passingScore: passingScore || 70,
    createdBy: req.user._id,
  });

  res.status(201).json(quiz);
}));

// PUT /api/quizzes/:id - Update quiz
router.put('/:id', protect, roleCheck('trainer', 'admin', 'superadmin'), asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    return res.status(404).json({ message: 'Quiz not found' });
  }

  const { title, questions, passingScore } = req.body;

  if (title) quiz.title = title;
  if (questions) quiz.questions = questions;
  if (passingScore) quiz.passingScore = passingScore;

  await quiz.save();
  res.json(quiz);
}));

// POST /api/quizzes/:id/attempt - Submit quiz attempt
router.post('/:id/attempt', protect, asyncHandler(async (req, res) => {
  const { answers } = req.body;

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ message: 'Answers array is required' });
  }

  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    return res.status(404).json({ message: 'Quiz not found' });
  }

  // Check if user is enrolled in the course
  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    course: quiz.course,
  });

  if (!enrollment && req.user.role === 'learner') {
    return res.status(403).json({ message: 'Must be enrolled in course to take quiz' });
  }

  // Calculate score
  let earnedPoints = 0;
  let totalPoints = 0;

  quiz.questions.forEach((question, index) => {
    totalPoints += question.points;
    if (answers[index] === question.correctAnswer) {
      earnedPoints += question.points;
    }
  });

  const scorePercent = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const passed = scorePercent >= quiz.passingScore;

  const attempt = await QuizAttempt.create({
    quiz: quiz._id,
    user: req.user._id,
    answers,
    score: scorePercent,
    passed,
  });

  res.status(201).json({
    _id: attempt._id,
    score: scorePercent,
    passed,
    passingScore: quiz.passingScore,
    earnedPoints,
    totalPoints,
    attemptedAt: attempt.attemptedAt,
  });
}));

// GET /api/quizzes/:id/attempts - Get user's attempts
router.get('/:id/attempts', protect, asyncHandler(async (req, res) => {
  const attempts = await QuizAttempt.find({
    quiz: req.params.id,
    user: req.user._id,
  }).sort({ attemptedAt: -1 });

  res.json(attempts);
}));

module.exports = router;
