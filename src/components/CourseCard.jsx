import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  FiBookOpen, 
  FiUser, 
  FiFileText, 
  FiPlay, 
  FiArrowRight,
  FiStar,
  FiClock
} from 'react-icons/fi';
import base_url from '../services/base_url';
import { enrollCourseApi } from '../services/api';

function CourseCard({ course }) {
  const navigate = useNavigate();

  const handleEnroll = async () => {
    try {
      await enrollCourseApi(course._id);
      toast.success('Enrolled successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'technology':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'business':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'design':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'marketing':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'finance':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'technology':
        return '💻';
      case 'business':
        return '💼';
      case 'design':
        return '🎨';
      case 'marketing':
        return '📈';
      case 'finance':
        return '💰';
      default:
        return '📚';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
    >
    
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
        <img
          src={`${base_url}/uploads/${course.thumbnail}`}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = `https://source.unsplash.com/400x300/?${course.category || 'education'}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        
      
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getCategoryColor(course.category)}`}>
            <span className="mr-1">{getCategoryIcon(course.category)}</span>
            {course.category}
          </span>
        </div>

        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
          >
            <FiPlay className="w-6 h-6 text-blue-600 ml-1" />
          </motion.div>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
            {course.description}
          </p>
        </div>
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
              <FiUser className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">{course.instructor?.username || 'Unknown Instructor'}</span>
          </div>
          
          {course.lessons && (
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                <FiBookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium">{course.lessons.length} lessons</span>
            </div>
          )}

          {course.quizzes && (
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-3">
                <FiFileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium">{course.quizzes.length} quizzes</span>
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mr-3">
              <FiStar className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">4.8 (120 reviews)</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/courses/${course._id}`)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
          >
            <span>View Details</span>
            <FiArrowRight className="ml-2 w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEnroll}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Enroll Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default CourseCard;