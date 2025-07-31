import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiArrowRight,
  FiShield,
  FiChevronDown
} from 'react-icons/fi';
import { FaChalkboardTeacher, FaGraduationCap, FaLaptopCode } from 'react-icons/fa';
import { GiTeacher } from 'react-icons/gi';
import { loginApi, signupApi, verifyEmailApi, resendCodeApi } from '../services/api';
import { AuthContext } from '../context/AuthContext';

function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [role, setRole] = useState('student');
  const [user, setUser] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [verificationCode, setVerificationCode] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const { setAuth, setRole: setContextRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  
  const roleOptions = [
    { 
      value: 'student', 
      label: 'Student',
      description: 'Access courses, track progress, and earn certificates'
    },
    { 
      value: 'instructor', 
      label: 'Instructor',
      description: 'Create and manage courses, interact with students'
    },
    { 
      value: 'admin', 
      label: 'Administrator',
      description: 'Manage platform settings, users, and content'
    }
  ];

  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const roleParam = searchParams.get('role');
    if (roleParam && roleOptions.some(option => option.value === roleParam)) {
      setRole(roleParam);
      setIsSignup(true);
    }
  }, [location.search]);

  const validateEmail = (email) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  
  useEffect(() => {
    if (!isSignup) {
      setUser(prev => ({ ...prev, username: '', confirmPassword: '' }));
    }
  }, [isSignup]);

  const handleSignup = async () => {
    if (!user.username || !user.email || !user.password || !user.confirmPassword) {
      toast.error('All fields are required');
      return;
    }
    if (!validateEmail(user.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (user.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (user.password !== user.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await signupApi({ ...user, role });
      setSignupEmail(result.email || user.email.toLowerCase());
      toast.success(
        role === 'student'
          ? 'Account created! Please verify your email with the code we sent.'
          : 'Account created successfully!'
      );
      setUser({ username: '', email: '', password: '', confirmPassword: '' });
      if (role === 'student') {
        setIsVerifying(true);
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode) {
      toast.error('Verification code is required');
      return;
    }
    if (!/^\d{6}$/.test(verificationCode)) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }
    
    setIsLoading(true);
    try {
      await verifyEmailApi({ email: signupEmail, code: verificationCode });
      toast.success('Email verified successfully! You can now log in.');
      setIsVerifying(false);
      setIsSignup(false);
      setVerificationCode('');
      setSignupEmail('');
      setRole('student');
    } catch (error) {
      toast.error(error.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!signupEmail) {
      toast.error('Email is required to resend code');
      return;
    }
    
    setIsLoading(true);
    try {
      await resendCodeApi({ email: signupEmail });
      toast.success('New verification code sent to your email.');
    } catch (error) {
      toast.error(error.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!user.email || !user.password) {
      toast.error('Email and password are required');
      return;
    }
    if (!validateEmail(user.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await loginApi({ email: user.email, password: user.password, role });
      sessionStorage.setItem('token', result.data.token);
      sessionStorage.setItem('user', result.data.user.username);
      sessionStorage.setItem('role', result.data.user.role);
      setAuth(true);
      setContextRole(result.data.user.role);
      
    
      const redirectPath = {
        admin: '/admin',
        instructor: '/instructor',
        student: '/student'
      }[result.data.user.role] || '/';
      
      navigate(redirectPath);
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-teal-500 to-purple-700 relative overflow-hidden px-4 py-8">
     
      <div className="pointer-events-none select-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-teal-400 rounded-full opacity-10 blur-3xl"></div>
      </div>

      
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 z-10">
       
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full lg:w-1/2 text-center lg:text-left"
        >
          <div className="mb-8 lg:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
              <img
                src="https://img.freepik.com/free-vector/e-learning-global-community_24877-60109.jpg"
                alt="eLearn Logo"
                className="w-10 h-10"
              />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Welcome to <span className="bg-gradient-to-r from-blue-300 via-teal-300 to-purple-400 bg-clip-text text-transparent">E-Learn</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Join our community of learners and educators. Access world-class courses, track your progress, and achieve your learning goals.
            </p>
          </div>
          
          
          <div className="hidden lg:block space-y-4 mt-8">
            {[
              "Interactive courses with expert instructors",
              "Personalized learning paths",
              "Progress tracking and certifications",
              "Community support and discussions"
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <FiCheckCircle className="w-5 h-5 text-teal-300" />
                </div>
                <p className="text-white/90">{feature}</p>
              </div>
            ))}
          </div>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
         
            <div className="px-8 py-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">
                {isVerifying ? 'Verify Your Email' : (isSignup ? 'Create Account' : 'Welcome Back')}
              </h2>
              <p className="text-white/80 mt-1">
                {isVerifying 
                  ? 'Enter the 6-digit code sent to your email'
                  : isSignup 
                    ? 'Join our learning community today'
                    : 'Sign in to continue your learning journey'}
              </p>
            </div>
            <div className="px-8 py-6">
              <AnimatePresence mode="wait">
                {isVerifying ? (
                  <motion.div
                    key="verify"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Verification Code
                      </label>
                      <div className="relative">
                        <FiShield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white/10 text-white placeholder-white/50"
                          maxLength="6"
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                    
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleVerify}
                      disabled={isLoading}
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center ${
                        isLoading 
                          ? 'bg-blue-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                      }`}
                    >
                      {isLoading ? (
                        <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <FiCheckCircle className="inline w-5 h-5 mr-2" />
                          Verify Email
                        </>
                      )}
                    </motion.button>
                    
                    <div className="text-center space-y-3 pt-2">
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={isLoading}
                        className="text-blue-200 hover:text-blue-100 text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                      >
                        Didn't receive a code? Resend
                      </button>
                      <div className="h-px bg-white/10 w-full"></div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsVerifying(false);
                          setIsSignup(false);
                          setUser({ username: '', email: '', password: '', confirmPassword: '' });
                          setVerificationCode('');
                          setSignupEmail('');
                          setRole('student');
                        }}
                        className="text-white/80 hover:text-white text-sm font-medium transition-colors duration-200"
                      >
                        Back to Sign In
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="auth"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    {/* Role selection */}
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        I am a
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                          className="w-full flex items-center justify-between pl-3 pr-4 py-3 border border-white/20 rounded-lg bg-white/10 text-white text-left"
                        >
                          <div className="flex items-center">
                            <FiUser className="w-5 h-5 text-blue-300 mr-2" />
                            <span>{roleOptions.find(r => r.value === role)?.label}</span>
                          </div>
                          <FiChevronDown className={`w-5 h-5 transition-transform duration-200 ${isRoleDropdownOpen ? 'transform rotate-180' : ''}`} />
                        </button>
                        
                        {isRoleDropdownOpen && (
                          <div className="absolute z-10 mt-1 w-full rounded-lg bg-gray-800 border border-white/10 shadow-lg overflow-hidden">
                            {roleOptions.map((option) => (
                              <div 
                                key={option.value}
                                onClick={() => {
                                  setRole(option.value);
                                  setIsRoleDropdownOpen(false);
                                }}
                                className={`px-4 py-3 cursor-pointer hover:bg-gray-700 transition-colors ${
                                  role === option.value ? 'bg-gray-700' : ''
                                }`}
                              >
                                <div className="font-medium text-white">{option.label}</div>
                                <div className="text-xs text-white/60 mt-1">{option.description}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Username field for signup */}
                    {isSignup && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Username
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                          <input
                            type="text"
                            placeholder="Choose a username"
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white/10 text-white placeholder-white/50"
                          />
                        </div>
                      </motion.div>
                    )}
              
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={user.email}
                          onChange={(e) => setUser({ ...user, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white/10 text-white placeholder-white/50"
                        />
                      </div>
                    </div>
                    
                    {/* Password field */}
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder={isSignup ? "Create a password (min 8 chars)" : "Enter your password"}
                          value={user.password}
                          onChange={(e) => setUser({ ...user, password: e.target.value })}
                          className="w-full pl-10 pr-10 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white/10 text-white placeholder-white/50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-200 transition-colors"
                        >
                          {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
 
                    {isSignup && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={user.confirmPassword}
                            onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                            className="w-full pl-10 pr-10 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white/10 text-white placeholder-white/50"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-200 transition-colors"
                          >
                            {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                          </button>
                        </div>
                      </motion.div>
                    )}
                    
                  
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={isSignup ? handleSignup : handleLogin}
                      disabled={isLoading}
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center ${
                        isLoading 
                          ? 'bg-blue-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                      }`}
                    >
                      {isLoading ? (
                        <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <>
                          {isSignup ? 'Create Account' : 'Sign In'}
                          <FiArrowRight className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignup(!isSignup);
                          setUser({ ...user, username: '', confirmPassword: '' });
                        }}
                        disabled={isLoading}
                        className="text-blue-200 hover:text-blue-100 text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                      >
                        {isSignup 
                          ? 'Already have an account? Sign In' 
                          : 'New to eLearn? Create an account'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Auth;