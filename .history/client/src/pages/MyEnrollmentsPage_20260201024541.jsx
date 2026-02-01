import { useState, useEffect } from 'react';
import { getEnrollments } from '../api';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const MyEnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const { data } = await getEnrollments();
        setEnrollments(data);
      } catch (error) {
        console.error('Failed to fetch enrollments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const calculateProgress = (enrollment) => {
    if (!enrollment.course?.modules) return 0;
    const totalLessons = enrollment.course.modules.reduce(
      (acc, m) => acc + m.lessons.length,
      0
    );
    if (totalLessons === 0) return 0;
    const completedLessons = enrollment.progress?.filter((p) => p.completed).length || 0;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Learning</h1>
        {enrollments.length === 0 ? (
          <EmptyState message="You haven't enrolled in any courses yet" icon="📖" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <CourseCard
                key={enrollment._id}
                course={enrollment.course}
                enrolled={true}
                progress={calculateProgress(enrollment)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEnrollmentsPage;
