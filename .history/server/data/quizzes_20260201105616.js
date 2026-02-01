// Quiz data for each course - mapped by course title
const quizzes = {
  'React Fundamentals': {
    title: 'React Fundamentals Quiz',
    passingScore: 70,
    questions: [
      {
        question: 'What is the correct way to create a React component?',
        options: [
          'function MyComponent() { return <div>Hello</div>; }',
          'class MyComponent { render() { return <div>Hello</div>; } }',
          'const MyComponent = <div>Hello</div>;',
          'React.create(MyComponent, <div>Hello</div>);'
        ],
        correctAnswer: 0,
        points: 10
      },
      {
        question: 'What hook is used to manage state in a functional component?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is the purpose of the useEffect hook?',
        options: [
          'To manage component state',
          'To perform side effects in functional components',
          'To create context providers',
          'To optimize rendering performance'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'How do you pass data from a parent component to a child component?',
        options: ['Using state', 'Using props', 'Using context', 'Using refs'],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is JSX?',
        options: [
          'A JavaScript library',
          'A syntax extension for JavaScript that looks like HTML',
          'A CSS framework',
          'A database query language'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'Which method is used to update state in a class component?',
        options: ['this.updateState()', 'this.setState()', 'this.changeState()', 'this.modifyState()'],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is the Virtual DOM?',
        options: [
          'A physical DOM stored in memory',
          'A lightweight copy of the actual DOM for efficient updates',
          'A browser extension for React',
          'A server-side rendering technique'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is the purpose of keys in React lists?',
        options: [
          'To style list items',
          'To help React identify which items have changed',
          'To encrypt list data',
          'To sort list items'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What does the useContext hook do?',
        options: [
          'Creates a new context',
          'Consumes a context value',
          'Updates context state',
          'Deletes context'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'How do you prevent a component from re-rendering?',
        options: [
          'Use React.memo() or shouldComponentUpdate',
          'Use useEffect',
          'Use useState',
          'Return null from render'
        ],
        correctAnswer: 0,
        points: 10
      }
    ]
  },
  'Node.js Backend Mastery': {
    title: 'Node.js Backend Quiz',
    passingScore: 70,
    questions: [
      {
        question: 'What is Node.js?',
        options: [
          'A frontend JavaScript framework',
          'A JavaScript runtime built on Chrome\'s V8 engine',
          'A database management system',
          'A CSS preprocessor'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'Which module is used to create a web server in Node.js?',
        options: ['fs', 'http', 'path', 'url'],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is Express.js?',
        options: [
          'A database ORM',
          'A minimal web application framework for Node.js',
          'A testing library',
          'A template engine'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is middleware in Express?',
        options: [
          'A database layer',
          'Functions that have access to request and response objects',
          'A caching mechanism',
          'A routing algorithm'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'How do you handle asynchronous operations in Node.js?',
        options: [
          'Using callbacks, Promises, or async/await',
          'Using only synchronous functions',
          'Using threads',
          'Using global variables'
        ],
        correctAnswer: 0,
        points: 10
      },
      {
        question: 'What is the purpose of package.json?',
        options: [
          'To store application data',
          'To define project metadata and dependencies',
          'To configure the database',
          'To define routes'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What does JWT stand for?',
        options: [
          'JavaScript Web Token',
          'JSON Web Token',
          'Java Web Token',
          'JavaScript Web Transfer'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'Which HTTP method is typically used to update a resource?',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        correctAnswer: 2,
        points: 10
      },
      {
        question: 'What is the purpose of the "require" function in Node.js?',
        options: [
          'To define a function',
          'To import modules',
          'To create variables',
          'To start the server'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is npm?',
        options: [
          'Node Package Manager',
          'New Programming Module',
          'Node Project Manager',
          'Network Protocol Module'
        ],
        correctAnswer: 0,
        points: 10
      }
    ]
  },
  'MongoDB for Developers': {
    title: 'MongoDB Quiz',
    passingScore: 70,
    questions: [
      {
        question: 'What type of database is MongoDB?',
        options: ['Relational', 'Document-oriented NoSQL', 'Graph', 'Key-value'],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What format does MongoDB use to store data?',
        options: ['XML', 'BSON (Binary JSON)', 'CSV', 'SQL'],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is a collection in MongoDB?',
        options: [
          'A single document',
          'A group of related documents',
          'A database index',
          'A query result'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'Which method is used to insert a document in MongoDB?',
        options: ['db.collection.add()', 'db.collection.insertOne()', 'db.collection.create()', 'db.collection.push()'],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is the purpose of the _id field in MongoDB?',
        options: [
          'To store the document creation date',
          'To provide a unique identifier for each document',
          'To link documents together',
          'To store user permissions'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is the aggregation framework used for?',
        options: [
          'Creating indexes',
          'Processing data and returning computed results',
          'Backing up databases',
          'Managing users'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is Mongoose?',
        options: [
          'A MongoDB GUI tool',
          'An Object Data Modeling (ODM) library for MongoDB',
          'A MongoDB backup tool',
          'A query optimizer'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'How do you find all documents in a collection?',
        options: [
          'db.collection.findAll()',
          'db.collection.find()',
          'db.collection.getAll()',
          'db.collection.select()'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is an index in MongoDB?',
        options: [
          'A backup file',
          'A data structure that improves query performance',
          'A document field',
          'A collection type'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What operator is used to update a field value in MongoDB?',
        options: ['$update', '$set', '$change', '$modify'],
        correctAnswer: 1,
        points: 10
      }
    ]
  },
  'UI/UX Design Principles': {
    title: 'UI/UX Design Quiz',
    passingScore: 70,
    questions: [
      {
        question: 'What does UX stand for?',
        options: [
          'User Extension',
          'User Experience',
          'Unified Experience',
          'Universal Exchange'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is the primary difference between UI and UX?',
        options: [
          'UI is about visual design, UX is about overall user experience',
          'UI is for mobile, UX is for web',
          'They are the same thing',
          'UI is for developers, UX is for designers'
        ],
        correctAnswer: 0,
        points: 10
      },
      {
        question: 'What is a wireframe?',
        options: [
          'A final design mockup',
          'A basic structural guide showing layout without detailed design',
          'A coding framework',
          'A color palette'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is the 60-30-10 rule in color theory?',
        options: [
          'Screen resolution ratio',
          'A color distribution guideline for visual harmony',
          'Font size ratio',
          'Grid system ratio'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is a user persona?',
        options: [
          'A login profile',
          'A fictional representation of target users',
          'A user authentication method',
          'A design tool'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is visual hierarchy?',
        options: [
          'A file organization system',
          'Arranging elements to show their order of importance',
          'A coding structure',
          'A database schema'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is responsive design?',
        options: [
          'Fast loading websites',
          'Design that adapts to different screen sizes',
          'Interactive animations',
          'Real-time data updates'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is a user journey map?',
        options: [
          'A GPS navigation feature',
          'A visualization of user interactions with a product over time',
          'A website sitemap',
          'A database diagram'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is Fitts\'s Law in UX?',
        options: [
          'A color theory principle',
          'The time to reach a target depends on distance and size',
          'A typography rule',
          'A coding standard'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is white space (negative space) used for in design?',
        options: [
          'To waste screen real estate',
          'To improve readability and focus attention',
          'To hide elements',
          'To reduce loading time'
        ],
        correctAnswer: 1,
        points: 10
      }
    ]
  },
  'DevOps Fundamentals': {
    title: 'DevOps Fundamentals Quiz',
    passingScore: 70,
    questions: [
      {
        question: 'What does DevOps stand for?',
        options: [
          'Developer Optimization',
          'Development and Operations',
          'Device Operations',
          'Developing Operators'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is Docker?',
        options: [
          'A programming language',
          'A containerization platform',
          'A database system',
          'A version control system'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is a Docker container?',
        options: [
          'A virtual machine',
          'A lightweight, standalone executable package',
          'A cloud server',
          'A network protocol'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What does CI/CD stand for?',
        options: [
          'Computer Integration / Computer Delivery',
          'Continuous Integration / Continuous Deployment',
          'Code Inspection / Code Delivery',
          'Central Integration / Central Deployment'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is Kubernetes?',
        options: [
          'A programming language',
          'A container orchestration platform',
          'A database management system',
          'A code editor'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is a Dockerfile?',
        options: [
          'A container log file',
          'A script containing instructions to build a Docker image',
          'A configuration for Docker Compose',
          'A Docker network configuration'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is the purpose of a CI pipeline?',
        options: [
          'To manually deploy code',
          'To automatically build, test, and validate code changes',
          'To write documentation',
          'To manage databases'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is a Pod in Kubernetes?',
        options: [
          'A container image',
          'The smallest deployable unit that can contain one or more containers',
          'A cluster of servers',
          'A network policy'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is Infrastructure as Code (IaC)?',
        options: [
          'Writing application code',
          'Managing infrastructure through code and automation',
          'A coding bootcamp',
          'A hardware configuration'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is the purpose of Docker Compose?',
        options: [
          'To build single containers',
          'To define and run multi-container Docker applications',
          'To monitor container performance',
          'To create Docker images'
        ],
        correctAnswer: 1,
        points: 10
      }
    ]
  },
  'TypeScript Essentials': {
    title: 'TypeScript Essentials Quiz',
    passingScore: 70,
    questions: [
      {
        question: 'What is TypeScript?',
        options: [
          'A new programming language unrelated to JavaScript',
          'A typed superset of JavaScript that compiles to plain JavaScript',
          'A JavaScript testing framework',
          'A CSS preprocessor'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'How do you define a variable with a specific type in TypeScript?',
        options: [
          'let name = string;',
          'let name: string;',
          'let string name;',
          'let name as string;'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is an interface in TypeScript?',
        options: [
          'A way to define object shapes and contracts',
          'A function type',
          'A CSS selector',
          'A database connection'
        ],
        correctAnswer: 0,
        points: 10
      },
      {
        question: 'What is the "any" type in TypeScript?',
        options: [
          'A type that only accepts strings',
          'A type that opts out of type checking',
          'A type for arrays only',
          'A type for functions only'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'How do you make a property optional in an interface?',
        options: [
          'property: optional string;',
          'property?: string;',
          'optional property: string;',
          'property: string | undefined;'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is a union type in TypeScript?',
        options: [
          'A type that combines two objects',
          'A type that can be one of several types',
          'A type for arrays',
          'A type for classes only'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is the purpose of generics in TypeScript?',
        options: [
          'To generate random types',
          'To create reusable components that work with multiple types',
          'To define global variables',
          'To import modules'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What file extension is used for TypeScript files?',
        options: ['.js', '.ts', '.tsx', '.typescript'],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What command compiles TypeScript to JavaScript?',
        options: ['npm run', 'tsc', 'node', 'ts-run'],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'What is the difference between "type" and "interface" in TypeScript?',
        options: [
          'They are exactly the same',
          'Interfaces can be extended, types use intersection; interfaces can be merged',
          'Types are for functions only',
          'Interfaces are deprecated'
        ],
        correctAnswer: 1,
        points: 10
      }
    ]
  }
};

module.exports = quizzes;
