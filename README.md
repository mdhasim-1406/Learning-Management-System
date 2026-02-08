# LearnHub - Learning Management System

A full-stack Learning Management System with a professional, modern "Warm Sunset" UI built with React, Material-UI, Express, and MongoDB.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-18%2B-green.svg)
![React](https://img.shields.io/badge/react-18.2-blue.svg)
![MUI](https://img.shields.io/badge/MUI-7.3-orange.svg)

## ✨ Features

- **User Management**: Role-based access control (Superadmin, Admin, Trainer, Learner)
- **Course Management**: Create courses with modules and lessons (video, PDF & link content)
- **YouTube Integration**: Seamlessly embed YouTube videos for lessons
- **Smart Progress Tracking**: 
  - Watch videos completely to mark as done
  - Track module progress and overall course completion
- **Enrollment System**: Self-enrollment with instant progress initialization
- **Quiz System**: 6 course-specific quizzes with 10 questions each, auto-evaluation
- **Knowledge Base**: Searchable articles for self-service learning
- **Certificates**: Auto-generated certificates upon course completion
- **Dashboard**: Role-based statistics and analytics
- **Reports**: Admin reports with CSV export

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| [React](https://react.dev/) | 18.2 | UI Library |
| [Vite](https://vitejs.dev/) | 5.0 | Build Tool |
| [Material-UI (MUI)](https://mui.com/) | 7.3 | Component Library |
| [Emotion](https://emotion.sh/) | 11.14 | CSS-in-JS Styling |
| [Tailwind CSS](https://tailwindcss.com/) | 4.0 | Utility CSS |
| [Framer Motion](https://www.framer.com/motion/) | 12.33 | Animations |
| [React Router](https://reactrouter.com/) | 6.21 | Routing |
| [Axios](https://axios-http.com/) | 1.6 | HTTP Client |
| [Three.js](https://threejs.org/) | 0.182 | 3D Effects |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| [Express.js](https://expressjs.com/) | 4.18 | Web Framework |
| [MongoDB](https://www.mongodb.com/) | - | Database |
| [Mongoose](https://mongoosejs.com/) | 8.0 | MongoDB ODM |
| [JWT](https://jwt.io/) | 9.0 | Authentication |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | 2.4 | Password Hashing |

## 🎨 Design System: "Warm Sunset"

### Color Palette
| Role | Color | Hex Code | Description |
|------|-------|----------|-------------|
| Primary | Burnt Orange | `#D84315` | Deep, energetic primary action color |
| Secondary | Warm Amber | `#FF8F00` | Golden accents and highlights |
| Accents | Golden Yellow | `#FFB300` | Bright highlights and gradients |
| Success | Fresh Green | `#43A047` | Completion and success states |
| Background | Warm White | `#FBF8F5` | Soft, paper-like background |

### UI Features
- **Sunset Gradient Sidebar**: Rich gradient from burnt orange to dark brown
- **Glass Effect Header**: Blur backdrop with smooth transitions
- **Animated Cards**: Hover lift effects with warm shadows
- **Gradient Buttons**: Primary action buttons with orange-to-amber gradients
- **Smooth Pill Buttons**: Rounded, pill-shaped buttons for "Mark Complete"

## 📁 Project Structure

```
Learning-Management-System/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── api/                # Axios API calls
│   │   ├── components/
│   │   │   ├── ui-mui/         # MUI wrapper components
│   │   │   ├── ui-next/        # Component re-exports
│   │   │   └── layout/         # App layout components
│   │   ├── pages/              # Route pages
│   │   ├── context/            # React Context (Auth)
│   │   ├── theme/              # MUI theme configuration
│   │   └── lib/                # Utilities & animations
│   └── package.json
├── server/
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express routes
│   ├── middleware/             # Auth & role middleware
│   ├── utils/                  # Helpers
│   ├── config/                 # Database config
│   ├── server.js               # Entry point
│   └── seed.js                 # Demo data seeder
├── scripts/                    # Setup scripts
│   ├── setup.sh                # Linux/macOS setup
│   └── setup.bat               # Windows setup
└── .env                        # Environment variables
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Automated Setup (Recommended)

**Linux / macOS:**
```bash
./scripts/setup.sh
```

**Windows:**
Double-click `scripts/setup.bat` or run:
```cmd
scripts\setup.bat
```

### 2. Manual Setup

If you prefer manual installation:

1.  **Install Backend:**
    ```bash
    cd server && npm install
    ```
2.  **Install Frontend:**
    ```bash
    cd ../client && npm install
    ```
3.  **Configure Env:**
    Create `.env` in root:
    ```env
    MONGO_URI=mongodb://localhost:27017/lms
    JWT_SECRET=your-super-secret-key-change-in-production
    PORT=5000
    ```
4.  **Seed Database:**
    ```bash
    cd server && npm run seed
    ```

### 3. Run Application

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 🔐 Demo Credentials

All accounts use password: `password123`

| Role | Email |
|------|-------|
| Superadmin | superadmin@company.com |
| Admin | admin@company.com |
| Trainer | john.trainer@company.com |
| Learner | alex.learner@company.com |

## 📡 API Endpoints

| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | Auth | Current user |
| GET | /api/users | Admin | List users |
| POST | /api/users | Admin | Create user |
| GET | /api/courses | Auth | List courses |
| POST | /api/courses | Trainer+ | Create course |
| GET | /api/enrollments | Auth | My enrollments |
| POST | /api/enrollments | Auth | Enroll |
| PUT | /api/enrollments/:id/progress | Auth | Mark complete |
| GET | /api/quizzes/courses/:id/quiz | Auth | Get quiz |
| POST | /api/quizzes/:id/attempt | Auth | Submit quiz |
| GET | /api/dashboard/stats | Auth | Dashboard stats |

## 📄 License

MIT License - see LICENSE file for details.