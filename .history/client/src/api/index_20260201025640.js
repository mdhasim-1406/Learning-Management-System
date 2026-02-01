import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (email, password) => api.post('/auth/login', { email, password });
export const getMe = () => api.get('/auth/me');

// Users
export const getUsers = () => api.get('/users');
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Courses
export const getCourses = () => api.get('/courses');
export const getCourse = (id) => api.get(`/courses/${id}`);
export const createCourse = (courseData) => api.post('/courses', courseData);
export const updateCourse = (id, courseData) => api.put(`/courses/${id}`, courseData);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);

// Enrollments
export const getEnrollments = () => api.get('/enrollments');
export const getMyEnrollments = () => api.get('/enrollments/my');
export const enroll = (courseId) => api.post('/enrollments', { courseId });
export const updateProgress = (enrollmentId, lessonId) => 
  api.put(`/enrollments/${enrollmentId}/progress`, { lessonId });

// Quizzes
export const getCourseQuiz = (courseId) => api.get(`/quizzes/courses/${courseId}/quiz`);
export const createQuiz = (courseId, quizData) => api.post(`/quizzes/courses/${courseId}/quiz`, quizData);
export const submitQuizAttempt = (quizId, answers) => api.post(`/quizzes/${quizId}/attempt`, { answers });
export const getQuizAttempts = (quizId) => api.get(`/quizzes/${quizId}/attempts`);

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats');

// Knowledge Base
export const getArticles = () => api.get('/articles');
export const getArticle = (id) => api.get(`/articles/${id}`);
export const createArticle = (articleData) => api.post('/articles', articleData);
export const updateArticle = (id, articleData) => api.put(`/articles/${id}`, articleData);
export const deleteArticle = (id) => api.delete(`/articles/${id}`);

// Certificates
export const getMyCertificates = () => api.get('/certificates/my');
export const getCertificate = (id) => api.get(`/certificates/${id}`);

export default api;
