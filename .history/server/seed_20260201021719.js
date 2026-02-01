const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedUsers = async () => {
  try {
    await connectDB();

    // Clear existing users
    await User.deleteMany({});

    const users = [
      {
        name: 'Super Admin',
        email: 'superadmin@lms.com',
        password: 'password123',
        role: 'superadmin',
      },
      {
        name: 'Admin User',
        email: 'admin@lms.com',
        password: 'password123',
        role: 'admin',
      },
      {
        name: 'Trainer User',
        email: 'trainer@lms.com',
        password: 'password123',
        role: 'trainer',
      },
      {
        name: 'Learner User',
        email: 'learner@lms.com',
        password: 'password123',
        role: 'learner',
      },
    ];

    const createdUsers = await User.create(users);

    console.log('Seed data created successfully:');
    createdUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedUsers();
