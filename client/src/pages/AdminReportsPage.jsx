import { useState, useEffect } from 'react';
import { getUsers, getEnrollments, getCourses } from '../api';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui-next/Button';
import Badge from '../components/ui-next/Badge';
import Avatar from '../components/ui-next/Avatar';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui-next/Card';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '../components/ui-next/Table';
import Skeleton from '../components/ui-next/Skeleton';
import { cn, formatDate } from '../lib/utils';
import { motion } from 'framer-motion';
import { pageVariants, staggerContainer, fadeInUp } from '../lib/animations';

// Icons
function DownloadIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function UsersIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function BookOpenIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function TrendingUpIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function CheckCircleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ChartBarIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function ExclamationCircleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

const AdminReportsPage = () => {
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, enrollmentsRes, coursesRes] = await Promise.all([
        getUsers(),
        getEnrollments(),
        getCourses(),
      ]);
      setUsers(usersRes.data);
      setEnrollments(enrollmentsRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load report data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getEnrollmentsByUser = () => {
    let filtered = enrollments;
    if (selectedCourse) {
      filtered = enrollments.filter((e) => e.course?._id === selectedCourse);
    }
    return filtered;
  };

  const calculateProgress = (enrollment) => {
    // Handle case where progress is already a number (percentage)
    if (typeof enrollment.progress === 'number') {
      return Math.round(enrollment.progress);
    }
    // Handle case where progress is not an array
    if (!Array.isArray(enrollment.progress)) {
      return 0;
    }
    if (!enrollment.course?.modules) return 0;
    const totalLessons = enrollment.course.modules.reduce(
      (acc, m) => acc + (m.lessons?.length || 0),
      0
    );
    if (totalLessons === 0) return 0;
    const completedLessons = enrollment.progress.filter((p) => p.completed).length || 0;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const exportCSV = () => {
    const data = getEnrollmentsByUser().map((e) => ({
      User: e.user?.name,
      Email: e.user?.email,
      Course: e.course?.title,
      Progress: `${calculateProgress(e)}%`,
      Status: e.status,
      EnrolledAt: new Date(e.enrolledAt).toLocaleDateString(),
    }));

    if (data.length === 0) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((row) => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enrollment-report.csv';
    a.click();
  };

  if (loading) {
    return (
      <AppLayout>
        <PageHeader title="Reports & Analytics" />
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <ExclamationCircleIcon className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Something went wrong</h2>
          <p className="text-stone-500 mb-6 max-w-md">{error}</p>
          <Button onClick={fetchData} className="bg-emerald-600 hover:bg-emerald-700">
            Try Again
          </Button>
        </div>
      </AppLayout>
    );
  }

  const filteredEnrollments = getEnrollmentsByUser();
  const completedEnrollments = enrollments.filter((e) => e.status === 'completed').length;
  const avgProgress =
    enrollments.length > 0
      ? Math.round(
        enrollments.reduce((acc, e) => acc + calculateProgress(e), 0) / enrollments.length
      )
      : 0;

  // Course completion stats
  const courseStats = courses.map((course) => {
    const courseEnrollments = enrollments.filter((e) => e.course?._id === course._id);
    const completed = courseEnrollments.filter((e) => e.status === 'completed').length;
    return {
      ...course,
      enrollments: courseEnrollments.length,
      completed,
      completionRate: courseEnrollments.length > 0
        ? Math.round((completed / courseEnrollments.length) * 100)
        : 0,
    };
  }).sort((a, b) => b.enrollments - a.enrollments);

  return (
    <AppLayout>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-6"
      >
        <PageHeader
          title="Reports & Analytics"
          subtitle="Track learner progress and course performance"
          actions={
            <Button
              onClick={exportCSV}
              disabled={filteredEnrollments.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <DownloadIcon className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          }
        />

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={UsersIcon}
            label="Total Users"
            value={users.length}
            color="text-emerald-600"
            bgColor="bg-emerald-100"
          />
          <StatCard
            icon={BookOpenIcon}
            label="Enrollments"
            value={enrollments.length}
            color="text-teal-600"
            bgColor="bg-teal-100"
          />
          <StatCard
            icon={CheckCircleIcon}
            label="Completed"
            value={completedEnrollments}
            color="text-amber-600"
            bgColor="bg-amber-100"
          />
          <StatCard
            icon={TrendingUpIcon}
            label="Avg. Progress"
            value={`${avgProgress}%`}
            color="text-stone-600"
            bgColor="bg-stone-200"
          />
        </div>

        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Course Performance */}
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <Card className="h-full border-stone-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-stone-800">
                  <ChartBarIcon className="w-5 h-5 text-stone-400" />
                  Course Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {courseStats.slice(0, 5).map((course) => (
                    <div key={course._id} className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-stone-900 truncate">{course.title}</p>
                        <p className="text-xs text-stone-500 font-medium">
                          {course.enrollments} enrollments • {course.completed} completed
                        </p>
                      </div>
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-stone-500 font-medium">Completion</span>
                          <span className="font-bold text-stone-700">{course.completionRate}%</span>
                        </div>
                        <div className="w-full bg-stone-100 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.completionRate}%` }}
                            transition={{ duration: 1 }}
                            className={cn(
                              'h-2 rounded-full transition-all',
                              course.completionRate >= 70 ? 'bg-emerald-500' :
                                course.completionRate >= 40 ? 'bg-amber-500' : 'bg-red-500'
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {courseStats.length === 0 && (
                    <p className="text-center text-stone-500 py-8 italic">No course data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={fadeInUp}>
            <Card className="h-full border-stone-200">
              <CardHeader>
                <CardTitle className="text-stone-800">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <QuickStatRow label="Active Courses" value={courses.filter((c) => c.status === 'published').length} />
                  <QuickStatRow label="Draft Courses" value={courses.filter((c) => c.status === 'draft').length} />
                  <QuickStatRow label="Active Learners" value={users.filter((u) => u.role === 'learner' && u.isActive).length} />
                  <QuickStatRow label="Trainers" value={users.filter((u) => u.role === 'trainer').length} />
                  <QuickStatRow label="In Progress" value={enrollments.filter((e) => e.status === 'in_progress').length} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Enrollment Details */}
        <motion.div variants={fadeInUp}>
          <Card className="border-stone-200 overflow-hidden" padding="none">
            <CardHeader className="bg-stone-50/50 border-b border-stone-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-stone-800">Enrollment Details</CardTitle>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
                >
                  <option value="">All Courses</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <Table aria-label="Enrollment details table">
              <TableHeader>
                <TableColumn>LEARNER</TableColumn>
                <TableColumn>COURSE</TableColumn>
                <TableColumn>PROGRESS</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>ENROLLED</TableColumn>
              </TableHeader>
              <TableBody emptyContent={<div className="text-center py-16"><BookOpenIcon className="w-12 h-12 text-stone-300 mx-auto mb-4" /><p className="text-stone-500 font-medium">No enrollments found for the selected filter.</p></div>}>
                {filteredEnrollments.map((enrollment) => {
                  const progress = calculateProgress(enrollment);
                  return (
                    <TableRow key={enrollment._id} className="hover:bg-stone-50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={enrollment.user?.avatar}
                            name={enrollment.user?.name}
                            size="sm"
                          />
                          <div>
                            <p className="text-sm font-semibold text-stone-900">
                              {enrollment.user?.name}
                            </p>
                            <p className="text-xs text-stone-500">{enrollment.user?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-stone-800 font-medium">{enrollment.course?.title}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-stone-100 rounded-full h-2">
                            <div
                              className={cn(
                                'h-2 rounded-full transition-all',
                                progress === 100 ? 'bg-emerald-500' :
                                  progress >= 50 ? 'bg-teal-500' : 'bg-amber-500'
                              )}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-stone-600 w-10">{progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            enrollment.status === 'completed' ? 'success' :
                              enrollment.status === 'in_progress' ? 'warning' : 'outline'
                          }
                          className="capitalize"
                        >
                          {enrollment.status?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-stone-500">
                          {formatDate(enrollment.enrolledAt)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
};

function StatCard({ icon: Icon, label, value, color, bgColor }) {
  return (
    <Card className="border-stone-200 hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", bgColor)}>
            <Icon className={cn("w-5 h-5", color)} />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-500">{label}</p>
            <p className="text-2xl font-bold text-stone-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function QuickStatRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-1 hover:bg-stone-50 px-2 rounded-md transition-colors">
      <span className="text-sm text-stone-600 font-medium">{label}</span>
      <span className="font-bold text-stone-800">{value}</span>
    </div>
  )
}

export default AdminReportsPage;
