import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourse, getEnrollments, enroll } from '../api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, enrollmentsRes] = await Promise.all([
          getCourse(id),
          getEnrollments(),
        ]);
        setCourse(courseRes.data);
        
        // Find if user is enrolled in this course
        const userEnrollment = enrollmentsRes.data.find(
          (e) => e.course?._id === id
        );
        setEnrollment(userEnrollment);
      } catch (error) {
        console.error('Failed to fetch course:', error);
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const { data } = await enroll(id);
      setEnrollment(data);
    } catch (error) {
      console.error('Failed to enroll:', error);
      alert(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const calculateProgress = () => {
    if (!enrollment || !course) return 0;
    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    if (totalLessons === 0) return 0;
    const completedLessons = enrollment.progress?.filter((p) => p.completed).length || 0;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  if (loading) return <LoadingSpinner />;
  if (!course) return null;

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
              <p className="text-gray-600 mt-2">{course.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                By {course.createdBy?.name} • {course.modules?.length || 0} modules
              </p>
            </div>
            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-32 h-24 object-cover rounded"
              />
            )}
          </div>

          {enrollment ? (
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Your Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <Link
                to={`/courses/${id}/learn`}
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Continue Learning
              </Link>
            </div>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {enrolling ? 'Enrolling...' : 'Enroll Now'}
            </button>
          )}
        </div>

        {/* Course Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Course Content</h2>
          {course.modules?.length === 0 ? (
            <p className="text-gray-500">No content available yet.</p>
          ) : (
            <div className="space-y-4">
              {course.modules.map((module, moduleIndex) => (
                <div key={module._id || moduleIndex} className="border rounded-md">
                  <div className="bg-gray-50 px-4 py-3 font-medium">
                    Module {moduleIndex + 1}: {module.title}
                  </div>
                  <div className="divide-y">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const isCompleted = enrollment?.progress?.some(
                        (p) => p.lessonId === lesson._id && p.completed
                      );
                      return (
                        <div
                          key={lesson._id || lessonIndex}
                          className="px-4 py-3 flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <span className={`mr-3 ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                              {isCompleted ? '✓' : '○'}
                            </span>
                            <span className="text-sm">{lesson.title}</span>
                            <span className="text-xs text-gray-400 ml-2">
                              ({lesson.type})
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
