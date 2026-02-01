import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  const renderAdminStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Users" value={stats.totalUsers} icon="👥" />
      <StatCard title="Active Users" value={stats.activeUsers} icon="✅" />
      <StatCard title="Total Courses" value={stats.totalCourses} icon="📚" />
      <StatCard title="Published Courses" value={stats.publishedCourses} icon="🌐" />
      <StatCard title="Total Enrollments" value={stats.totalEnrollments} icon="📝" />
      <StatCard title="Completed" value={stats.completedEnrollments} icon="🎓" />
      <StatCard title="Completion Rate" value={`${stats.completionRate}%`} icon="📊" />
    </div>
  );

  const renderTrainerStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard title="My Courses" value={stats.myCourses} icon="📚" />
      <StatCard title="Published" value={stats.myPublishedCourses} icon="🌐" />
      <StatCard title="Total Enrollments" value={stats.enrollmentsInMyCourses} icon="📝" />
      <StatCard title="Completed" value={stats.completedInMyCourses} icon="🎓" />
      <StatCard title="Avg Completion" value={`${stats.avgCompletion}%`} icon="📊" />
    </div>
  );

  const renderLearnerStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard title="Enrolled Courses" value={stats.myEnrollments} icon="📚" />
      <StatCard title="In Progress" value={stats.inProgressCourses} icon="🔄" />
      <StatCard title="Completed" value={stats.completedCourses} icon="🎓" />
      <StatCard title="Lessons Completed" value={`${stats.completedLessons}/${stats.totalLessons}`} icon="📖" />
      <StatCard title="Overall Progress" value={`${stats.overallProgress}%`} icon="📊" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Welcome, {user?.name}!
        </h1>
        {stats && (
          <>
            {(user?.role === 'admin' || user?.role === 'superadmin') && renderAdminStats()}
            {user?.role === 'trainer' && renderTrainerStats()}
            {user?.role === 'learner' && renderLearnerStats()}
          </>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

export default DashboardPage;
