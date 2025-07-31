import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiBookOpen,
  FiUsers,
  FiAward,
  FiTrendingUp,
  FiPlay,
  FiStar,
  FiCheck,
  FiCheckCircle,
  FiArrowRight,
  FiShield,
  FiGlobe,
  FiZap,
  FiCode,
  FiPenTool,
  FiBarChart2,
  FiBriefcase,
  FiUserPlus,
  FiLayers,
  FiMonitor,
  FiSmartphone,
  FiCloud,
  FiArrowLeft,
  FiArrowRight as FiArrowRightNav,
  FiBook,
  FiCodepen,
  FiDatabase
} from 'react-icons/fi';
import { FaChalkboardTeacher, FaGraduationCap, FaLaptopCode, FaBrain, FaYoutube } from 'react-icons/fa';
import { GiTeacher } from 'react-icons/gi';
import { BsGraphUp, BsShieldLock } from 'react-icons/bs';

function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const controls = useAnimation();

  const sections = [
    'hero',
    'stats',
    'about',
    'how-it-works',
    'categories',
    'youtube-classes',
    'features',
    'instructor',
    'testimonials',
    'cta'
  ];

  const scrollToSection = (index) => {
    const section = document.getElementById(sections[index]);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setCurrentSection(index);
    }
  };

  const AnimatedNumber = ({ end, duration = 2 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let startTime;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / (duration * 1000);
        if (progress < 1) {
          setCount(Math.floor(end * progress));
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };
      requestAnimationFrame(animate);
    }, [end, duration]);

    return <span>{count.toLocaleString()}</span>;
  };

  const features = [
    {
      icon: FaLaptopCode,
      title: "Interactive Courses",
      description: "Engaging multimedia content with hands-on projects and real-world applications.",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: FaChalkboardTeacher,
      title: "Expert Instructors",
      description: "Learn from industry leaders and certified professionals in your field.",
      color: "from-teal-500 to-blue-500"
    },
    {
      icon: FaGraduationCap,
      title: "Career Certificates",
      description: "Earn recognized credentials to showcase your skills to employers.",
      color: "from-purple-500 to-pink-400"
    },
    {
      icon: BsGraphUp,
      title: "Progress Analytics",
      description: "Track your learning journey with personalized insights and recommendations.",
      color: "from-blue-400 to-indigo-500"
    },
    {
      icon: FiMonitor,
      title: "Any Device Access",
      description: "Learn on your computer, tablet, or phone with our responsive platform.",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: FiGlobe,
      title: "Global Network",
      description: "Connect with peers worldwide through discussion forums and study groups.",
      color: "from-teal-400 to-blue-400"
    }
  ];

  const categories = [
    { icon: FiCode, label: "Web Development", color: "from-blue-500 to-purple-500" },
    { icon: FiPenTool, label: "UI/UX Design", color: "from-purple-500 to-pink-400" },
    { icon: BsGraphUp, label: "Digital Marketing", color: "from-pink-400 to-blue-400" },
    { icon: FiBriefcase, label: "Business Strategy", color: "from-blue-400 to-indigo-500" },
    { icon: FaBrain, label: "Personal Development", color: "from-indigo-500 to-blue-500" },
    { icon: BsShieldLock, label: "Cyber Security", color: "from-teal-400 to-blue-400" }
  ];

  const stats = [
    { number: 50000, label: "Active Learners", icon: FiUsers },
    { number: 1000, label: "Expert Courses", icon: FiBookOpen },
    { number: 98, label: "Satisfaction Rate", icon: FiStar, suffix: "%" },
    { number: 24, label: "Learning Support", icon: FiShield, suffix: "/7" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Senior Developer",
      content: "The hands-on projects helped me land a promotion within 3 months of completing the Full Stack course.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      role: "Marketing Director",
      content: "The digital marketing certification helped me transition careers and double my salary in a year.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      role: "UX Lead",
      content: "The design courses provided exactly the portfolio pieces I needed to land my dream job at a FAANG company.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const howItWorks = [
    {
      icon: FiUserPlus,
      title: "Create Account",
      desc: "Sign up in 30 seconds with email or social login"
    },
    {
      icon: FiBookOpen,
      title: "Find Your Course",
      desc: "Browse 1,000+ courses with personalized recommendations"
    },
    {
      icon: FiPlay,
      title: "Start Learning",
      desc: "Watch interactive lessons and complete hands-on projects"
    },
    {
      icon: FiAward,
      title: "Get Certified",
      desc: "Earn shareable certificates to showcase your new skills"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Navigation Arrows */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 z-50">
        <button
          onClick={() => scrollToSection(Math.max(0, currentSection - 1))}
          className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-all disabled:opacity-50"
          disabled={currentSection === 0}
        >
          <FiArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <button
          onClick={() => scrollToSection(Math.min(sections.length - 1, currentSection + 1))}
          className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-all disabled:opacity-50"
          disabled={currentSection === sections.length - 1}
        >
          <FiArrowRightNav className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Hero Section */}
      <section id="hero" className="relative bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <FiBook className="absolute top-10 left-10 w-24 h-24 text-blue-200 animate-pulse" />
          <FiCodepen className="absolute bottom-20 right-20 w-32 h-32 text-purple-200 animate-pulse animation-delay-1000" />
          <FiDatabase className="absolute top-1/3 left-1/4 w-28 h-28 text-teal-200 animate-pulse animation-delay-2000" />
          <FiStar className="absolute bottom-1/4 right-1/3 w-20 h-20 text-blue-200 animate-pulse animation-delay-3000" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight"
            >
              Unlock Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Potential</span> with eLearn
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-xl"
            >
              Master in-demand skills with our cutting-edge platform, designed to deliver real career impact through expert-led courses and hands-on projects.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/courses"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 hover:scale-105 transform"
              >
                <FiBookOpen className="w-6 h-6" />
                <span>Explore Courses</span>
              </Link>
              <Link
                to="/login"
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 hover:scale-105 transform"
              >
                <FiPlay className="w-6 h-6" />
                <span>Start Learning</span>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <FiCheckCircle className="w-6 h-6 text-blue-600" />
                <span className="text-gray-600 font-medium">Trusted by 100K+ learners</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiStar className="w-6 h-6 text-yellow-400 fill-current" />
                <span className="text-gray-600 font-medium">4.9/5 rating</span>
              </div>
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <motion.img 
              src="https://www.pngarts.com/files/7/Online-Learning-Education-PNG-Download-Image.png" 
              alt="Online Learning" 
              className="w-full h-auto object-contain max-w-md mx-auto"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 2, -2, 0],
                transition: {
                  y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                  rotate: { repeat: Infinity, duration: 5, ease: "easeInOut" }
                }
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-all"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    <AnimatedNumber end={stat.number} />{stat.suffix || ""}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* About Section with Image */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img 
              src="https://www.shutterstock.com/image-vector/digital-lecture-online-education-blank-260nw-1896594109.jpg" 
              alt="eLearning Platform" 
              className="rounded-2xl shadow-xl w-full h-auto border-8 border-white transform hover:scale-[1.02] transition-all duration-500"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg mr-3">
                  <FiCheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Trusted by</div>
                  <div className="text-blue-600 font-semibold">100+ Companies</div>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">The Future of <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Professional Learning</span></h2>
            <p className="text-lg text-gray-600 mb-6">
              eLearn is built on cutting-edge educational technology designed to deliver measurable career impact. Our platform combines world-class content with interactive learning tools to help you master new skills faster.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <FiZap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Personalized Learning Paths</h4>
                  <p className="text-gray-600">AI-powered recommendations based on your goals and skill level.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-lg mr-4">
                  <FiLayers className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Project-Based Curriculum</h4>
                  <p className="text-gray-600">Build real portfolio pieces while you learn with hands-on projects.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-teal-100 p-2 rounded-lg mr-4">
                  <FiSmartphone className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Mobile Optimized</h4>
                  <p className="text-gray-600">Learn anywhere with our iOS and Android apps featuring offline access.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Start Learning in <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">4 Simple Steps</span></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started today and begin your journey to career advancement.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorks.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-blue-200 group-hover:to-purple-200 transition-all">
                    <Icon className="w-8 h-8 text-blue-600 group-hover:text-purple-600 transition-all" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                  <div className="mt-6 text-4xl font-bold text-gray-100 absolute -bottom-4 -right-4 opacity-30 group-hover:opacity-50 transition-all">
                    0{idx + 1}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Categories Section */}
      <section id="categories" className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Popular <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Categories</span></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover courses across in-demand fields to boost your career.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className={`rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center bg-white border border-gray-100 hover:-translate-y-2 group`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-gradient-to-br ${cat.color} group-hover:shadow-lg transition-all`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{cat.label}</h3>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Browse All Categories
            </Link>
          </div>
        </div>
      </section>

      {/* YouTube Classes Section */}
     
      <section id="youtube" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Free <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">YouTube</span> Classes by eLearn
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our free YouTube tutorials offering expert-led lessons, practical examples, and hands-on projects to kickstart your learning journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://cdn.dribbble.com/userupload/22057406/file/original-102766353c43b90107b9bb69d981be3a.gif"
              alt="eLearn YouTube Classes"
              className="rounded-2xl shadow-xl w-full h-auto border-4 border-white transform hover:scale-[1.02] transition-all duration-500"
            />
           
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900">Learn with eLearn on YouTube</h3>
            <p className="text-lg text-gray-600">
              Our YouTube channel offers a wide range of free tutorials covering in-demand skills like web development, UI/UX design, digital marketing, and more. Each video is crafted by expert instructors to provide practical, actionable insights you can apply immediately.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-red-100 p-2 rounded-lg mr-4">
                  <FaYoutube className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Beginner-Friendly Content</h4>
                  <p className="text-gray-600">Step-by-step tutorials designed for all skill levels.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 p-2 rounded-lg mr-4">
                  <FaYoutube className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Practical Projects</h4>
                  <p className="text-gray-600">Build real-world projects to enhance your portfolio.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 p-2 rounded-lg mr-4">
                  <FaYoutube className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Regular Updates</h4>
                  <p className="text-gray-600">New content added weekly to keep you up-to-date.</p>
                </div>
              </li>
            </ul>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 transition-all duration-200"
            >
              <FaYoutube className="w-6 h-6 mr-2" />
              Subscribe to Our Channel
            </a>
          </motion.div>
        </div>
      </div>
    </section>
      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">eLearn</span> Stands Out</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform is designed to deliver real career results through innovative learning.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-10 transition-all`}></div>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto bg-gradient-to-br ${feature.color} shadow-md`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 relative z-10">{feature.title}</h3>
                  <p className="leading-relaxed text-gray-600 relative z-10">{feature.description}</p>
                  <div className="mt-6 relative z-10">
                    <Link 
                      to="#" 
                      className="text-sm font-medium text-blue-600 hover:text-purple-600 transition-colors inline-flex items-center"
                    >
                      Learn more <FiArrowRight className="ml-1" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Join as Instructor Section */}
      <section id="instructor" className="py-20 bg-gradient-to-r from-blue-600 via-teal-500 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Share Your Knowledge With The World</h2>
            <p className="text-xl text-white/90 mb-8">
              Join our network of expert instructors and reach millions of learners worldwide while earning competitive compensation.
            </p>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-white/20 p-3 rounded-lg mr-4">
                  <GiTeacher className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Flexible Teaching</h4>
                  <p className="text-white/80">Create courses on your schedule with our easy-to-use tools.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white/20 p-3 rounded-lg mr-4">
                  <FiCloud className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Global Reach</h4>
                  <p className="text-white/80">Teach students from 190+ countries around the world.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white/20 p-3 rounded-lg mr-4">
                  <FiTrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Earn Money</h4>
                  <p className="text-white/80">Get paid monthly based on student enrollment and engagement.</p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/login?role=instructor"
                className="bg-white hover:bg-gray-50 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <GiTeacher className="w-6 h-6" />
                <span>Become an Instructor</span>
              </Link>
              <Link
                to="/about"
                className="bg-transparent hover:bg-white/10 text-white border-2 border-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center space-x-2"
              >
                <span>Learn More</span>
                <FiArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-teal-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="relative z-10 bg-white p-6 rounded-2xl shadow-2xl border border-gray-200">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white">
                <h3 className="text-2xl font-bold mb-4">Instructor Benefits</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <FiCheckCircle className="w-6 h-6 text-teal-300 mr-3 flex-shrink-0" />
                    <span>Competitive earnings up to $5,000 per course</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="w-6 h-6 text-teal-300 mr-3 flex-shrink-0" />
                    <span>Professional course production support</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="w-6 h-6 text-teal-300 mr-3 flex-shrink-0" />
                    <span>Marketing and student acquisition</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="w-6 h-6 text-teal-300 mr-3 flex-shrink-0" />
                    <span>Analytics dashboard to track performance</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Stories</span></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from learners who transformed their careers with eLearn.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full mr-4 object-cover border-2 border-blue-100"
                  />
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-blue-500">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">{testimonial.rating}.0 rating</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
     <section id="cta" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Career?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join over 50,000 professionals who have accelerated their careers with eLearn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/courses"
                className="bg-white hover:bg-gray-50 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 hover:scale-105 transform"
              >
                <FiBookOpen className="w-6 h-6" />
                <span>Browse Courses</span>
              </Link>
              <Link
                to="/login"
                className="bg-transparent hover:bg-white/10 text-white border-2 border-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center space-x-2 hover:scale-105 transform"
              >
                <FiArrowRight className="w-6 h-6" />
                <span>Get Started Free</span>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center space-x-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img
                    key={i}
                    src={`https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <div className="text-blue-100 text-sm">
                <span className="font-semibold text-white">1,000+</span> people joined last week
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;