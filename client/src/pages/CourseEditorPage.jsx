import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourse, createCourse, updateCourse } from '../api';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui-next/Button';
import Input from '../components/ui-next/Input';
import Card, { CardContent, CardHeader } from '../components/ui-next/Card';
import Skeleton from '../components/ui-next/Skeleton';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { pageVariants, fadeInUp } from '../lib/animations';

// Icons
function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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

const CourseEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    status: 'draft',
    modules: [],
  });

  useEffect(() => {
    if (isEditing) {
      const fetchCourse = async () => {
        try {
          const { data } = await getCourse(id);
          setFormData({
            title: data.title,
            description: data.description,
            thumbnail: data.thumbnail || '',
            status: data.status,
            modules: data.modules || [],
          });
        } catch (error) {
          console.error('Failed to fetch course:', error);
          navigate('/admin/courses');
        } finally {
          setLoading(false);
        }
      };
      fetchCourse();
    }
  }, [id, isEditing, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (isEditing) {
        await updateCourse(id, formData);
      } else {
        await createCourse(formData);
      }
      navigate('/admin/courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const addModule = () => {
    setFormData({
      ...formData,
      modules: [
        ...formData.modules,
        { title: '', order: formData.modules.length, lessons: [] },
      ],
    });
  };

  const updateModule = (index, field, value) => {
    const newModules = [...formData.modules];
    newModules[index][field] = value;
    setFormData({ ...formData, modules: newModules });
  };

  const removeModule = (index) => {
    const newModules = formData.modules.filter((_, i) => i !== index);
    setFormData({ ...formData, modules: newModules });
  };

  const addLesson = (moduleIndex) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].lessons.push({
      title: '',
      type: 'video',
      content: '',
      order: newModules[moduleIndex].lessons.length,
    });
    setFormData({ ...formData, modules: newModules });
  };

  const updateLesson = (moduleIndex, lessonIndex, field, value) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].lessons[lessonIndex][field] = value;
    setFormData({ ...formData, modules: newModules });
  };

  const removeLesson = (moduleIndex, lessonIndex) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].lessons = newModules[moduleIndex].lessons.filter(
      (_, i) => i !== lessonIndex
    );
    setFormData({ ...formData, modules: newModules });
  };

  if (loading) {
    return (
      <AppLayout>
        <PageHeader title="Loading..." />
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
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
          title={isEditing ? 'Edit Course' : 'Create Course'}
          subtitle={isEditing ? 'Update course details and curriculum' : 'Build a new learning experience'}
        />

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-3 border border-red-100">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Details */}
          <Card variant="luxury" className="border-stone-200">
            <CardHeader>
              <h2 className="text-lg font-bold text-stone-900">Course Details</h2>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Title</label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Introduction to Python"
                  required
                  variant="bordered"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 hover:bg-stone-50 resize-none"
                  rows="4"
                  placeholder="Describe what learners will achieve..."
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Thumbnail URL</label>
                  <Input
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://..."
                    variant="bordered"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 hover:bg-stone-50"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modules */}
          <Card variant="luxury" className="border-stone-200">
            <CardHeader>
              <div className="flex justify-between items-center w-full">
                <h2 className="text-lg font-bold text-stone-900">Curriculum</h2>
                <Button
                  type="button"
                  onClick={addModule}
                  variant="ghost"
                  size="sm"
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Add Module
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {formData.modules.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-stone-200 rounded-xl">
                  <p className="text-stone-500 mb-4">No modules yet. Start building your curriculum!</p>
                  <Button type="button" onClick={addModule} variant="outline">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add First Module
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.modules.map((module, moduleIndex) => (
                    <motion.div
                      key={moduleIndex}
                      variants={fadeInUp}
                      className="border border-stone-200 rounded-xl p-4 bg-stone-50/50"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-sm flex items-center justify-center">
                            {moduleIndex + 1}
                          </span>
                          <input
                            type="text"
                            value={module.title}
                            onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                            placeholder="Module Title"
                            className="flex-1 px-3 py-2 border border-stone-200 rounded-lg bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-medium"
                            required
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={() => removeModule(moduleIndex)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Lessons */}
                      <div className="ml-11 space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lessonIndex}
                            className="flex items-center gap-2 bg-white p-3 rounded-lg border border-stone-100"
                          >
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                              placeholder="Lesson Title"
                              className="flex-1 px-3 py-1.5 border border-stone-200 rounded-lg bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                              required
                            />
                            <select
                              value={lesson.type}
                              onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'type', e.target.value)}
                              className="px-3 py-1.5 border border-stone-200 rounded-lg text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            >
                              <option value="video">Video</option>
                              <option value="pdf">PDF</option>
                              <option value="link">Link</option>
                            </select>
                            <input
                              type="text"
                              value={lesson.content}
                              onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'content', e.target.value)}
                              placeholder="Content URL"
                              className="flex-1 px-3 py-1.5 border border-stone-200 rounded-lg bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => removeLesson(moduleIndex, lessonIndex)}
                              className="text-red-400 hover:text-red-600 p-1"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addLesson(moduleIndex)}
                          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1 mt-2"
                        >
                          <PlusIcon className="w-3 h-3" />
                          Add Lesson
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              onClick={() => navigate('/admin/courses')}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              variant="luxury"
              className="min-w-[120px]"
            >
              {saving ? 'Saving...' : 'Save Course'}
            </Button>
          </div>
        </form>
      </motion.div>
    </AppLayout>
  );
};

export default CourseEditorPage;
