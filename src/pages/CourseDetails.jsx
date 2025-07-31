import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFileText, 
  FiVideo, 
  FiFile, 
  FiList, 
  FiPlay,
  FiClock,
  FiUser,
  FiBookOpen,
  FiStar,
  FiPlus,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { getCourseDetailsApi, createLessonApi } from '../services/api';
import LessonViewer from '../components/LessonViewer';
import AssignmentSubmission from '../components/AssignmentSubmission';
import QuizAttempt from '../components/QuizAttempt';
import { toast } from 'react-toastify';
import base_url from '../services/base_url';

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState({ title: '', content: '', videoUrl: '', resources: [], order: 0 });
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [expandedQuizzes, setExpandedQuizzes] = useState({});

  const toggleQuizDropdown = (lessonId) => {
    setExpandedQuizzes(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  const validateYouTubeUrl = (url) => {
    if (!url) return true;
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/)?([a-zA-Z0-9_-]{11}).*/;
    return regex.test(url);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await getCourseDetailsApi(id);
        setCourse(response.data);
      } catch (error) {
        toast.error(error.message || 'Failed to load course details');
      }
    };
    fetchCourse();
  }, [id]);

  const handleProgressUpdate = async () => {
    try {
      const response = await getCourseDetailsApi(id);
      setCourse(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to update progress');
    }
  };

  const handleCreateLesson = async () => {
    if (!lesson.title || !lesson.content || !lesson.order) {
      toast.error('Title, content, and order are required');
      return;
    }
    if (isNaN(parseInt(lesson.order)) || parseInt(lesson.order) < 0) {
      toast.error('Order must be a non-negative number');
      return;
    }
    if (lesson.videoUrl && !validateYouTubeUrl(lesson.videoUrl)) {
      toast.error('Invalid YouTube URL');
      return;
    }
    const formData = new FormData();
    formData.append('title', lesson.title);
    formData.append('content', lesson.content);
    formData.append('videoUrl', lesson.videoUrl);
    formData.append('order', lesson.order);
    lesson.resources.forEach(resource => formData.append('resources', resource));
    try {
      await createLessonApi(id, formData);
      toast.success('Lesson created successfully');
      setLesson({ title: '', content: '', videoUrl: '', resources: [], order: 0 });
      setShowLessonForm(false);
      const response = await getCourseDetailsApi(id);
      setCourse(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to create lesson');
    }
  };

  const handleQuizSubmitted = async () => {
    try {
      const response = await getCourseDetailsApi(id);
      setCourse(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to update quiz progress');
    }
  };

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-600">Loading course details...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Course Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl overflow-hidden mb-8"
      >
        <div className="relative">
          {course.thumbnail && (
            <div className="absolute inset-0">
              <img
                src={`${base_url}/Uploads/${course.thumbnail}`}
                alt={course.title}
                className="w-full h-full object-cover opacity-20"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="relative z-10 p-12 lg:p-16">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div className="flex-1">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl lg:text-6xl font-bold text-white mb-6"
                >
                  {course.title}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-blue-100 text-lg lg:text-xl mb-8 max-w-4xl leading-relaxed"
                >
                  {course.description}
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-6 text-white mb-8"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <FiUser className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">Instructor</p>
                      <p className="font-semibold">{course.instructor?.username || 'Unknown Instructor'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <FiBookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">Lessons</p>
                      <p className="font-semibold">{course.lessons?.length || 0} lessons</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <FiStar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">Rating</p>
                      <p className="font-semibold">4.8 (120 reviews)</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <FiClock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">Duration</p>
                      <p className="font-semibold">8 hours</p>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 lg:mt-0"
              >
                <span className="inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                  {course.category}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Instructor Section */}
      {sessionStorage.getItem('role') === 'instructor' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add New Lesson</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLessonForm(!showLessonForm)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2"
            >
              <FiPlus className="w-5 h-5" />
              <span>{showLessonForm ? 'Cancel' : 'Add Lesson'}</span>
            </motion.button>
          </div>

          <AnimatePresence>
            {showLessonForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="relative">
                    <FiFileText className="absolute top-4 left-4 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Lesson Title"
                      value={lesson.title}
                      onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="relative">
                    <FiList className="absolute top-4 left-4 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      placeholder="Order (e.g., 1)"
                      value={lesson.order}
                      onChange={(e) => setLesson({ ...lesson, order: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <FiVideo className="absolute top-4 left-4 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="YouTube Video URL (optional)"
                    value={lesson.videoUrl}
                    onChange={(e) => setLesson({ ...lesson, videoUrl: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div className="relative">
                  <FiFileText className="absolute top-4 left-4 text-gray-400 w-5 h-5" />
                  <textarea
                    placeholder="Lesson Content"
                    value={lesson.content}
                    onChange={(e) => setLesson({ ...lesson, content: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    rows="6"
                  />
                </div>
                
                <div className="relative">
                  <FiFile className="absolute top-4 left-4 text-gray-400 w-5 h-5" />
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    multiple
                    onChange={(e) => setLesson({ ...lesson, resources: Array.from(e.target.files) })}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateLesson}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <FiCheckCircle className="w-5 h-5 mr-2" />
                  Create Lesson
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Lessons Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Course Lessons</h2>
          <div className="flex items-center space-x-2 text-gray-600">
            <FiBookOpen className="w-5 h-5" />
            <span>{course.lessons?.length || 0} lessons</span>
          </div>
        </div>
        
        {course.lessons && course.lessons.length > 0 ? (
          <div className="space-y-6">
            {course.lessons.map((lesson, index) => (
              <motion.div
                key={lesson._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <LessonViewer
                  lesson={lesson}
                  courseId={id}
                  onProgressUpdate={handleProgressUpdate}
                />
                
                {/* Enhanced Quizzes Section with Advanced Dropdown */}
              {course.quizzes && Array.isArray(course.quizzes) && course.quizzes.length > 0 && (
  <div className="border-t border-gray-100">
    <motion.button
      whileHover={{ backgroundColor: '#f9fafb' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => toggleQuizDropdown(lesson._id)}
      className="w-full flex items-center justify-between p-6 focus:outline-none"
    >
      <div className="flex items-center">
        <div className="w-16 h-16  flex items-center justify-center mr-6">
          <img
            src="https://static.vecteezy.com/system/resources/previews/027/765/346/non_2x/quiz-sign-mark-free-free-png.png"
            alt="Quiz Icon"
            className="w-10 h-10 object-contain"
          />
        </div>
        <div className="text-left">
          <h4 className="text-xl font-semibold text-gray-900">Quizzes</h4>
          <p className="text-sm text-gray-500 mt-1">
            {course.quizzes.filter(q => q.lessonId === lesson._id).length} quizzes available
          </p>
        </div>
      </div>
      <div className="text-gray-400">
        {expandedQuizzes[lesson._id] ? (
          <FiChevronUp className="w-6 h-6" />
        ) : (
          <FiChevronDown className="w-6 h-6" />
        )}
      </div>
    </motion.button>

    <AnimatePresence>
      {expandedQuizzes[lesson._id] && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 pb-6"
        >
          <div className="space-y-4 w-full">
            {course.quizzes
              .filter(q => q.lessonId === lesson._id)
              .map(quiz => (
                <QuizAttempt
                  key={quiz._id}
                  quiz={quiz}
                  courseId={id}
                  lessonId={lesson._id}
                  onQuizSubmitted={handleQuizSubmitted}
                />
              ))}
            {course.quizzes.filter(q => q.lessonId === lesson._id).length === 0 && (
              <div className="text-left py-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No quizzes available for this lesson</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)}

                
                {/* Assignment Section */}
                <div className="p-6 border-t border-gray-100">
                  <AssignmentSubmission
                    courseId={id}
                    lessonId={lesson._id}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No lessons available</h3>
            <p className="text-gray-600">Lessons will appear here once they are added by the instructor</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default CourseDetails;