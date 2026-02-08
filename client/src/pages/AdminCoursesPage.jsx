import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses, deleteCourse } from '../api';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui-next/Button';
import Badge from '../components/ui-next/Badge';
import Card, { CardContent } from '../components/ui-next/Card';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '../components/ui-next/Table';
import Modal from '../components/ui-next/Modal';
import Skeleton from '../components/ui-next/Skeleton';
import { cn, formatDate } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, fadeInUp } from '../lib/animations';

// Icons
function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function PencilIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

function TrashIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

const AdminCoursesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await getCourses();
      // Trainers see only their courses, admins see all
      if (user.role === 'trainer') {
        setCourses(data.filter(c => c.createdBy?._id === user._id));
      } else {
        setCourses(data);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await deleteCourse(id);
      fetchCourses();
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <PageHeader title="Manage Courses" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
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
          title="Manage Courses"
          subtitle={user.role === 'trainer' ? 'Manage your created courses' : 'Manage all courses in the system'}
          actions={
            <Link to="/admin/courses/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            </Link>
          }
        />

        {courses.length === 0 ? (
          <Card className="text-center py-16 border-stone-200">
            <BookOpenIcon className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-stone-900 mb-2">No courses yet</h3>
            <p className="text-stone-500 mb-6">Create your first course to get started.</p>
            <Link to="/admin/courses/new">
              <Button variant="outline">Create Course</Button>
            </Link>
          </Card>
        ) : (
          <Card className="border-stone-200 overflow-hidden" padding="none">
            <Table aria-label="Courses table">
              <TableHeader>
                <TableColumn>TITLE</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>MODULES</TableColumn>
                <TableColumn>CREATED BY</TableColumn>
                <TableColumn align="end">ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course._id} className="hover:bg-stone-50 transition-colors">
                    <TableCell>
                      <div className="text-sm font-bold text-stone-900">{course.title}</div>
                      <div className="text-sm text-stone-500 truncate max-w-xs">{course.description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={course.status === 'published' ? 'success' : 'warning'}
                        className="capitalize"
                      >
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-stone-600 font-medium">{course.modules?.length || 0} modules</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-600">
                          {course.createdBy?.name?.charAt(0)}
                        </div>
                        <span className="text-sm text-stone-600">{course.createdBy?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/courses/${course._id}/edit`}>
                          <Button variant="ghost" size="sm" className="hover:bg-emerald-50 hover:text-emerald-700">
                            <PencilIcon className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(course._id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default AdminCoursesPage;
