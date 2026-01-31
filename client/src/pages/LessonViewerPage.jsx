import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourse, getEnrollments, updateProgress } from '../api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

const LessonViewerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, enrollmentsRes] = await Promise.all([
          getCourse(id),
          getEnrollments(),
        ]);
        setCourse(courseRes.data);

        const userEnrollment = enrollmentsRes.data.find((e) => e.course?._id === id);
        if (!userEnrollment) {
          navigate(`/courses/${id}`);
          return;
        }
        setEnrollment(userEnrollment);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const currentModule = course?.modules?.[currentModuleIndex];
  const currentLesson = currentModule?.lessons?.[currentLessonIndex];

  const isLessonCompleted = (lessonId) => {
    return enrollment?.progress?.some((p) => p.lessonId === lessonId && p.completed);
  };

  const handleMarkComplete = async () => {
    if (!currentLesson || isLessonCompleted(currentLesson._id)) return;

    setMarking(true);
    try {
      const { data } = await updateProgress(enrollment._id, currentLesson._id);
      setEnrollment(data);
    } catch (error) {
      console.error('Failed to mark complete:', error);
    } finally {
      setMarking(false);
    }
  };

  const navigateLesson = (direction) => {
    if (direction === 'next') {
      if (currentLessonIndex < currentModule.lessons.length - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1);
      } else if (currentModuleIndex < course.modules.length - 1) {
        setCurrentModuleIndex(currentModuleIndex + 1);
        setCurrentLessonIndex(0);
      }
    } else {
      if (currentLessonIndex > 0) {
        setCurrentLessonIndex(currentLessonIndex - 1);
      } else if (currentModuleIndex > 0) {
        setCurrentModuleIndex(currentModuleIndex - 1);
        setCurrentLessonIndex(course.modules[currentModuleIndex - 1].lessons.length - 1);
      }
    }
  };

  const calculateProgress = () => {
    if (!enrollment || !course) return 0;
    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    if (totalLessons === 0) return 0;
    const completedLessons = enrollment.progress?.filter((p) => p.completed).length || 0;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const renderContent = () => {
    if (!currentLesson) return null;

    switch (currentLesson.type) {
      case 'video':
        // Handle YouTube URLs
        const videoId = currentLesson.content.includes('youtube')
          ? currentLesson.content.split('v=')[1]?.split('&')[0] ||
            currentLesson.content.split('/').pop()
          : null;
        
        if (videoId) {
          return (
            <iframe
              className="w-full aspect-video rounded-lg"
              src={`https://www.youtube.com/embed/${videoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          );
        }
        return (
          <video
            className="w-full rounded-lg"
            controls
            src={currentLesson.content}
          />
        );

      case 'pdf':
        return (
          <iframe
            className="w-full h-[600px] rounded-lg"
            src={currentLesson.content}
          />
        );

      case 'link':
        return (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">External Resource</p>
            <a
              href={currentLesson.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Open Link →
            </a>
          </div>
        );

      default:
        return <p className="text-gray-500">Unsupported content type</p>;
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!course || !enrollment) return null;

  const progress = calculateProgress();
  const hasNext =
    currentLessonIndex < currentModule.lessons.length - 1 ||
    currentModuleIndex < course.modules.length - 1;
  const hasPrev = currentLessonIndex > 0 || currentModuleIndex > 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4 sticky top-4">
              <Link
                to={`/courses/${id}`}
                className="text-sm text-blue-600 hover:text-blue-800 mb-4 block"
              >
                ← Back to Course
              </Link>
              <h2 className="font-semibold text-gray-800 mb-2">{course.title}</h2>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Module list */}
              <div className="space-y-2">
                {course.modules.map((module, mIdx) => (
                  <div key={module._id || mIdx}>
                    <div className="text-sm font-medium text-gray-700 py-1">
                      {module.title}
                    </div>
                    <div className="ml-2 space-y-1">
                      {module.lessons.map((lesson, lIdx) => {
                        const isActive = mIdx === currentModuleIndex && lIdx === currentLessonIndex;
                        const completed = isLessonCompleted(lesson._id);
                        return (
                          <button
                            key={lesson._id || lIdx}
                            onClick={() => {
                              setCurrentModuleIndex(mIdx);
                              setCurrentLessonIndex(lIdx);
                            }}
                            className={`w-full text-left text-sm px-2 py-1 rounded flex items-center ${
                              isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                            }`}
                          >
                            <span className={`mr-2 ${completed ? 'text-green-600' : 'text-gray-400'}`}>
                              {completed ? '✓' : '○'}
                            </span>
                            <span className="truncate">{lesson.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-xl font-bold text-gray-800 mb-4">
                {currentLesson?.title}
              </h1>
              <div className="mb-6">{renderContent()}</div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t">
                <button
                  onClick={() => navigateLesson('prev')}
                  disabled={!hasPrev}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                <button
                  onClick={handleMarkComplete}
                  disabled={marking || isLessonCompleted(currentLesson?._id)}
                  className={`px-6 py-2 rounded-md ${
                    isLessonCompleted(currentLesson?._id)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } disabled:cursor-not-allowed`}
                >
                  {isLessonCompleted(currentLesson?._id)
                    ? '✓ Completed'
                    : marking
                    ? 'Marking...'
                    : 'Mark as Complete'}
                </button>

                <button
                  onClick={() => navigateLesson('next')}
                  disabled={!hasNext}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Quiz Link */}
            {progress === 100 && (
              <div className="bg-white rounded-lg shadow p-6 mt-6 text-center">
                <p className="text-gray-600 mb-4">You've completed all lessons!</p>
                <Link
                  to={`/courses/${id}/quiz`}
                  className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                >
                  Take Quiz
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonViewerPage;
