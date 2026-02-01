import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourse, getEnrollments, updateProgress } from '../api';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import { cn } from '../lib/utils';

// Icons
function ChevronLeftIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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

function PlayIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function DocumentIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function LinkIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function AwardIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
}

function MenuIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function XIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

const LessonViewerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const getTotalLessons = () => {
    return course?.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 0;
  };

  const getCompletedLessons = () => {
    return enrollment?.progress?.filter((p) => p.completed).length || 0;
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video':
        return PlayIcon;
      case 'pdf':
        return DocumentIcon;
      case 'link':
        return LinkIcon;
      default:
        return DocumentIcon;
    }
  };

  const renderContent = () => {
    if (!currentLesson) return null;

    switch (currentLesson.type) {
      case 'video':
        const videoId = currentLesson.content.includes('youtube')
          ? currentLesson.content.split('v=')[1]?.split('&')[0] ||
            currentLesson.content.split('/').pop()
          : null;
        
        if (videoId) {
          return (
            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          );
        }
        return (
          <div className="aspect-video rounded-xl overflow-hidden bg-black">
            <video className="w-full h-full" controls src={currentLesson.content} />
          </div>
        );

      case 'pdf':
        return (
          <div className="rounded-xl overflow-hidden border">
            <iframe className="w-full h-[600px]" src={currentLesson.content} />
          </div>
        );

      case 'link':
        return (
          <Card className="text-center py-16">
            <CardContent>
              <LinkIcon className="w-16 h-16 text-indigo-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">External Resource</h3>
              <p className="text-gray-500 mb-6">This lesson contains an external resource</p>
              <a
                href={currentLesson.content}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button>
                  Open External Link
                  <ChevronRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="text-center py-16">
            <CardContent>
              <DocumentIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Unsupported content type</p>
            </CardContent>
          </Card>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="w-80 bg-white border-r p-4 hidden lg:block">
          <Skeleton className="h-6 w-32 mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-2 w-full mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Skeleton className="h-5 w-40 mb-2" />
                <div className="ml-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="h-8 w-64 mb-6" />
          <Skeleton className="aspect-video rounded-xl" />
        </div>
      </div>
    );
  }

  if (!course || !enrollment) return null;

  const progress = calculateProgress();
  const totalLessons = getTotalLessons();
  const completedLessons = getCompletedLessons();
  const hasNext =
    currentLessonIndex < currentModule.lessons.length - 1 ||
    currentModuleIndex < course.modules.length - 1;
  const hasPrev = currentLessonIndex > 0 || currentModuleIndex > 0;
  const LessonIcon = getLessonIcon(currentLesson?.type);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-80 bg-white border-r transform transition-transform lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <Link
                to={`/courses/${id}`}
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                Back to Course
              </Link>
              <button
                className="lg:hidden text-gray-500 hover:text-gray-700"
                onClick={() => setSidebarOpen(false)}
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <h2 className="font-semibold text-gray-900 truncate">{course.title}</h2>
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">{completedLessons}/{totalLessons}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Module list */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {course.modules.map((module, mIdx) => (
                <div key={module._id || mIdx}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-medium">
                      {mIdx + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {module.title}
                    </span>
                  </div>
                  <div className="ml-3 border-l-2 border-gray-100 pl-4 space-y-1">
                    {module.lessons.map((lesson, lIdx) => {
                      const isActive = mIdx === currentModuleIndex && lIdx === currentLessonIndex;
                      const completed = isLessonCompleted(lesson._id);
                      const LIcon = getLessonIcon(lesson.type);

                      return (
                        <button
                          key={lesson._id || lIdx}
                          onClick={() => {
                            setCurrentModuleIndex(mIdx);
                            setCurrentLessonIndex(lIdx);
                            setSidebarOpen(false);
                          }}
                          className={cn(
                            'w-full text-left text-sm px-3 py-2 rounded-lg flex items-center gap-2 transition-colors',
                            isActive
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          )}
                        >
                          {completed ? (
                            <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <LIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {/* Quiz button */}
          {progress === 100 && (
            <div className="p-4 border-t bg-green-50">
              <Link to={`/courses/${id}/quiz`}>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <AwardIcon className="w-4 h-4 mr-2" />
                  Take Final Quiz
                </Button>
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b px-4 py-3 flex items-center gap-4 lg:px-6">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <div className="flex-1 flex items-center gap-3">
            <Badge variant="outline" className="capitalize">
              {currentLesson?.type}
            </Badge>
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {currentLesson?.title}
            </h1>
          </div>
          {isLessonCompleted(currentLesson?._id) && (
            <Badge variant="success">
              <CheckCircleIcon className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
        </header>

        {/* Content area */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </div>

        {/* Bottom navigation */}
        <footer className="bg-white border-t px-4 py-4 lg:px-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => navigateLesson('prev')}
              disabled={!hasPrev}
            >
              <ChevronLeftIcon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            <Button
              onClick={handleMarkComplete}
              disabled={marking || isLessonCompleted(currentLesson?._id)}
              className={cn(
                isLessonCompleted(currentLesson?._id) && 'bg-green-600 hover:bg-green-600'
              )}
            >
              {isLessonCompleted(currentLesson?._id) ? (
                <>
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Completed
                </>
              ) : marking ? (
                'Marking...'
              ) : (
                'Mark as Complete'
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => navigateLesson('next')}
              disabled={!hasNext}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LessonViewerPage;
