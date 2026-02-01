const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// GET /api/articles - Get all published articles (or all for admin)
router.get('/', protect, asyncHandler(async (req, res) => {
  let query = {};
  
  // Non-admins only see published articles
  if (!['admin', 'superadmin'].includes(req.user.role)) {
    query.status = 'published';
  }

  const articles = await Article.find(query)
    .populate('author', 'name')
    .sort({ createdAt: -1 });

  res.json(articles);
}));

// GET /api/articles/:id - Get single article
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id)
    .populate('author', 'name email');

  if (!article) {
    return res.status(404).json({ message: 'Article not found' });
  }

  // Non-admins can only view published articles
  if (article.status !== 'published' && !['admin', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Article not available' });
  }

  res.json(article);
}));

// POST /api/articles - Create article (admin only)
router.post('/', protect, roleCheck(['admin', 'superadmin']), asyncHandler(async (req, res) => {
  const { title, category, tags, content, status } = req.body;

  const article = await Article.create({
    title,
    category,
    tags,
    content,
    status: status || 'draft',
    author: req.user._id,
  });

  await article.populate('author', 'name');

  res.status(201).json(article);
}));

// PUT /api/articles/:id - Update article (admin only)
router.put('/:id', protect, roleCheck(['admin', 'superadmin']), asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return res.status(404).json({ message: 'Article not found' });
  }

  const { title, category, tags, content, status } = req.body;

  article.title = title || article.title;
  article.category = category || article.category;
  article.tags = tags || article.tags;
  article.content = content || article.content;
  article.status = status || article.status;

  await article.save();
  await article.populate('author', 'name');

  res.json(article);
}));

// DELETE /api/articles/:id - Delete article (admin only)
router.delete('/:id', protect, roleCheck(['admin', 'superadmin']), asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return res.status(404).json({ message: 'Article not found' });
  }

  await article.deleteOne();

  res.json({ message: 'Article deleted' });
}));

module.exports = router;
