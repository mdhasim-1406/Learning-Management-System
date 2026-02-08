import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getCourses } from '../api';
import { AppLayout, PageHeader } from '../components/layout';
import { Card, Badge, Input, Button, SkeletonCard } from '../components/ui-next';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, staggerContainer, cardVariants } from '../lib/animations';

const CourseCatalogPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await getCourses();
        setCourses(data.filter(c => c.status === 'published'));
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(courses.map(c => c.category || 'General'));
    return ['all', ...Array.from(cats)];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [courses, search, selectedCategory, selectedLevel]);

  if (loading) {
    return (
      <AppLayout>
        <PageHeader title="Course Catalog" description="Explore our collection of courses" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
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
          title="Course Catalog"
          description={`${courses.length} courses available`}
        />

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={SearchIcon}
                className="focus:ring-emerald-500 border-stone-200"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-md transform scale-105'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  )}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {['all', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    selectedLevel === level
                      ? 'bg-teal-600 text-white shadow-md transform scale-105'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  )}
                >
                  {level === 'all' ? 'All Levels' : level}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Course Grid */}
        <AnimatePresence mode="wait">
          {filteredCourses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-lg font-medium text-stone-900 mb-2">No courses found</h3>
                <p className="text-stone-500">Try adjusting your filters or search query</p>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AppLayout>
  );
};

function CourseCard({ course }) {
  const lessonCount = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;

  return (
    <motion.div variants={cardVariants} layout>
      <Link to={`/courses/${course._id}`}>
        <Card padding="none" hover className="h-full overflow-hidden group border-stone-200">
          <div className="relative">
            <div className="overflow-hidden">
              <img
                src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'}
                alt={course.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge
                variant={course.level === 'Beginner' ? 'success' : course.level === 'Intermediate' ? 'warning' : 'danger'}
                size="sm"
                className="shadow-sm"
              >
                {course.level || 'Beginner'}
              </Badge>
            </div>
            <div className="absolute top-3 right-3">
              <span className="bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md font-medium">
                {course.duration || 'Self-paced'}
              </span>
            </div>
          </div>
          <div className="p-5">
            <p className="text-xs font-semibold text-emerald-600 mb-2 uppercase tracking-wide">{course.category || 'General'}</p>
            <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-1">
              {course.title}
            </h3>
            <p className="text-sm text-stone-500 mb-4 line-clamp-2">
              {course.description}
            </p>
            <div className="flex items-center justify-between text-sm text-stone-500 pt-4 border-t border-stone-100">
              <span className="flex items-center gap-1.5">
                <ModuleIcon className="w-4 h-4 text-teal-500" />
                {course.modules?.length || 0} modules
              </span>
              <span className="flex items-center gap-1.5">
                <LessonIcon className="w-4 h-4 text-amber-500" />
                {lessonCount} lessons
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

// Icons
function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function ModuleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function LessonIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default CourseCatalogPage;
