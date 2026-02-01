import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats, getCourses, getMyEnrollments } from '../api';
import { AppLayout, PageHeader } from '../components/layout';
import { Card, Badge, ProgressRing, Skeleton, SkeletonCard } from '../components/ui';
import { cn } from '../lib/utils';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, coursesRes] = await Promise.all([
          getDashboardStats(),
          getCourses(),
        ]);
        setStats(statsRes.data);
        setCourses(coursesRes.data.slice(0, 4));

        if (user?.role === 'learner') {
          const enrollRes = await getMyEnrollments();
          setEnrollments(enrollRes.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.role]);

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title={getGreeting(user?.name)}
        description={getRoleDescription(user?.role)}
      />

      {/* Stats Grid */}
      <div className="mb-8">
        {stats && (
          <>
            {(user?.role === 'admin' || user?.role === 'superadmin') && <AdminStats stats={stats} />}
            {user?.role === 'trainer' && <TrainerStats stats={stats} />}
            {user?.role === 'learner' && <LearnerStats stats={stats} />}
          </>
        )}
      </div>

      {/* Continue Learning / Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {user?.role === 'learner' && enrollments.length > 0 && (
            <Card padding="none">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Continue Learning</h2>
                  <Link to="/my-enrollments" className="text-sm text-indigo-600 hover:text-indigo-700">
                    View all
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {enrollments.map((enrollment) => (
                  <Link
                    key={enrollment._id}
                    to={`/courses/${enrollment.course._id}/learn`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={enrollment.course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&q=80'}
                      alt={enrollment.course.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{enrollment.course.title}</h3>
                      <p className="text-sm text-gray-500">
                        {enrollment.completedLessons?.length || 0} / {countLessons(enrollment.course)} lessons
                      </p>
                    </div>
                    <ProgressRing progress={enrollment.progress || 0} size="sm" />
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Recommended Courses */}
          <Card padding="none">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {user?.role === 'learner' ? 'Recommended for You' : 'Popular Courses'}
                </h2>
                <Link to="/courses" className="text-sm text-indigo-600 hover:text-indigo-700">
                  Browse catalog
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
              {courses.filter(c => c.status === 'published').slice(0, 4).map((course) => (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80'}
                      alt={course.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant={course.level === 'Beginner' ? 'success' : course.level === 'Intermediate' ? 'warning' : 'danger'} size="sm">
                        {course.level || 'Beginner'}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="mt-2 font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500">{course.category || 'General'} • {course.duration || 'Self-paced'}</p>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {getQuickActions(user?.role).map((action, i) => (
                <Link
                  key={i}
                  to={action.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', action.color)}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{action.title}</p>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Recent Activity placeholder */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-sm text-gray-500 mb-4">
              Check our knowledge base for guides and tutorials.
            </p>
            <Link
              to="/knowledge-base"
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
            >
              Browse articles
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

// Helper functions
function getGreeting(name) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return `${greeting}, ${name || 'there'}!`;
}

function getRoleDescription(role) {
  switch (role) {
    case 'superadmin':
    case 'admin':
      return 'Here\'s an overview of your learning platform';
    case 'trainer':
      return 'Manage your courses and track learner progress';
    case 'learner':
      return 'Continue your learning journey';
    default:
      return '';
  }
}

function countLessons(course) {
  return course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
}

function getQuickActions(role) {
  const actions = {
    learner: [
      { title: 'Browse Courses', description: 'Find new courses', href: '/courses', color: 'bg-indigo-100 text-indigo-600', icon: BookIcon },
      { title: 'My Certificates', description: 'View achievements', href: '/certificates', color: 'bg-yellow-100 text-yellow-600', icon: AwardIcon },
      { title: 'Knowledge Base', description: 'Get help', href: '/knowledge-base', color: 'bg-green-100 text-green-600', icon: HelpIcon },
    ],
    trainer: [
      { title: 'Create Course', description: 'Add new content', href: '/admin/courses/new', color: 'bg-indigo-100 text-indigo-600', icon: PlusIcon },
      { title: 'My Courses', description: 'Manage courses', href: '/admin/courses', color: 'bg-teal-100 text-teal-600', icon: BookIcon },
      { title: 'Browse Catalog', description: 'See all courses', href: '/courses', color: 'bg-gray-100 text-gray-600', icon: GridIcon },
    ],
    admin: [
      { title: 'Manage Users', description: 'Add or edit users', href: '/admin/users', color: 'bg-indigo-100 text-indigo-600', icon: UsersIcon },
      { title: 'View Reports', description: 'Analytics dashboard', href: '/admin/reports', color: 'bg-green-100 text-green-600', icon: ChartIcon },
      { title: 'Manage Courses', description: 'All courses', href: '/admin/courses', color: 'bg-teal-100 text-teal-600', icon: BookIcon },
    ],
    superadmin: [
      { title: 'Manage Users', description: 'Add or edit users', href: '/admin/users', color: 'bg-indigo-100 text-indigo-600', icon: UsersIcon },
      { title: 'View Reports', description: 'Analytics dashboard', href: '/admin/reports', color: 'bg-green-100 text-green-600', icon: ChartIcon },
      { title: 'Manage Courses', description: 'All courses', href: '/admin/courses', color: 'bg-teal-100 text-teal-600', icon: BookIcon },
    ],
  };
  return actions[role] || actions.learner;
}

// Stats Components
function AdminStats({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total Users" value={stats.totalUsers} trend={`${stats.activeUsers} active`} icon={UsersIcon} color="bg-indigo-500" />
      <StatCard title="Total Courses" value={stats.totalCourses} trend={`${stats.publishedCourses} published`} icon={BookIcon} color="bg-teal-500" />
      <StatCard title="Enrollments" value={stats.totalEnrollments} trend={`${stats.completedEnrollments} completed`} icon={AcademicIcon} color="bg-purple-500" />
      <StatCard title="Completion Rate" value={`${stats.completionRate}%`} isPercentage icon={ChartIcon} color="bg-green-500" />
    </div>
  );
}

function TrainerStats({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="My Courses" value={stats.myCourses} trend={`${stats.myPublishedCourses} published`} icon={BookIcon} color="bg-indigo-500" />
      <StatCard title="Enrollments" value={stats.enrollmentsInMyCourses} icon={UsersIcon} color="bg-teal-500" />
      <StatCard title="Completed" value={stats.completedInMyCourses} icon={AcademicIcon} color="bg-purple-500" />
      <StatCard title="Avg Completion" value={`${stats.avgCompletion}%`} isPercentage icon={ChartIcon} color="bg-green-500" />
    </div>
  );
}

function LearnerStats({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Enrolled" value={stats.myEnrollments} icon={BookIcon} color="bg-indigo-500" />
      <StatCard title="In Progress" value={stats.inProgressCourses} icon={PlayIcon} color="bg-yellow-500" />
      <StatCard title="Completed" value={stats.completedCourses} icon={CheckIcon} color="bg-green-500" />
      <StatCard title="Progress" value={`${stats.overallProgress}%`} isPercentage icon={ChartIcon} color="bg-purple-500" />
    </div>
  );
}

function StatCard({ title, value, trend, icon: Icon, color, isPercentage }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
        </div>
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-white', color)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}

// Icons
function UsersIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function BookIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function AcademicIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  );
}

function ChartIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function PlayIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function AwardIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function HelpIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function GridIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

export default DashboardPage;
