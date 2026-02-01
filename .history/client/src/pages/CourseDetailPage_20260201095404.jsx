import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourse, getEnrollments, enroll } from '../api';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import ProgressRing from '../components/ui/ProgressRing';
import Skeleton from '../components/ui/Skeleton';
import { cn, formatDuration } from '../lib/utils';

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
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Course Hero */}
        <Card className="overflow-hidden">
          <div className="relative">
            {course.thumbnail ? (
              <div className="h-48 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-r from-indigo-600 to-purple-600" />
            )}
            
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-end justify-between">
                <div className="text-white">
                  <div className="flex items-center gap-2 mb-2">
                    {course.category && (
                      <Badge variant="secondary" className="bg-white/20 text-white border-0">
                        {course.category}
                      </Badge>
                    )}
                    {course.level && (
                      <Badge variant="outline" className="border-white/40 text-white">
                        {course.level}
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold">{course.title}</h1>
                </div>
                
                {enrollment && (
                  <ProgressRing progress={progress} size={80} strokeWidth={6}>
                    <span className="text-lg font-bold text-indigo-600">{progress}%</span>
                  </ProgressRing>
                )}
              </div>
            </div>
          </div>
          
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <p className="text-gray-600 mb-4">{course.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={course.createdBy?.avatar}
                      name={course.createdBy?.name}
                      size="sm"
                    />
                    <span>{course.createdBy?.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpenIcon className="w-4 h-4" />
                    <span>{course.modules?.length || 0} modules</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <PlayIcon className="w-4 h-4" />
                    <span>{totalLessons} lessons</span>
                  </div>
                  {course.estimatedHours && (
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{course.estimatedHours} hours</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="lg:w-64 space-y-4">
                {enrollment ? (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{completedLessons} / {totalLessons} lessons</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <Link to={`/courses/${id}/learn`} className="block">
                      <Button className="w-full">
                        <PlayIcon className="w-4 h-4 mr-2" />
                        {progress > 0 ? 'Continue Learning' : 'Start Learning'}
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full"
                    size="lg"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Content */}
        <Card>
          <CardHeader>
            <CardTitle>Course Content</CardTitle>
            <p className="text-sm text-gray-500">
              {course.modules?.length || 0} modules • {totalLessons} lessons
            </p>
          </CardHeader>
          <CardContent>
            {course.modules?.length === 0 ? (
              <div className="text-center py-12">
                <BookOpenIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No content available yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {course.modules.map((module, moduleIndex) => {
                  const moduleLessons = module.lessons || [];
                  const completedInModule = enrollment?.progress?.filter(
                    (p) => moduleLessons.some((l) => l._id === p.lessonId) && p.completed
                  ).length || 0;
                  
                  return (
                    <div key={module._id || moduleIndex} className="border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleModule(moduleIndex)}
                        className="w-full flex items-center justify-between bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-medium">
                            {moduleIndex + 1}
                          </span>
                          <div className="text-left">
                            <h3 className="font-medium text-gray-900">{module.title}</h3>
                            <p className="text-sm text-gray-500">
                              {moduleLessons.length} lessons
                              {enrollment && ` • ${completedInModule}/${moduleLessons.length} completed`}
                            </p>
                          </div>
                        </div>
                        <svg
                          className={cn(
                            'w-5 h-5 text-gray-400 transition-transform',
                            expandedModules[moduleIndex] && 'rotate-180'
                          )}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {expandedModules[moduleIndex] && (
                        <div className="divide-y">
                          {moduleLessons.map((lesson, lessonIndex) => {
                            const isCompleted = enrollment?.progress?.some(
                              (p) => p.lessonId === lesson._id && p.completed
                            );
                            const canAccess = enrollment;
                            
                            return (
                              <div
                                key={lesson._id || lessonIndex}
                                className={cn(
                                  'flex items-center justify-between px-4 py-3',
                                  canAccess ? 'hover:bg-gray-50' : 'opacity-60'
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  {isCompleted ? (
                                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                  ) : canAccess ? (
                                    <PlayIcon className="w-5 h-5 text-gray-400" />
                                  ) : (
                                    <LockIcon className="w-5 h-5 text-gray-400" />
                                  )}
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                                    <p className="text-xs text-gray-500 capitalize">{lesson.type}</p>
                                  </div>
                                </div>
                                {lesson.duration && (
                                  <span className="text-xs text-gray-400">{lesson.duration} min</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CourseDetailPage;
