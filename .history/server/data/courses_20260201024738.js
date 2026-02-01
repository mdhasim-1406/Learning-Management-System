// 6 complete courses with real content structure
const courses = [
  {
    title: 'React Fundamentals',
    description: 'Master React from components to hooks. Build real-world applications with modern patterns and best practices.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    category: 'Frontend Development',
    duration: '8 hours',
    level: 'Beginner',
    status: 'published',
    modules: [
      {
        title: 'Getting Started with React',
        order: 0,
        lessons: [
          { title: 'What is React?', type: 'video', content: 'https://www.youtube.com/embed/Tn6-PIqc4UM', duration: '12 min', order: 0 },
          { title: 'Setting Up Your Environment', type: 'video', content: 'https://www.youtube.com/embed/SqcY0GlETPk', duration: '15 min', order: 1 },
          { title: 'Your First React Component', type: 'video', content: 'https://www.youtube.com/embed/JPT3bFIwJYA', duration: '18 min', order: 2 },
          { title: 'Official React Documentation', type: 'link', content: 'https://react.dev', order: 3 }
        ]
      },
      {
        title: 'Components & Props',
        order: 1,
        lessons: [
          { title: 'Understanding Components', type: 'video', content: 'https://www.youtube.com/embed/Y6aYx_KKM7A', duration: '20 min', order: 0 },
          { title: 'Props and Data Flow', type: 'video', content: 'https://www.youtube.com/embed/m7OWXtbiXX8', duration: '22 min', order: 1 },
          { title: 'Component Composition', type: 'video', content: 'https://www.youtube.com/embed/NE_nykvN0D0', duration: '16 min', order: 2 },
          { title: 'Props Best Practices', type: 'link', content: 'https://react.dev/learn/passing-props-to-a-component', order: 3 }
        ]
      },
      {
        title: 'State & Hooks',
        order: 2,
        lessons: [
          { title: 'Introduction to State', type: 'video', content: 'https://www.youtube.com/embed/O6P86uwfdR0', duration: '25 min', order: 0 },
          { title: 'useState Hook Deep Dive', type: 'video', content: 'https://www.youtube.com/embed/4pO-HcG2igk', duration: '20 min', order: 1 },
          { title: 'useEffect and Side Effects', type: 'video', content: 'https://www.youtube.com/embed/0ZJgIjIuY7U', duration: '28 min', order: 2 },
          { title: 'Custom Hooks', type: 'video', content: 'https://www.youtube.com/embed/J-g9ZJha8FE', duration: '22 min', order: 3 },
          { title: 'Hooks API Reference', type: 'link', content: 'https://react.dev/reference/react', order: 4 }
        ]
      },
      {
        title: 'Advanced Patterns',
        order: 3,
        lessons: [
          { title: 'Context API', type: 'video', content: 'https://www.youtube.com/embed/5LrDIWkK_Bc', duration: '24 min', order: 0 },
          { title: 'Performance Optimization', type: 'video', content: 'https://www.youtube.com/embed/b0IZo2Aho9Y', duration: '26 min', order: 1 },
          { title: 'React Router Basics', type: 'video', content: 'https://www.youtube.com/embed/Law7wfdg_ls', duration: '30 min', order: 2 },
          { title: 'Building a Complete App', type: 'video', content: 'https://www.youtube.com/embed/XuFDcZABiDQ', duration: '45 min', order: 3 }
        ]
      }
    ]
  },
  {
    title: 'Node.js Backend Mastery',
    description: 'Build scalable APIs with Node.js and Express. Learn authentication, databases, and deployment strategies.',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80',
    category: 'Backend Development',
    duration: '12 hours',
    level: 'Intermediate',
    status: 'published',
    modules: [
      {
        title: 'Node.js Fundamentals',
        order: 0,
        lessons: [
          { title: 'Introduction to Node.js', type: 'video', content: 'https://www.youtube.com/embed/TlB_eWDSMt4', duration: '30 min', order: 0 },
          { title: 'Modules and NPM', type: 'video', content: 'https://www.youtube.com/embed/oGO_-DWTmKA', duration: '25 min', order: 1 },
          { title: 'Async Programming', type: 'video', content: 'https://www.youtube.com/embed/V_Kr9OSfDeU', duration: '28 min', order: 2 }
        ]
      },
      {
        title: 'Express.js Framework',
        order: 1,
        lessons: [
          { title: 'Getting Started with Express', type: 'video', content: 'https://www.youtube.com/embed/SccSCuHhOw0', duration: '35 min', order: 0 },
          { title: 'Routing and Middleware', type: 'video', content: 'https://www.youtube.com/embed/JlgKybraoy4', duration: '32 min', order: 1 },
          { title: 'Error Handling', type: 'video', content: 'https://www.youtube.com/embed/DyqVqaf1KnA', duration: '20 min', order: 2 },
          { title: 'Express Documentation', type: 'link', content: 'https://expressjs.com/', order: 3 }
        ]
      },
      {
        title: 'REST API Design',
        order: 2,
        lessons: [
          { title: 'RESTful Principles', type: 'video', content: 'https://www.youtube.com/embed/-MTSQjw5DrM', duration: '22 min', order: 0 },
          { title: 'CRUD Operations', type: 'video', content: 'https://www.youtube.com/embed/fgTGADljAeg', duration: '40 min', order: 1 },
          { title: 'API Versioning', type: 'video', content: 'https://www.youtube.com/embed/vguLtmC0oGU', duration: '18 min', order: 2 }
        ]
      },
      {
        title: 'Authentication & Security',
        order: 3,
        lessons: [
          { title: 'JWT Authentication', type: 'video', content: 'https://www.youtube.com/embed/mbsmsi7l3r4', duration: '45 min', order: 0 },
          { title: 'Password Hashing', type: 'video', content: 'https://www.youtube.com/embed/rYdhfm4m7yg', duration: '20 min', order: 1 },
          { title: 'Security Best Practices', type: 'video', content: 'https://www.youtube.com/embed/4Zm5eCVqUgg', duration: '25 min', order: 2 }
        ]
      },
      {
        title: 'Deployment',
        order: 4,
        lessons: [
          { title: 'Preparing for Production', type: 'video', content: 'https://www.youtube.com/embed/oykl1Ih9pMg', duration: '30 min', order: 0 },
          { title: 'Deploying to Cloud', type: 'video', content: 'https://www.youtube.com/embed/l134cBAJCuc', duration: '35 min', order: 1 }
        ]
      }
    ]
  },
  {
    title: 'MongoDB for Developers',
    description: 'Deep dive into MongoDB. From basic CRUD to aggregation pipelines and performance optimization.',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80',
    category: 'Database',
    duration: '6 hours',
    level: 'Intermediate',
    status: 'published',
    modules: [
      {
        title: 'MongoDB Basics',
        order: 0,
        lessons: [
          { title: 'Introduction to MongoDB', type: 'video', content: 'https://www.youtube.com/embed/ExcRbA7fy_A', duration: '20 min', order: 0 },
          { title: 'Installing MongoDB', type: 'video', content: 'https://www.youtube.com/embed/wcx3f0eUiAw', duration: '15 min', order: 1 },
          { title: 'MongoDB Compass', type: 'video', content: 'https://www.youtube.com/embed/YBOiX8DwinE', duration: '18 min', order: 2 }
        ]
      },
      {
        title: 'CRUD Operations',
        order: 1,
        lessons: [
          { title: 'Creating Documents', type: 'video', content: 'https://www.youtube.com/embed/CB9G5dvYf4A', duration: '22 min', order: 0 },
          { title: 'Reading and Querying', type: 'video', content: 'https://www.youtube.com/embed/CJVm3Mf-HbY', duration: '28 min', order: 1 },
          { title: 'Updating Documents', type: 'video', content: 'https://www.youtube.com/embed/I2KUqfHDl8g', duration: '20 min', order: 2 },
          { title: 'Deleting Documents', type: 'video', content: 'https://www.youtube.com/embed/lBBtq3Oawqw', duration: '12 min', order: 3 }
        ]
      },
      {
        title: 'Advanced Queries',
        order: 2,
        lessons: [
          { title: 'Aggregation Framework', type: 'video', content: 'https://www.youtube.com/embed/A3jvoE0jGdE', duration: '35 min', order: 0 },
          { title: 'Indexing Strategies', type: 'video', content: 'https://www.youtube.com/embed/8aGhZQkoFbQ', duration: '25 min', order: 1 },
          { title: 'MongoDB Documentation', type: 'link', content: 'https://docs.mongodb.com/', order: 2 }
        ]
      },
      {
        title: 'Mongoose ODM',
        order: 3,
        lessons: [
          { title: 'Introduction to Mongoose', type: 'video', content: 'https://www.youtube.com/embed/WDrU305J1yw', duration: '30 min', order: 0 },
          { title: 'Schemas and Models', type: 'video', content: 'https://www.youtube.com/embed/DZBGEVgL2eE', duration: '28 min', order: 1 },
          { title: 'Relationships', type: 'video', content: 'https://www.youtube.com/embed/5e1NEdfs4is', duration: '25 min', order: 2 }
        ]
      }
    ]
  },
  {
    title: 'UI/UX Design Principles',
    description: 'Learn design fundamentals that every developer should know. Color theory, typography, and layout.',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    category: 'Design',
    duration: '5 hours',
    level: 'Beginner',
    status: 'published',
    modules: [
      {
        title: 'Design Fundamentals',
        order: 0,
        lessons: [
          { title: 'Principles of Visual Design', type: 'video', content: 'https://www.youtube.com/embed/YqQx75OPRa0', duration: '25 min', order: 0 },
          { title: 'Color Theory Basics', type: 'video', content: 'https://www.youtube.com/embed/_2LLXnUdUIc', duration: '30 min', order: 1 },
          { title: 'Typography Essentials', type: 'video', content: 'https://www.youtube.com/embed/agbh1wbfJt8', duration: '22 min', order: 2 }
        ]
      },
      {
        title: 'User Experience',
        order: 1,
        lessons: [
          { title: 'UX Research Methods', type: 'video', content: 'https://www.youtube.com/embed/v6n7bB2m5MM', duration: '28 min', order: 0 },
          { title: 'User Journey Mapping', type: 'video', content: 'https://www.youtube.com/embed/mSxpVRo3BLg', duration: '20 min', order: 1 },
          { title: 'Wireframing Basics', type: 'video', content: 'https://www.youtube.com/embed/qpH7-KFWZRI', duration: '25 min', order: 2 }
        ]
      },
      {
        title: 'UI Design',
        order: 2,
        lessons: [
          { title: 'Layout and Grid Systems', type: 'video', content: 'https://www.youtube.com/embed/n_V_aLqYPI0', duration: '24 min', order: 0 },
          { title: 'Component Design', type: 'video', content: 'https://www.youtube.com/embed/wIuVvCuiJhU', duration: '30 min', order: 1 },
          { title: 'Responsive Design', type: 'video', content: 'https://www.youtube.com/embed/srvUrASNj0s', duration: '28 min', order: 2 },
          { title: 'Figma Basics', type: 'link', content: 'https://www.figma.com/resources/learn-design/', order: 3 }
        ]
      }
    ]
  },
  {
    title: 'DevOps Fundamentals',
    description: 'CI/CD pipelines, Docker, Kubernetes basics. Ship code with confidence.',
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
    category: 'DevOps',
    duration: '10 hours',
    level: 'Advanced',
    status: 'published',
    modules: [
      {
        title: 'DevOps Culture',
        order: 0,
        lessons: [
          { title: 'What is DevOps?', type: 'video', content: 'https://www.youtube.com/embed/Xrgk023l4lI', duration: '20 min', order: 0 },
          { title: 'DevOps Practices', type: 'video', content: 'https://www.youtube.com/embed/Me3ea4nUt0U', duration: '25 min', order: 1 }
        ]
      },
      {
        title: 'Containerization with Docker',
        order: 1,
        lessons: [
          { title: 'Docker Fundamentals', type: 'video', content: 'https://www.youtube.com/embed/fqMOX6JJhGo', duration: '45 min', order: 0 },
          { title: 'Dockerfile Deep Dive', type: 'video', content: 'https://www.youtube.com/embed/WmcdMiyqfZs', duration: '35 min', order: 1 },
          { title: 'Docker Compose', type: 'video', content: 'https://www.youtube.com/embed/Qw9zlE3t8Ko', duration: '30 min', order: 2 },
          { title: 'Docker Documentation', type: 'link', content: 'https://docs.docker.com/', order: 3 }
        ]
      },
      {
        title: 'CI/CD Pipelines',
        order: 2,
        lessons: [
          { title: 'Introduction to CI/CD', type: 'video', content: 'https://www.youtube.com/embed/scEDHsr3APg', duration: '22 min', order: 0 },
          { title: 'GitHub Actions', type: 'video', content: 'https://www.youtube.com/embed/R8_veQiYBjI', duration: '40 min', order: 1 },
          { title: 'Jenkins Basics', type: 'video', content: 'https://www.youtube.com/embed/FX322RVNGj4', duration: '35 min', order: 2 }
        ]
      },
      {
        title: 'Kubernetes Intro',
        order: 3,
        lessons: [
          { title: 'Kubernetes Concepts', type: 'video', content: 'https://www.youtube.com/embed/PH-2FfFD2PU', duration: '28 min', order: 0 },
          { title: 'Pods and Deployments', type: 'video', content: 'https://www.youtube.com/embed/s_o8dwzRlu4', duration: '35 min', order: 1 },
          { title: 'Services and Networking', type: 'video', content: 'https://www.youtube.com/embed/T4Z7visMM4E', duration: '30 min', order: 2 },
          { title: 'Kubernetes Docs', type: 'link', content: 'https://kubernetes.io/docs/home/', order: 3 }
        ]
      }
    ]
  },
  {
    title: 'TypeScript Essentials',
    description: 'Add type safety to your JavaScript. Draft course - coming soon.',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
    category: 'Frontend Development',
    duration: '7 hours',
    level: 'Intermediate',
    status: 'draft',
    modules: [
      {
        title: 'TypeScript Basics',
        order: 0,
        lessons: [
          { title: 'Why TypeScript?', type: 'video', content: 'https://www.youtube.com/embed/zQnBQ4tB3ZA', duration: '20 min', order: 0 },
          { title: 'Setting Up TypeScript', type: 'video', content: 'https://www.youtube.com/embed/d56mG7DezGs', duration: '18 min', order: 1 }
        ]
      },
      {
        title: 'Types and Interfaces',
        order: 1,
        lessons: [
          { title: 'Basic Types', type: 'video', content: 'https://www.youtube.com/embed/ahCwqrYpIuM', duration: '25 min', order: 0 },
          { title: 'Interfaces vs Types', type: 'video', content: 'https://www.youtube.com/embed/crjIq7LEAYw', duration: '22 min', order: 1 }
        ]
      }
    ]
  }
];

module.exports = courses;
