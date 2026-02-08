import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourse, getEnrollments, enroll } from '../api';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/ui-next/Button';
import Badge from '../components/ui-next/Badge';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui-next/Card';
import Avatar from '../components/ui-next/Avatar';
import ProgressRing from '../components/ui-next/ProgressRing';
import Skeleton from '../components/ui-next/Skeleton';
import { cn, formatDuration } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, staggerContainer, fadeInUp, cardVariants } from '../lib/animations';

// Icons
function ClockIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function PlayIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function LockIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, enrollmentsRes] = await Promise.all([
          getCourse(id),
          getEnrollments(),
        ]);
        setCourse(courseRes.data);

        const userEnrollment = enrollmentsRes.data.find(
          (e) => e.course?._id === id
        );
        setEnrollment(userEnrollment);

        // Expand all modules by default
        const expanded = {};
        courseRes.data.modules?.forEach((_, idx) => {
          expanded[idx] = true;
        });
        setExpandedModules(expanded);
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

  const toggleModule = (index) => {
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const calculateProgress = () => {
    if (!enrollment || !course || !course.modules) return 0;
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

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  if (!course) return null;

  const progress = calculateProgress();
  const totalLessons = getTotalLessons();
  const completedLessons = getCompletedLessons();

  return (
    <AppLayout>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* Course Hero */}
        <motion.div variants={cardVariants}>
          <Card className="overflow-hidden border-stone-200">
            <div className="relative">
              {course.thumbnail ? (
                <div className="h-48 bg-gradient-to-r from-emerald-600 to-teal-600 relative overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-r from-emerald-600 to-teal-600" />
              )}

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-end justify-between">
                  <div className="text-white relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      {course.category && (
                        <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-md">
                          {course.category}
                        </Badge>
                      )}
                      {course.level && (
                        <Badge variant="outline" className="border-white/40 text-white backdrop-blur-sm">
                          {course.level}
                        </Badge>
                      )}
                    </div>
                    <motion.h1
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-3xl lg:text-4xl font-bold tracking-tight text-shadow-sm"
                    >
                      {course.title}
                    </motion.h1>
                  </div>

                  {enrollment && (
                    <div className="hidden sm:block">
                      <ProgressRing progress={progress} size={80} strokeWidth={6} trackColor="#d1fae5" progressColor="#10b981">
                        <span className="text-lg font-bold text-emerald-400">{progress}%</span>
                      </ProgressRing>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                <div className="flex-1 space-y-6">
                  <p className="text-stone-600 text-lg leading-relaxed">{course.description}</p>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-stone-500 font-medium border-t border-stone-100 pt-6">
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={course.createdBy?.avatar}
                        name={course.createdBy?.name}
                        size="sm"
                      />
                      <span className="text-stone-700">{course.createdBy?.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpenIcon className="w-4 h-4 text-emerald-500" />
                      <span>{course.modules?.length || 0} modules</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <PlayIcon className="w-4 h-4 text-teal-500" />
                      <span>{totalLessons} lessons</span>
                    </div>
                    {course.estimatedHours && (
                      <div className="flex items-center gap-1.5">
                        <ClockIcon className="w-4 h-4 text-amber-500" />
                        <span>{course.estimatedHours} hours</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:w-72 space-y-4">
                  {enrollment ? (
                    <>
                      <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                        <div className="flex justify-between text-sm mb-2 text-emerald-900 font-medium">
                          <span>Progress</span>
                          <span>{completedLessons} / {totalLessons} lessons</span>
                        </div>
                        <div className="w-full bg-emerald-200/50 rounded-full h-2.5 overflow-hidden">
                          <motion.div
                            className="bg-emerald-500 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                      <Link to={`/courses/${id}/learn`} className="block">
                        <Button className="w-full py-6 text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all bg-emerald-600 hover:bg-emerald-700">
                          <PlayIcon className="w-5 h-5 mr-2" />
                          {progress > 0 ? 'Continue Learning' : 'Start Learning'}
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full py-6 text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all bg-emerald-600 hover:bg-emerald-700"
                      size="lg"
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Course Content */}
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          <Card className="border-stone-200">
            <CardHeader className="border-b border-stone-100 pb-4">
              <CardTitle className="text-xl">Course Content</CardTitle>
              <p className="text-sm text-stone-500">
                {course.modules?.length || 0} modules • {totalLessons} lessons
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              {course.modules?.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpenIcon className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                  <p className="text-stone-500">No content available yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {course.modules.map((module, moduleIndex) => {
                    const moduleLessons = module.lessons || [];
                    const progressArray = Array.isArray(enrollment?.progress) ? enrollment.progress : [];
                    const completedInModule = progressArray.filter(
                      (p) => moduleLessons.some((l) => l._id === p.lessonId) && p.completed
                    ).length;

                    return (
                      <motion.div
                        variants={fadeInUp}
                        key={module._id || moduleIndex}
                        className="border border-stone-200 rounded-xl overflow-hidden hover:border-emerald-200 transition-colors"
                      >
                        <button
                          onClick={() => toggleModule(moduleIndex)}
                          className="w-full flex items-center justify-between bg-stone-50/50 px-5 py-4 hover:bg-stone-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold shadow-sm">
                              {moduleIndex + 1}
                            </span>
                            <div className="text-left">
                              <h3 className="font-semibold text-stone-900 text-base">{module.title}</h3>
                              <p className="text-xs text-stone-500 mt-0.5 font-medium">
                                {moduleLessons.length} lessons
                                {enrollment && ` • ${completedInModule}/${moduleLessons.length} completed`}
                              </p>
                            </div>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedModules[moduleIndex] ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {expandedModules[moduleIndex] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="divide-y divide-stone-100 border-t border-stone-100 bg-white">
                                {moduleLessons.map((lesson, lessonIndex) => {
                                  const isCompleted = progressArray.some(
                                    (p) => p.lessonId === lesson._id && p.completed
                                  );
                                  const canAccess = enrollment;

                                  return (
                                    <div
                                      key={lesson._id || lessonIndex}
                                      className={cn(
                                        'flex items-center justify-between px-5 py-3.5 transition-colors',
                                        canAccess ? 'hover:bg-emerald-50/30' : 'opacity-60 bg-stone-50'
                                      )}
                                    >
                                      <div className="flex items-center gap-3">
                                        {isCompleted ? (
                                          <div className="text-emerald-500 bg-emerald-50 rounded-full p-1">
                                            <CheckCircleIcon className="w-5 h-5" />
                                          </div>
                                        ) : canAccess ? (
                                          <div className="text-stone-400 bg-stone-100 rounded-full p-1">
                                            <PlayIcon className="w-5 h-5" />
                                          </div>
                                        ) : (
                                          <div className="text-stone-300">
                                            <LockIcon className="w-5 h-5" />
                                          </div>
                                        )}
                                        <div>
                                          <p className={cn(
                                            "text-sm font-medium",
                                            isCompleted ? "text-emerald-900" : "text-stone-700"
                                          )}>
                                            {lesson.title}
                                          </p>
                                          <p className="text-xs text-stone-500 capitalize">{lesson.type}</p>
                                        </div>
                                      </div>
                                      {lesson.duration && (
                                        <span className="text-xs text-stone-400 font-medium bg-stone-100 px-2 py-1 rounded-full">{lesson.duration} min</span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
};

export default CourseDetailPage;
