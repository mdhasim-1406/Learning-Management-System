import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CourseCatalogPage from './pages/CourseCatalogPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonViewerPage from './pages/LessonViewerPage';
import QuizPage from './pages/QuizPage';
import MyEnrollmentsPage from './pages/MyEnrollmentsPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import CertificatesPage from './pages/CertificatesPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
import CourseEditorPage from './pages/CourseEditorPage';
import AdminReportsPage from './pages/AdminReportsPage';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected - All authenticated users */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <CourseCatalogPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:id"
        element={
          <ProtectedRoute>
            <CourseDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:id/learn"
        element={
          <ProtectedRoute>
            <LessonViewerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:id/quiz"
        element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        }
      />

      {/* Learner */}
      <Route
        path="/my-enrollments"
        element={
          <ProtectedRoute roles={['learner']}>
            <MyEnrollmentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/knowledge-base"
        element={
          <ProtectedRoute>
            <KnowledgeBasePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/certificates"
        element={
          <ProtectedRoute>
            <CertificatesPage />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={['admin', 'superadmin']}>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute roles={['admin', 'superadmin']}>
            <AdminReportsPage />
          </ProtectedRoute>
        }
      />

      {/* Trainer+ */}
      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute roles={['trainer', 'admin', 'superadmin']}>
            <AdminCoursesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses/new"
        element={
          <ProtectedRoute roles={['trainer', 'admin', 'superadmin']}>
            <CourseEditorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses/:id/edit"
        element={
          <ProtectedRoute roles={['trainer', 'admin', 'superadmin']}>
            <CourseEditorPage />
          </ProtectedRoute>
        }
      />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
