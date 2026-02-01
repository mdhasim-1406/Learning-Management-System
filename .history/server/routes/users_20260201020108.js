const express = require('express');
const router = express.Router();
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// GET /api/users - List all users (admin+)
router.get('/', protect, roleCheck('admin', 'superadmin'), asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
}));

// POST /api/users - Create user (admin+)
router.post('/', protect, roleCheck('admin', 'superadmin'), asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Prevent creating superadmin unless you are superadmin
  if (role === 'superadmin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Cannot create superadmin user' });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'learner',
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  });
}));

// PUT /api/users/:id - Update user (admin+)
router.put('/:id', protect, roleCheck('admin', 'superadmin'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Prevent modifying superadmin unless you are superadmin
  if (user.role === 'superadmin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Cannot modify superadmin user' });
  }

  const { name, email, role, isActive } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;
  if (role && (req.user.role === 'superadmin' || role !== 'superadmin')) {
    user.role = role;
  }
  if (typeof isActive === 'boolean') user.isActive = isActive;

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  });
}));

// DELETE /api/users/:id - Soft delete (admin+)
router.delete('/:id', protect, roleCheck('admin', 'superadmin'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Prevent deleting superadmin
  if (user.role === 'superadmin') {
    return res.status(403).json({ message: 'Cannot delete superadmin user' });
  }

  user.isActive = false;
  await user.save();

  res.json({ message: 'User deactivated' });
}));

module.exports = router;
