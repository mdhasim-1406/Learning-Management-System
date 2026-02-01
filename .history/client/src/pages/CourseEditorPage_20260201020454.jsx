import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourse, createCourse, updateCourse } from '../api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditing ? 'Edit Course' : 'Create Course'}
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Details */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold">Course Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows="3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
              <input
                type="url"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* Modules */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Modules</h2>
              <button
                type="button"
                onClick={addModule}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Module
              </button>
            </div>

            {formData.modules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="border rounded-md p-4 mb-4">
                <div className="flex justify-between items-start mb-3">
                  <input
                    type="text"
                    value={module.title}
                    onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                    placeholder="Module Title"
                    className="flex-1 px-3 py-2 border rounded-md mr-2"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeModule(moduleIndex)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>

                {/* Lessons */}
                <div className="ml-4 space-y-2">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                        placeholder="Lesson Title"
                        className="flex-1 px-2 py-1 border rounded text-sm"
                        required
                      />
                      <select
                        value={lesson.type}
                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'type', e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        <option value="video">Video</option>
                        <option value="pdf">PDF</option>
                        <option value="link">Link</option>
                      </select>
                      <input
                        type="text"
                        value={lesson.content}
                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'content', e.target.value)}
                        placeholder="URL"
                        className="flex-1 px-2 py-1 border rounded text-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeLesson(moduleIndex, lessonIndex)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addLesson(moduleIndex)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Lesson
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/courses')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseEditorPage;
