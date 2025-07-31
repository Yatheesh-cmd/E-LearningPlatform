import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiBell, 
  FiCheck, 
  FiAward, 
  FiFileText,
  FiClock,
  FiStar,
  FiAlertCircle
} from 'react-icons/fi';
import { markNotificationReadApi } from '../services/api';
import { toast } from 'react-toastify';

function Notification({ notification, onRead }) {
  const handleRead = async () => {
    try {
      await markNotificationReadApi(notification._id);
      onRead(notification._id);
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getLessonFromMessage = (message) => {
    const lessonMatch = message.match(/lesson (\w+)/i);
    return lessonMatch ? lessonMatch[1] : notification.lessonTitle || 'Unknown';
  };

  const getMarkFromMessage = (message) => {
    const markMatch = message.match(/(\d+)/);
    return markMatch ? parseInt(markMatch[1]) : null;
  };

  const calculateGrade = (mark) => {
    if (!mark) return null;
    
    if (mark >= 90) return 'A';
    if (mark >= 80) return 'B';
    if (mark >= 70) return 'C';
    if (mark >= 60) return 'D';
    return 'F';
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100/80';
      case 'B': return 'text-blue-600 bg-blue-100/80';
      case 'C': return 'text-yellow-600 bg-yellow-100/80';
      case 'D': return 'text-orange-600 bg-orange-100/80';
      case 'F': return 'text-red-600 bg-red-100/80';
      default: return 'text-gray-600 bg-gray-100/80';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment_graded':
        return <FiAward className="w-5 h-5 text-emerald-500" />;
      case 'lesson_completed':
        return <FiCheck className="w-5 h-5 text-indigo-500" />;
      case 'quiz_available':
        return <FiFileText className="w-5 h-5 text-violet-500" />;
      case 'system_alert':
        return <FiAlertCircle className="w-5 h-5 text-amber-500" />;
      case 'achievement':
        return <FiStar className="w-5 h-5 text-amber-400" />;
      default:
        return <FiBell className="w-5 h-5 text-slate-500" />;
    }
  };

  const getNotificationBg = (type) => {
    switch (type) {
      case 'assignment_graded':
        return 'bg-gradient-to-br from-emerald-50/80 to-emerald-100/30';
      case 'lesson_completed':
        return 'bg-gradient-to-br from-indigo-50/80 to-indigo-100/30';
      case 'quiz_available':
        return 'bg-gradient-to-br from-violet-50/80 to-violet-100/30';
      case 'system_alert':
        return 'bg-gradient-to-br from-amber-50/80 to-amber-100/30';
      case 'achievement':
        return 'bg-gradient-to-br from-amber-50/80 to-yellow-100/30';
      default:
        return 'bg-gradient-to-br from-slate-50/80 to-slate-100/30';
    }
  };

  const getNotificationBorder = (type) => {
    switch (type) {
      case 'assignment_graded':
        return 'border-emerald-200/80';
      case 'lesson_completed':
        return 'border-indigo-200/80';
      case 'quiz_available':
        return 'border-violet-200/80';
      case 'system_alert':
        return 'border-amber-200/80';
      case 'achievement':
        return 'border-amber-200/80';
      default:
        return 'border-slate-200/80';
    }
  };

  const mark = getMarkFromMessage(notification.message);
  const grade = calculateGrade(mark);
  const gradeColor = getGradeColor(grade);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${
        notification.read 
          ? 'border-gray-200/60 bg-white' 
          : `${getNotificationBg(notification.type)} ${getNotificationBorder(notification.type)}`
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 leading-relaxed">
                {notification.message.split('graded:')[0]}
                {notification.type === 'assignment_graded' && mark && (
                  <span className="inline-flex items-center space-x-2 ml-2">
                    <span className="text-gray-600">Mark: {mark}</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${gradeColor}`}>
                      Grade: {grade}
                    </span>
                  </span>
                )}
              </p>
              
              {notification.type === 'assignment_graded' && (
                <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                  <FiFileText className="w-3 h-3" />
                  <span>Lesson: {getLessonFromMessage(notification.message)}</span>
                </div>
              )}
              
              <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                <FiClock className="w-3 h-3" />
                <span>{new Date(notification.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </div>
            
            {!notification.read && (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRead}
                className="flex-shrink-0 ml-2 p-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-full hover:from-indigo-600 hover:to-violet-600 shadow-md hover:shadow-lg transition-all duration-300"
                title="Mark as read"
              >
                <FiCheck className="w-4 h-4" />
              </motion.button>
            )}
          </div>
          
          {!notification.read && (
            <div className="mt-3 flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-blue-600">New</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Notification;