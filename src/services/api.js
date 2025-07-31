import axios from 'axios';
import BASE_URL from './base_url';

const commonApi = async (url, method, headers = {}, data = {}, isMultipart = false) => {
  const config = {
    method,
    url: `${BASE_URL}${url}`,
    headers: isMultipart ? headers : { 'Content-Type': 'application/json', ...headers },
    data,
    timeout: 100000,
  };
  console.log('commonApi: Sending request:', { url, method, headers, data }); // Debugging
  try {
    const response = await axios(config);
    console.log('commonApi: Response received:', response.data); 
    return response;
  } catch (error) {
    console.error('commonApi: Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    console.error('getAuthHeaders: No token found');
    throw new Error('No token found');
  }
  return { Authorization: `Bearer ${token}` };
};

export const signupApi = (data) => commonApi('/auth/register', 'POST', {}, data);
export const loginApi = (data) => commonApi('/auth/login', 'POST', {}, data);
export const verifyEmailApi = (data) => commonApi('/auth/verify-email', 'POST', {}, data);
export const resendCodeApi = (data) => commonApi('/auth/resend-code', 'POST', {}, data);
export const getAllCoursesApi = (search = '', category = '', includeAll = false) =>
  commonApi(`/courses?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}${includeAll ? '&all=true' : ''}`, 'GET', getAuthHeaders());
export const getCourseDetailsApi = (id) => commonApi(`/courses/${id}`, 'GET', getAuthHeaders());
export const createCourseApi = (formData) =>
  commonApi('/courses', 'POST', { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }, formData, true);
export const updateCourseApi = (id, formData) =>
  commonApi(`/courses/${id}`, 'PUT', { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }, formData, true);
export const deleteCourseApi = (id) => commonApi(`/courses/${id}`, 'DELETE', getAuthHeaders());
export const getInstructorCoursesApi = () => commonApi('/courses/instructor', 'GET', getAuthHeaders());
export const createLessonApi = (courseId, formData) =>
  commonApi(`/lessons/${courseId}`, 'POST', { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }, formData, true);
export const getLessonApi = (lessonId) => commonApi(`/lessons/${lessonId}`, 'GET', getAuthHeaders());
export const updateLessonApi = (lessonId, formData) =>
  commonApi(`/lessons/${lessonId}`, 'PUT', { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }, formData, true);
export const deleteLessonApi = (lessonId) => commonApi(`/lessons/${lessonId}`, 'DELETE', getAuthHeaders());
export const updateProgressApi = (courseId, lessonId, data) =>
  commonApi(`/lessons/progress/${courseId}/${lessonId}`, 'PUT', getAuthHeaders(), data);
export const getProgressApi = (courseId, lessonId) =>
  commonApi(`/lessons/progress/${courseId}/${lessonId}`, 'GET', getAuthHeaders());
export const submitAssignmentApi = (courseId, lessonId, formData) =>
  commonApi(`/assignments/${courseId}/${lessonId}`, 'POST', { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }, formData, true);
export const getEnrolledCoursesApi = (courseId = '') =>
  commonApi(courseId ? `/enrollments/${courseId}` : '/enrollments', 'GET', getAuthHeaders());
export const enrollCourseApi = (courseId) => commonApi(`/enrollments/${courseId}`, 'POST', getAuthHeaders());
export const getNotificationsApi = () => commonApi('/notifications', 'GET', getAuthHeaders());
export const markNotificationReadApi = (id) => commonApi(`/notifications/${id}`, 'PUT', getAuthHeaders());
export const approveCourseApi = (id) => commonApi(`/admin/courses/approve/${id}`, 'PUT', getAuthHeaders());
export const rejectCourseApi = (id) => commonApi(`/admin/courses/reject/${id}`, 'PUT', getAuthHeaders());
export const getStatsApi = () => commonApi('/admin/stats', 'GET', getAuthHeaders());
export const manageUserApi = (id, action) => commonApi(`/admin/users/${id}/${action}`, 'PUT', getAuthHeaders());
export const getAssignmentsApi = () => commonApi('/assignments', 'GET', getAuthHeaders());
export const gradeAssignmentApi = (id, data) => commonApi(`/assignments/${id}`, 'PUT', getAuthHeaders(), data);
export const createQuizApi = (courseId, lessonId, formData) =>
  commonApi(`/quiz/${courseId}/${lessonId}`, 'POST', { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }, formData, true);
export const updateQuizApi = (quizId, formData) =>
  commonApi(`/quiz/${quizId}`, 'PUT', { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }, formData, true);
export const deleteQuizApi = (quizId) => commonApi(`/quiz/${quizId}`, 'DELETE', getAuthHeaders());
export const submitQuizApi = (courseId, lessonId, quizId, data) =>
  commonApi(`/quiz/submit/${courseId}/${lessonId}/${quizId}`, 'POST', getAuthHeaders(), data);
export const getQuizApi = (quizId) => commonApi(`/quiz/${quizId}`, 'GET', getAuthHeaders());