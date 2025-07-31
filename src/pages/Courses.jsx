import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, 
  FiFilter, 
  FiGrid, 
  FiList,
  FiBookOpen,
  FiUsers,
  FiTrendingUp
} from 'react-icons/fi';
import CourseCard from '../components/CourseCard';
import { getAllCoursesApi } from '../services/api';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Map Home page category labels to Courses page category values
  const categoryMap = {
    'web-development': 'Technology',
    'ui-ux-design': 'Design',
    'digital-marketing': 'Marketing',
    'business-strategy': 'Business',
    'personal-development': 'Personal Development',
    'cyber-security': 'Cyber Security'
  };

  useEffect(() => {
    // Extract category from URL query parameter
    const searchParams = new URLSearchParams(location.search);
    const urlCategory = searchParams.get('category');
    
    if (urlCategory) {
      // Convert URL category to Courses page category value
      const mappedCategory = categoryMap[urlCategory.toLowerCase()] || '';
      setCategory(mappedCategory);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await getAllCoursesApi(search, category);
        setCourses(response.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [search, category]);

  const categories = [
    { value: '', label: 'All Categories', icon: '📚' },
    { value: 'Technology', label: 'Technology', icon: '💻' },
    { value: 'Business', label: 'Business', icon: '💼' },
    { value: 'Design', label: 'Design', icon: '🎨' },
    { value: 'Marketing', label: 'Marketing', icon: '📈' },
    { value: 'Finance', label: 'Finance', icon: '💰' },
    { value: 'Personal Development', label: 'Personal Development', icon: '🧠' },
    { value: 'Cyber Security', label: 'Cyber Security', icon: '🔒' }
  ];

  const stats = [
    { label: 'Total Courses', value: courses.length, icon: FiBookOpen, color: 'from-blue-500 to-purple-500' },
    { label: 'Active Students', value: '2.5K+', icon: FiUsers, color: 'from-green-500 to-emerald-500' },
    { label: 'Success Rate', value: '95%', icon: FiTrendingUp, color: 'from-orange-500 to-red-500' }
  ];

  // Handle category change and update URL
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    
    // Update URL with mapped category for consistency with Home page links
    const urlCategory = Object.keys(categoryMap).find(
      key => categoryMap[key] === newCategory
    ) || newCategory.toLowerCase().replace(' ', '-');
    
    navigate(`/courses?category=${urlCategory}`);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Discover {category || 'All'} Courses
        </h1>
        <p className="text-gray-600 text-lg">
          Explore our comprehensive collection of {category || 'all'} courses designed to help you grow
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
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

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses by title or instructor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={category}
              onChange={handleCategoryChange}
              className="pl-12 pr-8 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FiGrid className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FiList className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Courses Grid */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-12"
        >
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading courses...</span>
          </div>
        </motion.div>
      ) : courses.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}
        >
          {courses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiBookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No {category || 'courses'} found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or browse all categories</p>
        </motion.div>
      )}
    </div>
  );
}

export default Courses;