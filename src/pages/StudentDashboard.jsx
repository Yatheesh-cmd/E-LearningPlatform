import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { 
  FiBookOpen, 
  FiBell, 
  FiPlay, 
  FiTrendingUp, 
  FiClock,
  FiUser,
  FiStar,
  FiArrowRight,
  FiCheckCircle,
  FiTarget
} from 'react-icons/fi';
import { getEnrolledCoursesApi, getNotificationsApi } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Notification from '../components/Notification';
import { Link } from 'react-router-dom';
import base_url from '../services/base_url';

function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role } = useContext(AuthContext);

  useEffect(() => {
    if (role !== 'student') return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [coursesRes, notificationsRes] = await Promise.all([
          getEnrolledCoursesApi(),
          getNotificationsApi(),
        ]);
        setCourses(coursesRes.data);
        setNotifications(notificationsRes.data);
      } catch (error) {
        toast.error(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [role]);

  const handleRead = (id) => {
    setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
  };

  const stats = [
    { label: 'Enrolled Courses', value: courses.length, icon: FiBookOpen, color: 'from-blue-500 to-purple-500' },
    { label: 'Total Progress', value: `${courses.reduce((acc, course) => acc + course.progress, 0) / Math.max(courses.length, 1)}%`, icon: FiTrendingUp, color: 'from-green-500 to-emerald-500' },
    { label: 'Notifications', value: notifications.length, icon: FiBell, color: 'from-orange-500 to-red-500' },
    { label: 'Study Hours', value: '24h', icon: FiClock, color: 'from-indigo-500 to-blue-500' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, Student!</h1>
        <p className="text-gray-600 text-lg">Track your progress and continue learning</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mr-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/courses" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FiBookOpen className="w-5 h-5 mr-2" />
              Browse Courses
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/courses" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FiTarget className="w-5 h-5 mr-2" />
              Set Goals
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enrolled Courses */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border MonsterInsights Ads Addon 8.29.0gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Enrolled Courses</h2>
            <div className="flex items-center space-x-2 text-gray-600">
              <FiBookOpen className="w-5 h-5" />
              <span>{courses.length} courses</span>
            </div>
          </div>
          
          {courses.length > 0 ? (
            <div className="space-y-4">
              {courses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start space-x-4">
                    {course.thumbnail && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={`${base_url}/Uploads/${course.thumbnail}`}
                          alt={course.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://source.unsplash.com/100x100/?${course.category || 'education'}`;
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {course.description}
                      </p>
                      <p className="text-gray-700 text-sm font-medium mb-2">Progress Tracking</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <FiUser className="w-4 h-4" />
                            <span>{course.instructor?.username || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FiStar className="w-4 h-4 text-yellow-500" />
                            <span>4.8</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">{course.progress.toFixed(1)}%</p>
                            <p className="text-xs text-gray-500">Complete</p>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Link 
                              to={`/courses/${course._id}`}
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-1"
                            >
                              <FiPlay className="w-4 h-4" />
                              <span>Continue</span>
                            </Link>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No enrolled courses</h3>
              <p className="text-gray-600 mb-4">Start your learning journey by enrolling in courses</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/courses"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200"
                >
                  <FiArrowRight className="w-5 h-5 mr-2" />
                  Browse Courses
                </Link>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
            <div className="flex items-center space-x-2 text-gray-600">
              <FiBell className="w-5 h-5" />
              <span>{notifications.length} notifications</span>
            </div>
          </div>
          
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <Notification
                    notification={notification}
                    onRead={handleRead}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBell className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up! Check back later for updates</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default StudentDashboard;