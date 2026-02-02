# Learning Management System (LMS)

A full-stack Learning Management System built with React, Express, and MongoDB. A complete learning platform with role-based access, course management, progress tracking, and comprehensive quiz system.

## ✨ Features

- **User Management**: Role-based access control (Superadmin, Admin, Trainer, Learner)
- **Course Management**: Create courses with modules and lessons (video & link content)
- **Enrollment System**: Self-enrollment with instant progress initialization
- **Progress Tracking**: Track lesson completion, module progress, and overall course progress
- **Quiz System**: 6 course-specific quizzes with 10 questions each, auto-evaluation, passing scores
- **Knowledge Base**: Searchable articles for self-service learning
- **Certificates**: Auto-generated certificates upon course completion
- **Dashboard**: Role-based statistics and analytics
- **Reports**: Admin reports with CSV export, user activity tracking

## 🛠 Tech Stack

- **Frontend**: React 18, Vite 5.4, Tailwind CSS (@tailwindcss/vite), React Router v6, Axios
- **Backend**: Express.js, MongoDB, Mongoose, JWT Authentication
- **UI Components**: Custom components (Button, Input, Card, Badge, Modal, ProgressRing)
- **Styling**: Tailwind CSS with responsive design
- **Database**: MongoDB with Mongoose ODM

## Project Structure

```
Learning-Management-System/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── api/            # Axios instance + API calls
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level components
│   │   ├── context/        # AuthContext
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routers
│   ├── middleware/         # auth.js, roleCheck.js
│   ├── utils/              # generateToken.js, asyncHandler.js
│   ├── config/             # db.js
│   ├── server.js           # Entry point
│   ├── seed.js             # Seed data script
│   └── package.json
├── .env
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Setup

### 1. Environment Variables

The `.env` file is already created in the root:

```env
MONGO_URI=mongodb://localhost:27017/lms
JWT_SECRET=your-super-secret-key-change-in-production
PORT=5000
```

### 2. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Seed the Database

```bash
cd server
npm run seed
```

This creates:
- **15 demo users** across all roles
- **6 published courses** with complete structure
- **10 knowledge base articles**
- **6 course-specific quizzes** (60 questions total)

#### Demo Login Credentials

All accounts use password: `password123`

**Superadmin:**
- superadmin@company.com

**Admin:**
- admin@company.com
- hr@company.com

**Trainer:**
- john.trainer@company.com
- emily.dev@company.com
- david.cloud@company.com

**Learner:**
- alex.learner@company.com (and 8 others)

### 4. Run the Application

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Endpoints

| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | Auth | Current user |
| GET | /api/users | Admin | List users |
| POST | /api/users | Admin | Create user |
| PUT | /api/users/:id | Admin | Update user |
| DELETE | /api/users/:id | Admin | Soft delete |
| GET | /api/courses | Auth | List courses |
| GET | /api/courses/:id | Auth | Course detail |
| POST | /api/courses | Trainer+ | Create course |
| PUT | /api/courses/:id | Owner/Admin | Update course |
| DELETE | /api/courses/:id | Owner/Admin | Delete course |
| GET | /api/enrollments | Auth | My enrollments |
| POST | /api/enrollments | Auth | Enroll |
| PUT | /api/enrollments/:id/progress | Auth | Mark complete |
| GET | /api/quizzes/courses/:courseId/quiz | Auth | Get quiz |
| POST | /api/quizzes/courses/:courseId/quiz | Trainer+ | Create quiz |
| POST | /api/quizzes/:id/attempt | Auth | Submit quiz |
| GET | /api/dashboard/stats | Auth | Role-based stats |

## Frontend Routes

| Route | Page | Access |
|-------|------|--------|
| /login | LoginPage | Public |
| /dashboard | DashboardPage | All Auth |
| /courses | CourseCatalogPage | All Auth |
| /courses/:id | CourseDetailPage | All Auth |
| /courses/:id/learn | LessonViewerPage | Enrolled |
| /courses/:id/quiz | QuizPage | Enrolled |
| /my-enrollments | MyEnrollmentsPage | Learner |
| /admin/users | AdminUsersPage | Admin+ |
| /admin/courses | AdminCoursesPage | Trainer+ |
| /admin/courses/:id/edit | CourseEditorPage | Trainer+ |
| /admin/reports | AdminReportsPage | Admin |

## User Roles

- **Superadmin**: Full system access
- **Admin**: User management, all courses access, reports
- **Trainer**: Create and manage own courses, create quizzes
- **Learner**: Browse courses, enroll, learn, take quizzes

## Testing Flows

1. **Authentication**: Login with demo credentials
2. **User Management**: Admin creates/manages users
3. **Course CRUD**: Trainer creates course with modules/lessons
4. **Enrollment**: Learner enrolls in published course
5. **Learning**: Watch videos, access resources, mark lessons complete
6. **Quiz**: Take course-specific quiz after learning
7. **Certificate**: View earned certificate upon completion
8. **Dashboard**: View role-specific statistics and analytics
9. **Knowledge Base**: Search and read learning articles
10. **Reports**: Admin views user activity and completion reports

## Recent Updates (Day 2 - Feb 1, 2026)

### Quiz System Implementation
- Added 6 comprehensive course-specific quizzes with 10 questions each
- Each quiz mapped to its course: React, Node.js, MongoDB, UI/UX, DevOps, TypeScript
- Questions cover core concepts from each course
- Passing score threshold of 70%

### Bug Fixes & Improvements
- Fixed `enrollment.progress` filtering errors in LessonViewerPage and CourseDetailPage
- Added `Array.isArray()` safety checks throughout for enrollment progress data
- Fixed NaN errors in ProgressRing component with null/undefined checks
- Improved error handling with graceful fallbacks

### UI/UX Enhancements
- Enhanced CourseDetailPage with module expansion and lesson tracking
- Improved LessonViewerPage with navigation and completion marking
- Fixed import statements for proper component rendering
- Added missing component variants (Button outline, Badge variants)

## Known Issues & Limitations

- Quiz attempts are limited by passing score mechanism
- Certificate auto-generation on completion
- Learner cannot create courses (trainer+ only)
- No course scheduling/deadline features

## Future Enhancements

- Video upload instead of YouTube embedding
- Peer review and feedback system
- Discussion forums
- Certificate sharing to LinkedIn
- Mobile app
- Real-time notifications
- Advanced analytics with skill tracking