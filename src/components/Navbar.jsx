import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiBookOpen, 
  FiUser, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiBell,
  FiSettings,
  FiBarChart,
  FiTrendingUp,
  FiShield,
  FiGrid,
  FiInfo
} from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { setAuth, setRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = sessionStorage.getItem('role');
  const username = sessionStorage.getItem('user');
  const isAuthenticated = !!userRole;

  const courseId = 'some-course-id'; 
  const handleLogout = () => {
    sessionStorage.clear();
    setAuth(false);
    setRole(null);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); 
    navigate('/');
  };

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { name: 'Home', path: '/', icon: FiHome }
      ];
    }

    switch (userRole) {
      case 'student':
        return [
          { name: 'Home', path: '/', icon: FiHome },
          { name: 'Browse Courses', path: '/courses', icon: FiBookOpen },
          { name: 'Dashboard', path: '/student', icon: FiUser },
          { name: 'Progress', path: `/progress`, icon: FiTrendingUp }, 
          { name: 'About', path: '/about', icon: FiInfo } 
        ];
      case 'instructor':
        return [
          { name: 'Home', path: '/', icon: FiHome },
          { name: 'Courses', path: '/courses', icon: FiBookOpen },
          { name: 'Dashboard', path: '/instructor', icon: FiUser },
          { name: 'Analytics', path: '/analytics', icon: FiBarChart }
        ];
      case 'admin':
        return [
          { name: 'Home', path: '/', icon: FiHome },
          { name: 'Admin Dashboard', path: '/admin', icon: FiShield }
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      <nav className="bg-white/70 backdrop-blur-lg border-b border-gray-200/90 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
           
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <FiBookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  eLearn
                </span>
              </Link>
            </motion.div>

           
            <div className="hidden md:flex items-center space-x-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg ring-2 ring-blue-400/30'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50 ring-1 ring-gray-200/50 hover:ring-blue-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[15px]">{link.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>


            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-2.5 text-gray-600 hover:text-blue-600 transition-colors bg-gray-50 rounded-full ring-1 ring-gray-200/50 hover:ring-blue-200"
                  >
                    <FiBell className="w-5 h-5" />
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
                  </motion.button>
                  
                  <div className="flex items-center space-x-3 bg-gray-50 pl-3 pr-2 py-1.5 rounded-full ring-1 ring-gray-200/50">
                    <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-medium">
                        {username?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{username || 'User'}</p>
                      <p className="text-gray-500 capitalize text-xs">{userRole || 'Guest'}</p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="p-2.5 text-gray-600 hover:text-red-600 transition-colors bg-gray-50 rounded-full ring-1 ring-gray-200/50 hover:ring-red-200"
                    title="Logout"
                  >
                    <FiLogOut className="w-5 h-5" />
                  </motion.button>
                </>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg font-medium text-[15px] transition-all duration-200 shadow-md hover:shadow-lg ring-2 ring-blue-400/20"
                  >
                    Login
                  </Link>
                </motion.div>
              )}
            </div>

           
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors ring-1 ring-gray-200/50"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200/90 bg-white/95 backdrop-blur-sm"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.name}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50 ring-1 ring-gray-200/50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-[15px]">{link.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}
                
                {isAuthenticated ? (
                  <div className="pt-4 border-t border-gray-200/80">
                    <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg ring-1 ring-gray-200/50">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white text-sm font-medium">
                          {username?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{username || 'User'}</p>
                        <p className="text-gray-500 capitalize text-xs">{userRole || 'Guest'}</p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="p-2.5 text-gray-600 hover:text-red-600 transition-colors bg-white rounded-full ring-1 ring-gray-200/50"
                      >
                        <FiLogOut className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-200/80">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-medium text-[15px] transition-all duration-200 flex items-center justify-center shadow-md ring-2 ring-blue-400/20"
                    >
                      Login
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 right-6 z-50 bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3 max-w-sm"
          >
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Logged out successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;