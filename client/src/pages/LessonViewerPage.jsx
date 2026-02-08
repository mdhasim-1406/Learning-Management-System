import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourse, getEnrollments, updateProgress } from '../api';
import Button from '../components/ui-next/Button';
import Card, { CardContent } from '../components/ui-next/Card';
import Badge from '../components/ui-next/Badge';
import Skeleton from '../components/ui-next/Skeleton';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, fadeInUp } from '../lib/animations';

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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
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

  const isLessonCompleted = (lessonId) => {
    const progressArray = Array.isArray(enrollment?.progress) ? enrollment.progress : [];
    return progressArray.some((p) => p.lessonId === lessonId && p.completed);
  };

  const handleMarkComplete = async () => {
    const currentModule = course?.modules?.[currentModuleIndex];
    const currentLesson = currentModule?.lessons?.[currentLessonIndex];
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
    const currentModule = course?.modules?.[currentModuleIndex];
    if (!currentModule || !course?.modules) return;

    if (direction === 'next') {
      if (currentLessonIndex < (currentModule.lessons?.length || 0) - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1);
      } else if (currentModuleIndex < (course.modules?.length || 0) - 1) {
        setCurrentModuleIndex(currentModuleIndex + 1);
        setCurrentLessonIndex(0);
      }
    } else {
      if (currentLessonIndex > 0) {
        setCurrentLessonIndex(currentLessonIndex - 1);
      } else if (currentModuleIndex > 0) {
        const prevModule = course.modules[currentModuleIndex - 1];
        setCurrentModuleIndex(currentModuleIndex - 1);
        setCurrentLessonIndex((prevModule?.lessons?.length || 1) - 1);
      }
    }
  };

  const calculateProgress = () => {
    if (!enrollment || !course?.modules) return 0;
    const totalLessons = course.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
    if (totalLessons === 0) return 0;
    const progressArray = Array.isArray(enrollment.progress) ? enrollment.progress : [];
    const completedLessons = progressArray.filter((p) => p.completed).length;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const getTotalLessons = () => {
    return course?.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  };

  const getCompletedLessons = () => {
    const progressArray = Array.isArray(enrollment?.progress) ? enrollment.progress : [];
    return progressArray.filter((p) => p.completed).length;
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

  const renderContent = (lesson) => {
    if (!lesson) return null;

    switch (lesson.type) {
      case 'video':
        return (
          <div className="space-y-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-orange-900 to-amber-900">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={lesson.content}
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
              <CardContent className="flex items-center gap-4 py-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center flex-shrink-0">
                  <PlayIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-orange-800">Watch Completely to Mark as Done</p>
                  <p className="text-xs text-orange-600">Finish watching the entire video, then click "Mark as Complete" to track your progress.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'pdf':
        return (
          <div className="rounded-xl overflow-hidden border border-stone-200 shadow-sm">
            <iframe className="w-full h-[600px]" src={lesson.content} />
          </div>
        );

      case 'link':
        return (
          <Card className="text-center py-16 border-stone-200">
            <CardContent>
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <LinkIcon className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">External Resource</h3>
              <p className="text-stone-500 mb-6">This lesson contains an external link</p>
              <a
                href={lesson.content}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-amber-500 hover:bg-amber-600">
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
              <DocumentIcon className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500">Unsupported content type</p>
            </CardContent>
          </Card>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex">
        <div className="w-80 bg-white border-r border-stone-100 p-4 hidden lg:block">
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

  // Safety check for empty course
  if (!course.modules || course.modules.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <DocumentIcon className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-stone-900 mb-2">No Content Available</h2>
            <p className="text-stone-500 mb-4">This course doesn't have any lessons yet.</p>
            <Link to={`/courses/${id}`}>
              <Button variant="outline">Back to Course</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentModule = course.modules[currentModuleIndex];
  const currentLesson = currentModule?.lessons?.[currentLessonIndex];

  // Safety check for current selection
  if (!currentModule || !currentLesson) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <DocumentIcon className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-stone-900 mb-2">Lesson Not Found</h2>
            <p className="text-stone-500 mb-4">Unable to load the lesson content.</p>
            <Link to={`/courses/${id}`}>
              <Button variant="outline">Back to Course</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = calculateProgress();
  const totalLessons = getTotalLessons();
  const completedLessons = getCompletedLessons();
  const hasNext =
    currentLessonIndex < (currentModule.lessons?.length || 0) - 1 ||
    currentModuleIndex < (course.modules?.length || 0) - 1;
  const hasPrev = currentLessonIndex > 0 || currentModuleIndex > 0;
  const LessonIcon = getLessonIcon(currentLesson?.type);

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans">
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
          'fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-stone-200 transform transition-transform lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-5 border-b border-stone-100 bg-stone-50/50">
            <div className="flex items-center justify-between mb-4">
              <Link
                to={`/courses/${id}`}
                className="text-sm text-emerald-600 hover:text-emerald-800 flex items-center gap-1 font-medium transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                Back to Course
              </Link>
              <button
                className="lg:hidden text-stone-500 hover:text-stone-700"
                onClick={() => setSidebarOpen(false)}
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <h2 className="font-bold text-stone-900 truncate text-lg">{course.title}</h2>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5 uppercase tracking-wide font-semibold text-stone-500">
                <span>Progress</span>
                <span>{completedLessons}/{totalLessons}</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-1.5">
                <motion.div
                  className="bg-emerald-500 h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Module list */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="space-y-6">
              {course.modules.map((module, mIdx) => (
                <div key={module._id || mIdx}>
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <span className="w-6 h-6 rounded-md bg-stone-100 text-stone-600 flex items-center justify-center text-xs font-bold">
                      {mIdx + 1}
                    </span>
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider truncate">
                      {module.title}
                    </span>
                  </div>
                  <div className="pl-2 space-y-1">
                    {(module.lessons || []).map((lesson, lIdx) => {
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
                            'w-full text-left text-sm px-3 py-2.5 rounded-lg flex items-center gap-2.5 transition-all duration-200 border border-transparent',
                            isActive
                              ? 'bg-emerald-50 text-emerald-800 font-medium border-emerald-100 shadow-sm'
                              : 'text-stone-600 hover:bg-stone-100'
                          )}
                        >
                          {completed ? (
                            <CheckCircleIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          ) : (
                            <LIcon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-emerald-500" : "text-stone-400")} />
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
            <div className="p-4 border-t border-stone-100 bg-emerald-50/50">
              <Link to={`/courses/${id}/quiz`}>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all">
                  <AwardIcon className="w-4 h-4 mr-2" />
                  Take Final Quiz
                </Button>
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen w-full">
        {/* Top bar */}
        <header className="bg-white border-b border-stone-200 px-4 py-3 flex items-center gap-4 lg:px-6 sticky top-0 z-30 shadow-sm">
          <button
            className="lg:hidden text-stone-500 hover:text-stone-700"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <div className="flex-1 flex items-center gap-3 overflow-hidden">
            <Badge variant="outline" className="capitalize bg-stone-50 hidden sm:inline-flex">
              {currentLesson?.type}
            </Badge>
            <h1 className="text-lg font-bold text-stone-900 truncate">
              {currentLesson?.title}
            </h1>
          </div>
          {isLessonCompleted(currentLesson?._id) && (
            <Badge variant="success" className="animate-pulse-soft">
              <CheckCircleIcon className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
        </header>

        {/* Content area */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto bg-stone-50">
          <motion.div
            key={`${currentModuleIndex}-${currentLessonIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            {renderContent(currentLesson)}
          </motion.div>
        </div>

        {/* Bottom navigation */}
        <footer className="bg-white border-t border-stone-200 px-4 py-4 lg:px-6 z-30">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => navigateLesson('prev')}
              disabled={!hasPrev}
              className="border-stone-200 hover:bg-stone-50 text-stone-600"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            <Button
              onClick={handleMarkComplete}
              disabled={marking || isLessonCompleted(currentLesson?._id)}
              className={cn(
                "transition-all duration-300 min-w-[180px] rounded-full px-8 py-3 font-semibold text-white",
                isLessonCompleted(currentLesson?._id)
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30 cursor-default'
                  : 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 active:scale-95'
              )}
            >
              {isLessonCompleted(currentLesson?._id) ? (
                <>
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Completed
                </>
              ) : marking ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Marking...
                </div>
              ) : (
                <>
                  Mark as Complete
                  <CheckCircleIcon className="w-5 h-5 ml-2 opacity-70" />
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => navigateLesson('next')}
              disabled={!hasNext}
              className="border-stone-200 hover:bg-stone-50 text-stone-600"
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
