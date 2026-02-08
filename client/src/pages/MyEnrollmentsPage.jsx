import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getMyEnrollments } from '../api';
import { AppLayout, PageHeader } from '../components/layout';
import Card from '../components/ui-next/Card';
import Badge from '../components/ui-next/Badge';
import Button from '../components/ui-next/Button';
import ProgressRing from '../components/ui-next/ProgressRing';
import { SkeletonCard } from '../components/ui-next/Skeleton';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, staggerContainer, fadeInUp } from '../lib/animations';

const MyEnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const { data } = await getMyEnrollments();
        setEnrollments(data);
      } catch (error) {
        console.error('Failed to fetch enrollments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter(enrollment => {
      if (filter === 'all') return true;
      if (filter === 'in-progress') return enrollment.progress > 0 && enrollment.progress < 100;
      if (filter === 'completed') return enrollment.progress === 100;
      if (filter === 'not-started') return enrollment.progress === 0;
      return true;
    });
  }, [enrollments, filter]);

  const stats = useMemo(() => {
    return {
      total: enrollments.length,
      inProgress: enrollments.filter(e => e.progress > 0 && e.progress < 100).length,
      completed: enrollments.filter(e => e.progress === 100).length,
      notStarted: enrollments.filter(e => e.progress === 0).length,
    };
  }, [enrollments]);

  if (loading) {
    return (
      <AppLayout>
        <PageHeader title="My Learning" description="Track your enrolled courses" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      </AppLayout>
    );
  }

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
          title="My Learning"
          description={`${enrollments.length} courses enrolled`}
        >
          <Link to="/courses">
            <Button className="bg-emerald-600 hover:bg-emerald-700">Browse More Courses</Button>
          </Link>
        </PageHeader>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Enrolled"
            value={stats.total}
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            color="text-emerald-700"
            activeColor="bg-emerald-50 border-emerald-500"
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            color="text-amber-600"
            active={filter === 'in-progress'}
            onClick={() => setFilter('in-progress')}
            activeColor="bg-amber-50 border-amber-500"
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            color="text-teal-600"
            active={filter === 'completed'}
            onClick={() => setFilter('completed')}
            activeColor="bg-teal-50 border-teal-500"
          />
          <StatCard
            label="Not Started"
            value={stats.notStarted}
            color="text-stone-600"
            active={filter === 'not-started'}
            onClick={() => setFilter('not-started')}
            activeColor="bg-stone-100 border-stone-400"
          />
        </div>

        {/* Enrollments List */}
        <AnimatePresence mode="wait">
          {filteredEnrollments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="text-center py-12">
                <div className="text-6xl mb-4">📖</div>
                <h3 className="text-lg font-medium text-stone-900 mb-2">
                  {enrollments.length === 0 ? "No courses yet" : "No courses in this category"}
                </h3>
                <p className="text-stone-500 mb-4">
                  {enrollments.length === 0
                    ? "Start your learning journey by enrolling in a course"
                    : "Try a different filter"}
                </p>
                {enrollments.length === 0 && (
                  <Link to="/courses">
                    <Button>Browse Courses</Button>
                  </Link>
                )}
              </Card>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-4"
            >
              {filteredEnrollments.map((enrollment) => (
                <motion.div kye={enrollment._id} variants={fadeInUp}>
                  <EnrollmentCard enrollment={enrollment} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AppLayout>
  );
};

function StatCard({ label, value, color = 'text-stone-700', active, onClick, activeColor }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'text-left p-4 rounded-xl border-2 transition-all duration-200',
        active
          ? activeColor
          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
      )}
    >
      <p className={cn('text-2xl font-bold', color)}>{value}</p>
      <p className="text-sm text-stone-500 font-medium">{label}</p>
    </button>
  );
}

function EnrollmentCard({ enrollment }) {
  const course = enrollment.course;
  const lessonCount = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  const completedCount = enrollment.completedLessons?.length || 0;
  const progress = enrollment.progress || 0;

  return (
    <Card padding="none" hover className="overflow-hidden border-stone-200 hover:border-emerald-200 transition-colors">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-48 lg:w-64 flex-shrink-0 relative overflow-hidden group">
          <img
            src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80'}
            alt={course.title}
            className="w-full h-32 md:h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={progress === 100 ? 'success' : progress > 0 ? 'warning' : 'default'} size="sm">
                {progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'}
              </Badge>
              <span className="text-xs text-stone-500 font-medium uppercase tracking-wide">{course.category || 'General'}</span>
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-1 group-hover:text-emerald-700 transition-colors">{course.title}</h3>
            <p className="text-sm text-stone-500 line-clamp-1 mb-3">{course.description}</p>
            <div className="flex items-center gap-4 text-sm text-stone-500 font-medium">
              <span>{completedCount} / {lessonCount} lessons</span>
              <span>{course.duration || 'Self-paced'}</span>
            </div>
          </div>

          {/* Progress and Action */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:block">
              <ProgressRing progress={progress} size="lg" progressColor={progress === 100 ? '#10b981' : '#059669'} trackColor="#e7e5e4" />
            </div>
            <Link to={`/courses/${course._id}/learn`}>
              <Button size="sm" className={cn(
                "min-w-[100px] shadow-sm",
                progress === 100 ? "bg-teal-600 hover:bg-teal-700" : "bg-emerald-600 hover:bg-emerald-700"
              )}>
                {progress === 0 ? 'Start' : progress === 100 ? 'Review' : 'Continue'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default MyEnrollmentsPage;
