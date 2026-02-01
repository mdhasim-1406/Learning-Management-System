import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getMyEnrollments } from '../api';
import { AppLayout, PageHeader } from '../components/layout';
import { Card, Badge, Button, ProgressRing, SkeletonCard } from '../components/ui';
import { cn } from '../lib/utils';

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
      <PageHeader
        title="My Learning"
        description={`${enrollments.length} courses enrolled`}
      >
        <Link to="/courses">
          <Button>Browse More Courses</Button>
        </Link>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Enrolled"
          value={stats.total}
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          color="text-blue-600"
          active={filter === 'in-progress'}
          onClick={() => setFilter('in-progress')}
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          color="text-green-600"
          active={filter === 'completed'}
          onClick={() => setFilter('completed')}
        />
        <StatCard
          label="Not Started"
          value={stats.notStarted}
          color="text-gray-600"
          active={filter === 'not-started'}
          onClick={() => setFilter('not-started')}
        />
      </div>

      {/* Enrollments List */}
      {filteredEnrollments.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">📖</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {enrollments.length === 0 ? "No courses yet" : "No courses in this category"}
          </h3>
          <p className="text-gray-500 mb-4">
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
      ) : (
        <div className="space-y-4">
          {filteredEnrollments.map((enrollment) => (
            <EnrollmentCard key={enrollment._id} enrollment={enrollment} />
          ))}
        </div>
      )}
    </AppLayout>
  );
};

function StatCard({ label, value, color = 'text-indigo-600', active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'text-left p-4 rounded-xl border-2 transition-colors',
        active
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      )}
    >
      <p className={cn('text-2xl font-bold', color)}>{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </button>
  );
}

function EnrollmentCard({ enrollment }) {
  const course = enrollment.course;
  const lessonCount = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  const completedCount = enrollment.completedLessons?.length || 0;
  const progress = enrollment.progress || 0;

  return (
    <Card padding="none" hover>
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-48 lg:w-64 flex-shrink-0">
          <img
            src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80'}
            alt={course.title}
            className="w-full h-32 md:h-full object-cover"
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={progress === 100 ? 'success' : progress > 0 ? 'info' : 'default'} size="sm">
                {progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'}
              </Badge>
              <span className="text-xs text-gray-500">{course.category || 'General'}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-1 mb-3">{course.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{completedCount} / {lessonCount} lessons</span>
              <span>{course.duration || 'Self-paced'}</span>
            </div>
          </div>
          
          {/* Progress and Action */}
          <div className="flex items-center gap-4">
            <ProgressRing progress={progress} size="lg" color={progress === 100 ? 'green' : 'indigo'} />
            <Link to={`/courses/${course._id}/learn`}>
              <Button size="sm">
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
