import React, { useState, useEffect, useContext } from 'react';
import { getInstructorCoursesApi, createCourseApi, updateCourseApi, deleteCourseApi, getEnrolledCoursesApi, getAssignmentsApi, gradeAssignmentApi, deleteLessonApi, deleteQuizApi, getQuizApi, createQuizApi, updateQuizApi } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import base_url from '../services/base_url';
import LessonForm from '../components/LessonForm';
import QuizForm from '../components/QuizForm';

function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState({});
  const [course, setCourse] = useState({ title: '', description: '', category: '', thumbnail: null, _id: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [loading, setLoading] = useState(false);
  const [grading, setGrading] = useState({});
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isQuizViewOpen, setIsQuizViewOpen] = useState(false);
  const [selectedQuizDetails, setSelectedQuizDetails] = useState(null);
  const [isQuizEditModalOpen, setIsQuizEditModalOpen] = useState(false);
  const [editQuiz, setEditQuiz] = useState({
    title: '',
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }],
    showResultsImmediately: true,
    _id: null,
    courseId: null,
    lessonId: null,
  });
  const [openLessons, setOpenLessons] = useState({});
  const { role } = useContext(AuthContext);

  useEffect(() => {
    if (role !== 'instructor') return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [coursesRes, assignmentsRes] = await Promise.all([
          getInstructorCoursesApi(),
          getAssignmentsApi(),
        ]);
        setCourses(coursesRes.data.data || []);
        setAssignments(assignmentsRes.data || []);
      } catch (error) {
        console.error('InstructorDashboard: Error fetching data:', error.message);
        toast.error(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [role]);

  const fetchEnrolledStudents = async (courseId) => {
    if (!courseId) {
      toast.error('Invalid course ID');
      return;
    }
    setLoading(true);
    try {
      const response = await getEnrolledCoursesApi(courseId);
      const students = response.data.map(enrollment => ({
        _id: enrollment._id,
        studentId: {
          _id: enrollment.studentId?._id || '',
          username: enrollment.studentId?.username || 'Unknown',
        },
        progress: enrollment.progress || [],
      }));
      setEnrolledStudents(prev => ({
        ...prev,
        [courseId]: students,
      }));
      if (students.length === 0) {
        toast.info('No students enrolled in this course');
      } else {
        toast.success(`Found ${students.length} enrolled student(s)`);
      }
    } catch (error) {
      console.error('fetchEnrolledStudents: Error:', error.message);
      toast.error(error.message || 'Failed to load enrolled students');
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuiz = async (quizId) => {
    if (!quizId) {
      toast.error('Invalid quiz ID');
      return;
    }
    setLoading(true);
    try {
      const response = await getQuizApi(quizId);
      setSelectedQuizDetails(response.data.quiz);
      setIsQuizViewOpen(true);
    } catch (error) {
      console.error('handleViewQuiz: Error:', error.message);
      toast.error(error.message || 'Failed to load quiz details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!course.title || !course.description || !course.category) {
      toast.error('Title, description, and category are required');
      return;
    }
    const formData = new FormData();
    formData.append('title', course.title);
    formData.append('description', course.description);
    formData.append('category', course.category);
    if (course.thumbnail) formData.append('thumbnail', course.thumbnail);

    setLoading(true);
    try {
      if (modalType === 'create') {
        await createCourseApi(formData);
        toast.success('Course created successfully');
      } else {
        await updateCourseApi(course._id, formData);
        toast.success('Course updated successfully');
      }
      setCourse({ title: '', description: '', category: '', thumbnail: null, _id: null });
      setIsModalOpen(false);
      const response = await getInstructorCoursesApi();
      setCourses(response.data.data || []);
    } catch (error) {
      console.error('handleSubmit: Error:', error.message);
      toast.error(error.message || 'Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeAssignment = async (assignmentId, grade) => {
    if (!grade || grade < 0 || grade > 100) {
      toast.error('Grade must be between 0 and 100');
      return;
    }
    setLoading(true);
    try {
      await gradeAssignmentApi(assignmentId, { grade });
      toast.success('Assignment graded successfully');
      const response = await getAssignmentsApi();
      setAssignments(response.data || []);
      setGrading(prev => ({ ...prev, [assignmentId]: null }));
    } catch (error) {
      console.error('handleGradeAssignment: Error:', error.message);
      toast.error(error.message || 'Failed to grade assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    setLoading(true);
    try {
      await deleteCourseApi(id);
      toast.success('Course deleted successfully');
      setCourses(courses.filter(c => c._id !== id));
    } catch (error) {
      console.error('handleDeleteCourse: Error:', error.message);
      toast.error(error.message || 'Failed to delete course');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (courseId, lessonId) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    setLoading(true);
    try {
      await deleteLessonApi(lessonId);
      toast.success('Lesson deleted successfully');
      const response = await getInstructorCoursesApi();
      setCourses(response.data.data || []);
    } catch (error) {
      console.error('handleDeleteLesson: Error:', error.message);
      toast.error(error.message || 'Failed to delete lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (courseId, quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    setLoading(true);
    try {
      await deleteQuizApi(quizId);
      toast.success('Quiz deleted successfully');
      const response = await getInstructorCoursesApi();
      setCourses(response.data.data || []);
    } catch (error) {
      console.error('handleDeleteQuiz: Error:', error.message);
      toast.error(error.message || 'Failed to delete quiz');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, courseData = { title: '', description: '', category: '', thumbnail: null, _id: null }) => {
    setModalType(type);
    setCourse(courseData);
    setIsModalOpen(true);
  };

  const openLessonModal = (courseId, lesson = null) => {
    if (!courseId) {
      toast.error('Invalid course ID');
      return;
    }
    setSelectedLesson(lesson ? { ...lesson, courseId } : { courseId });
    setIsLessonModalOpen(true);
  };

  const openQuizModal = (courseId, lessonId, quiz = null) => {
    if (!courseId || !lessonId) {
      toast.error('Invalid course or lesson ID');
      return;
    }
    setSelectedQuiz(quiz ? { ...quiz, courseId, lessonId } : { courseId, lessonId });
    setIsQuizModalOpen(true);
  };

  const openQuizEditModal = (quiz, courseId, lessonId) => {
    if (!quiz || !courseId || !lessonId) {
      toast.error('Invalid quiz, course, or lesson ID');
      return;
    }
    setEditQuiz({
      title: quiz.title || '',
      questions: quiz.questions.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      })) || [{ question: '', options: ['', '', '', ''], correctAnswer: '' }],
      showResultsImmediately: quiz.showResultsImmediately ?? true,
      _id: quiz._id,
      courseId,
      lessonId,
    });
    setIsQuizEditModalOpen(true);
  };

  const handleAddQuestion = () => {
    setEditQuiz({
      ...editQuiz,
      questions: [...editQuiz.questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }],
    });
  };

  const handleRemoveQuestion = (index) => {
    if (editQuiz.questions.length === 1) {
      toast.error('At least one question is required');
      return;
    }
    setEditQuiz({
      ...editQuiz,
      questions: editQuiz.questions.filter((_, i) => i !== index),
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...editQuiz.questions];
    if (field === 'question' || field === 'correctAnswer') {
      updatedQuestions[index][field] = value;
    } else {
      const optionIndex = parseInt(field.split('-')[1]);
      updatedQuestions[index].options[optionIndex] = value;
    }
    setEditQuiz({ ...editQuiz, questions: updatedQuestions });
  };

  const handleQuizUpdate = async () => {
    if (!editQuiz.title) {
      toast.error('Quiz title is required');
      return;
    }
    for (const [index, q] of editQuiz.questions.entries()) {
      if (!q.question) {
        toast.error(`Question ${index + 1} is required`);
        return;
      }
      if (q.options.some(opt => !opt)) {
        toast.error(`All options for question ${index + 1} are required`);
        return;
      }
      if (!q.correctAnswer || !q.options.includes(q.correctAnswer)) {
        toast.error(`Correct answer for question ${index + 1} must be one of the options`);
        return;
      }
    }
    const formData = new FormData();
    formData.append('title', editQuiz.title);
    formData.append('questions', JSON.stringify(editQuiz.questions));
    formData.append('showResultsImmediately', editQuiz.showResultsImmediately);

    setLoading(true);
    try {
      await updateQuizApi(editQuiz._id, formData);
      toast.success('Quiz updated successfully');
      setIsQuizEditModalOpen(false);
      setEditQuiz({
        title: '',
        questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }],
        showResultsImmediately: true,
        _id: null,
        courseId: null,
        lessonId: null,
      });
      const response = await getInstructorCoursesApi();
      setCourses(response.data.data || []);
    } catch (error) {
      console.error('handleQuizUpdate: Error:', error.message);
      toast.error(error.message || 'Failed to update quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleContentCreated = async () => {
    setLoading(true);
    try {
      const response = await getInstructorCoursesApi();
      setCourses(response.data.data || []);
      setIsLessonModalOpen(false);
      setIsQuizModalOpen(false);
    } catch (error) {
      console.error('handleContentCreated: Error:', error.message);
      toast.error(error.message || 'Failed to refresh course data');
    } finally {
      setLoading(false);
    }
  };

  const toggleLessonDropdown = (courseId, lessonId) => {
    setOpenLessons(prev => ({
      ...prev,
      [`${courseId}-${lessonId}`]: !prev[`${courseId}-${lessonId}`],
    }));
  };

  const getGradeLetter = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Instructor Dashboard</h1>
    <button
  onClick={() => openModal('create')}
  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6"
  disabled={loading}
>
  {loading ? 'Loading...' : 'Create New Course'}
</button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-lg">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">{modalType === 'create' ? 'Create Course' : 'Update Course'}</h2>
            <input
              type="text"
              placeholder="Title"
              value={course.title}
              onChange={(e) => setCourse({ ...course, title: e.target.value })}
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Description"
              value={course.description}
              onChange={(e) => setCourse({ ...course, description: e.target.value })}
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
            <select
              value={course.category}
              onChange={(e) => setCourse({ ...course, category: e.target.value })}
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Design">Design</option>
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCourse({ ...course, thumbnail: e.target.files[0] })}
              className="mb-4 w-full"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Saving...' : modalType === 'create' ? 'Create' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isLessonModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-lg">
            <LessonForm
              courseId={selectedLesson?.courseId}
              lesson={selectedLesson?._id ? selectedLesson : null}
              onLessonCreated={handleContentCreated}
              onCancel={() => setIsLessonModalOpen(false)}
            />
          </div>
        </div>
      )}

      {isQuizModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-lg">
            <QuizForm
              courseId={selectedQuiz?.courseId}
              lessonId={selectedQuiz?.lessonId}
              onQuizCreated={handleContentCreated}
              onCancel={() => setIsQuizModalOpen(false)}
            />
          </div>
        </div>
      )}

      {isQuizEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Edit Quiz</h2>
            <input
              type="text"
              placeholder="Quiz Title"
              value={editQuiz.title}
              onChange={(e) => setEditQuiz({ ...editQuiz, title: e.target.value })}
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {editQuiz.questions.map((q, index) => (
              <div key={index} className="mb-4 border-t pt-4">
                <input
                  type="text"
                  placeholder={`Question ${index + 1}`}
                  value={q.question}
                  onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                  className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {q.options.map((opt, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    placeholder={`Option ${optIndex + 1}`}
                    value={opt}
                    onChange={(e) => handleQuestionChange(index, `option-${optIndex}`, e.target.value)}
                    className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
                <input
                  type="text"
                  placeholder="Correct Answer"
                  value={q.correctAnswer}
                  onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                  className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleRemoveQuestion(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  disabled={loading}
                >
                  Remove Question
                </button>
              </div>
            ))}
            <button
              onClick={handleAddQuestion}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
              disabled={loading}
            >
              Add Question
            </button>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editQuiz.showResultsImmediately}
                  onChange={(e) => setEditQuiz({ ...editQuiz, showResultsImmediately: e.target.checked })}
                  className="mr-2"
                />
                Show results immediately
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsQuizEditModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleQuizUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Quiz'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isQuizViewOpen && selectedQuizDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">{selectedQuizDetails.title}</h2>
            <p className="text-sm text-gray-500 mb-4">Show Results Immediately: {selectedQuizDetails.showResultsImmediately ? 'Yes' : 'No'}</p>
            <h3 className="text-lg font-semibold mb-2">Questions</h3>
            {selectedQuizDetails.questions && selectedQuizDetails.questions.length > 0 ? (
              selectedQuizDetails.questions.map((question, index) => (
                <div key={index} className="mb-4">
                  <p className="font-medium">{index + 1}. {question.question}</p>
                  <ul className="list-disc pl-5">
                    {question.options.map((option, idx) => (
                      <li key={idx} className={option === question.correctAnswer ? 'text-green-600' : ''}>
                        {option} {option === question.correctAnswer ? '(Correct)' : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No questions available</p>
            )}
            <div className="flex justify-end">
              <button
                onClick={() => setIsQuizViewOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                disabled={loading}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Your Courses</h2>
      {loading && <p className="text-gray-600">Loading courses...</p>}
      {!loading && courses.length === 0 && <p className="text-gray-600">No courses available</p>}
      <div className="grid gap-4 sm:gap-6">
        {courses.map(course => (
          <div key={course._id} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-lg sm:text-xl font-semibold">{course.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{course.description}</p>
                <p className="text-gray-500 text-sm">Category: {course.category}</p>
                <p className="text-gray-500 text-sm">Status: {course.status}</p>
                {course.thumbnail && (
                  <img
                    src={`${base_url}/Uploads/${course.thumbnail}`}
                    alt={course.title}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover mt-2 rounded"
                  />
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => openModal('update', course)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm sm:text-base"
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCourse(course._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm sm:text-base"
                  disabled={loading}
                >
                  Delete
                </button>
                <button
                  onClick={() => fetchEnrolledStudents(course._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm sm:text-base"
                  disabled={loading}
                >
                  View Students
                </button>
                <button
                  onClick={() => openLessonModal(course._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm sm:text-base"
                  disabled={loading}
                >
                  Add Lesson
                </button>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-md sm:text-lg font-semibold mb-2">Lessons</h4>
              {course.lessons && course.lessons.length > 0 ? (
                course.lessons
                  .sort((a, b) => a.order - b.order)
                  .map((lesson, index) => (
                    <div key={lesson._id || index} className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => toggleLessonDropdown(course._id, lesson._id)}
                          className="flex items-center text-left font-medium text-gray-700 hover:text-blue-600"
                        >
                          <span className={`mr-2 transform ${openLessons[`${course._id}-${lesson._id}`] ? 'rotate-90' : ''}`}>
                            ▶
                          </span>
                          {lesson.title || 'Untitled Lesson'} (Order: {lesson.order})
                        </button>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openLessonModal(course._id, lesson)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                            disabled={loading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(course._id, lesson._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                            disabled={loading}
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => openQuizModal(course._id, lesson._id)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                            disabled={loading}
                          >
                            Add Quiz
                          </button>
                        </div>
                      </div>
                      {openLessons[`${course._id}-${lesson._id}`] && (
                        <div className="ml-4 sm:ml-6 mt-2">
                          {lesson.videoUrl && (
                            <p className="text-sm text-gray-500">
                              Video: <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Watch</a>
                            </p>
                          )}
                          {lesson.resources && lesson.resources.length > 0 && (
                            <div className="text-sm text-gray-500">
                              Resources:
                              <ul className="list-disc pl-5">
                                {lesson.resources.map((resource, idx) => (
                                  <li key={idx}>
                                    <a href={`${base_url}/Uploads/${resource}`} className="text-blue-500 hover:underline">{resource}</a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div className="mt-2">
                            <h5 className="text-sm font-semibold">Quizzes</h5>
                            {course.quizzes && course.quizzes.length > 0 ? (
                              course.quizzes
                                .filter(q => 
                                  q.lessonId && lesson._id && 
                                  (q.lessonId._id ? q.lessonId._id.toString() : q.lessonId.toString()) === lesson._id.toString()
                                )
                                .map((quiz, idx) => (
                                  <div key={quiz._id || idx} className="border-t border-gray-200 pt-2 mt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                    <div>
                                      <p className="text-gray-700">{quiz.title || 'Untitled Quiz'}</p>
                                      <p className="text-sm text-gray-500">Questions: {quiz.questions?.length || 0}</p>
                                      <p className="text-sm text-gray-500">
                                        Show Results Immediately: {quiz.showResultsImmediately ? 'Yes' : 'No'}
                                      </p>
                                    </div>
                                    <div className="flex gap-2 mt-2 sm:mt-0">
                                      <button
                                        onClick={() => handleViewQuiz(quiz._id)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                                        disabled={loading}
                                      >
                                        View
                                      </button>
                                      <button
                                        onClick={() => openQuizEditModal(quiz, course._id, lesson._id)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                                        disabled={loading}
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDeleteQuiz(course._id, quiz._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                        disabled={loading}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                ))
                            ) : (
                              <p className="text-sm text-gray-500">No quizzes available for this lesson</p>
                            )}
                          </div>
                          <div className="mt-2">
                            <h5 className="text-sm font-semibold">Assignments</h5>
                            {assignments.filter(a => 
                              a.courseId?._id?.toString() === course._id.toString() && 
                              a.lessonId?._id?.toString() === lesson._id.toString()
                            ).length === 0 && (
                              <p className="text-sm text-gray-500">No assignments submitted</p>
                            )}
                            {assignments
                              .filter(a => 
                                a.courseId?._id?.toString() === course._id.toString() && 
                                a.lessonId?._id?.toString() === lesson._id.toString()
                              )
                              .map(assignment => (
                                <div key={assignment._id} className="border-t border-gray-200 pt-2 mt-2">
                                  <p className="text-sm">Student: {assignment.studentId?.username || 'Unknown'}</p>
                                  <p className="text-sm">
                                    File: <a href={`${base_url}/Uploads/${assignment.file}`} className="text-blue-500 hover:underline">{assignment.file}</a>
                                  </p>
                                  <p className="text-sm">Current Grade: {assignment.grade ? getGradeLetter(assignment.grade) : 'Not graded'}</p>
                                  <div className="flex gap-2 items-center mt-2">
                                    <input
                                      type="number"
                                      placeholder="Enter grade (0-100)"
                                      value={grading[assignment._id] ?? ''}
                                      onChange={(e) => setGrading(prev => ({ ...prev, [assignment._id]: parseInt(e.target.value) || '' }))}
                                      className="p-2 border rounded w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      min="0"
                                      max="100"
                                    />
                                    <button
                                      onClick={() => handleGradeAssignment(assignment._id, grading[assignment._id])}
                                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
                                      disabled={loading || !grading[assignment._id]}
                                    >
                                      Grade
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
              ) : (
                <p className="text-sm text-gray-600">No lessons available</p>
              )}
            </div>
            {enrolledStudents[course._id] && (
              <div className="mt-4">
                <h4 className="text-md sm:text-lg font-semibold mb-2">Enrolled Students</h4>
                {enrolledStudents[course._id].length > 0 ? (
                  enrolledStudents[course._id].map(enrollment => (
                    <p key={enrollment._id} className="text-sm">
                      {enrollment.studentId.username || 'Unknown'} - Progress: {enrollment.progress.reduce((acc, p) => acc + (p.watched ? 100 / (course.lessons?.length || 1) : 0), 0).toFixed(2)}%
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No enrolled students</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default InstructorDashboard