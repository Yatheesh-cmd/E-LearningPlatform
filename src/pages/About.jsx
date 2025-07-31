import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { auth, role } = useContext(AuthContext);
  // Determine the path for the "Join Free" button
  const joinFreePath = auth && role === 'student' ? '/' : '/login';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Hero Section - Now more prominent */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Transforming Education <span className="block">Through Innovation</span>
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                eLearnPlatform bridges the gap between traditional learning and digital education, 
                offering cutting-edge tools for students and educators worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/courses"
                  className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition duration-300 shadow-lg"
                >
                  Browse Courses
                </Link>
                <Link
                  to={joinFreePath}
                  className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-indigo-600 transition duration-300"
                >
                  Join Free
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                alt="Students learning online"
                className="w-full h-auto rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-yellow-400 text-gray-900 p-4 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">10,000+</div>
                <div className="text-sm">Happy Students</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white -mt-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
              <div className="text-gray-600">Online Courses</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="text-4xl font-bold text-indigo-600 mb-2">200+</div>
              <div className="text-gray-600">Expert Instructors</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="text-4xl font-bold text-indigo-600 mb-2">1M+</div>
              <div className="text-gray-600">Enrollments</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="text-4xl font-bold text-indigo-600 mb-2">95%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600">
              We believe education should be accessible, engaging, and tailored to individual needs. 
              Our platform combines the best of technology and pedagogy to create transformative 
              learning experiences that empower people to achieve their goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="text-indigo-600 text-4xl mb-4">🌍</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Global Reach</h3>
              <p className="text-gray-600">
                Serving learners in 150+ countries with localized content and multilingual support.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="text-indigo-600 text-4xl mb-4">💡</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Innovative Learning</h3>
              <p className="text-gray-600">
                AI-powered recommendations, interactive simulations, and adaptive learning paths.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="text-indigo-600 text-4xl mb-4">🤝</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Community Focus</h3>
              <p className="text-gray-600">
                Collaborative learning spaces, peer mentoring, and instructor Q&A sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

    
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Why Learners Choose Us</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Interactive Learning"
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Interactive Learning Experience</h3>
              <p className="text-lg text-gray-600 mb-6">
                Our courses go beyond static videos with hands-on labs, coding exercises, 
                and real-world projects that help you apply what you learn immediately.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Interactive coding environments</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Gamified learning paths</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Peer-to-peer collaboration tools</span>
                </li>
              </ul>
            </div>
          </div>
          
         
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="lg:order-1">
              <img
                src="https://cdn.elearningindustry.com/wp-content/uploads/2019/07/the-benefits-of-elearning.jpg"
                alt="eLearning Benefits"
                className="w-full h-auto rounded-2xl shadow-lg object-cover"
              />
            </div>
            <div className="lg:order-2">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">The Future of Education</h3>
              <p className="text-lg text-gray-600 mb-6">
                Our platform harnesses the power of digital learning to provide flexible, 
                personalized education that fits your lifestyle and learning preferences.
              </p>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">Accelerated Learning</h4>
                    <p className="text-gray-600 mt-1">Learn at your own pace with our adaptive technology</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">Proven Results</h4>
                    <p className="text-gray-600 mt-1">Students achieve 40% better retention rates</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">Global Community</h4>
                    <p className="text-gray-600 mt-1">Connect with learners from around the world</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student Support Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://img.freepik.com/premium-vector/teenage-boy-with-worried-exam-vector-illustration_851674-86855.jpg"
                alt="Student Support"
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Comprehensive Student Support</h3>
              <p className="text-lg text-gray-600 mb-6">
                We understand the challenges of learning, which is why we offer unparalleled support 
                to help you overcome obstacles and succeed in your educational journey.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="text-indigo-600 text-2xl mb-3">24/7</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Tutor Assistance</h4>
                  <p className="text-gray-600 text-sm">Get help whenever you need it from our expert tutors</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="text-indigo-600 text-2xl mb-3">1:1</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Mentorship</h4>
                  <p className="text-gray-600 text-sm">Personalized guidance from industry professionals</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="text-indigo-600 text-2xl mb-3">100+</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Study Groups</h4>
                  <p className="text-gray-600 text-sm">Collaborate with peers in your field of study</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="text-indigo-600 text-2xl mb-3">Career</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Services</h4>
                  <p className="text-gray-600 text-sm">Resume reviews, interview prep, and job placement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Join thousands of students who are advancing their careers with our courses. 
            Start your learning journey today with a 7-day free trial.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition duration-300 shadow-lg"
            >
              Sign Up Free
            </Link>
            <Link
              to={joinFreePath}
              className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
            >
              Join Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;