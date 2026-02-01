// 15 realistic users across all roles
const users = [
  // Super Admin
  {
    email: 'superadmin@company.com',
    name: 'Sarah Mitchell',
    role: 'superadmin',
    department: 'Executive',
    bio: 'Platform administrator overseeing all learning operations.',
    avatar: null,
    isActive: true
  },

  // Admins
  {
    email: 'admin@company.com',
    name: 'Michael Chen',
    role: 'admin',
    department: 'Human Resources',
    bio: 'HR Manager focused on employee development and training programs.',
    avatar: null,
    isActive: true
  },
  {
    email: 'hr@company.com',
    name: 'Jessica Williams',
    role: 'admin',
    department: 'Human Resources',
    bio: 'Learning & Development Specialist with 8 years of experience.',
    avatar: null,
    isActive: true
  },

  // Trainers
  {
    email: 'john.trainer@company.com',
    name: 'John Anderson',
    role: 'trainer',
    department: 'Engineering',
    bio: 'Senior Software Engineer specializing in React and Node.js. 10+ years of teaching experience.',
    avatar: null,
    isActive: true
  },
  {
    email: 'emily.dev@company.com',
    name: 'Emily Rodriguez',
    role: 'trainer',
    department: 'Engineering',
    bio: 'Full-stack developer and technical educator. Passionate about making complex topics accessible.',
    avatar: null,
    isActive: true
  },
  {
    email: 'david.cloud@company.com',
    name: 'David Kim',
    role: 'trainer',
    department: 'DevOps',
    bio: 'Cloud architect with AWS and Azure certifications. Loves teaching infrastructure as code.',
    avatar: null,
    isActive: true
  },

  // Learners
  {
    email: 'alex.learner@company.com',
    name: 'Alex Thompson',
    role: 'learner',
    department: 'Engineering',
    bio: 'Junior developer eager to learn modern web technologies.',
    avatar: null,
    isActive: true
  },
  {
    email: 'sophia.marketing@company.com',
    name: 'Sophia Garcia',
    role: 'learner',
    department: 'Marketing',
    bio: 'Marketing analyst looking to understand technical concepts.',
    avatar: null,
    isActive: true
  },
  {
    email: 'ryan.sales@company.com',
    name: 'Ryan O\'Brien',
    role: 'learner',
    department: 'Sales',
    bio: 'Sales representative expanding technical knowledge for better client communication.',
    avatar: null,
    isActive: true
  },
  {
    email: 'olivia.design@company.com',
    name: 'Olivia Martinez',
    role: 'learner',
    department: 'Design',
    bio: 'UI/UX designer learning frontend development to bridge design and code.',
    avatar: null,
    isActive: true
  },
  {
    email: 'ethan.support@company.com',
    name: 'Ethan Brown',
    role: 'learner',
    department: 'Customer Support',
    bio: 'Support specialist improving technical troubleshooting skills.',
    avatar: null,
    isActive: true
  },
  {
    email: 'ava.finance@company.com',
    name: 'Ava Johnson',
    role: 'learner',
    department: 'Finance',
    bio: 'Financial analyst interested in data visualization and automation.',
    avatar: null,
    isActive: true
  },
  {
    email: 'noah.intern@company.com',
    name: 'Noah Davis',
    role: 'learner',
    department: 'Engineering',
    bio: 'Software engineering intern building foundational skills.',
    avatar: null,
    isActive: true
  },
  {
    email: 'isabella.pm@company.com',
    name: 'Isabella Wilson',
    role: 'learner',
    department: 'Product',
    bio: 'Product manager learning technical concepts to better collaborate with engineering.',
    avatar: null,
    isActive: true
  },
  {
    email: 'liam.qa@company.com',
    name: 'Liam Taylor',
    role: 'learner',
    department: 'Quality Assurance',
    bio: 'QA engineer expanding into test automation and DevOps practices.',
    avatar: null,
    isActive: true
  }
];

module.exports = users;
