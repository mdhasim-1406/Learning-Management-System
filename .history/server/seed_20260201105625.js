const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
const Article = require('./models/Article');
const Quiz = require('./models/Quiz');
const connectDB = require('./config/db');

// Import seed data
const usersData = require('./data/users');
const coursesData = require('./data/courses');
const articlesData = require('./data/articles');
const quizzesData = require('./data/quizzes');

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Article.deleteMany({});
    await Quiz.deleteMany({});

    console.log('Cleared existing data...');

    // Create users with password
    const usersWithPassword = usersData.map(user => ({
      ...user,
      password: 'password123',
    }));

    const createdUsers = await User.create(usersWithPassword);
    console.log(`Created ${createdUsers.length} users`);

    // Get trainers for course assignment
    const trainers = createdUsers.filter(u => u.role === 'trainer');
    const admins = createdUsers.filter(u => u.role === 'admin' || u.role === 'superadmin');

    // Create courses assigned to trainers
    const coursesWithCreator = coursesData.map((course, index) => ({
      ...course,
      createdBy: trainers[index % trainers.length]._id,
    }));

    const createdCourses = await Course.create(coursesWithCreator);
    console.log(`Created ${createdCourses.length} courses`);

    // Create articles assigned to admins
    const articlesWithAuthor = articlesData.map((article, index) => ({
      ...article,
      author: admins[index % admins.length]._id,
    }));

    const createdArticles = await Article.create(articlesWithAuthor);
    console.log(`Created ${createdArticles.length} articles`);

    console.log('\n✓ Seed data created successfully!\n');
    console.log('Login credentials (all use password: password123):');
    console.log('─'.repeat(50));
    
    const roleGroups = {};
    createdUsers.forEach(user => {
      if (!roleGroups[user.role]) roleGroups[user.role] = [];
      roleGroups[user.role].push(user);
    });

    Object.keys(roleGroups).forEach(role => {
      console.log(`\n${role.toUpperCase()}:`);
      roleGroups[role].forEach(user => {
        console.log(`  ${user.email}`);
      });
    });

    console.log('\n');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
