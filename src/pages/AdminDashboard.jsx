import React, { useState, useEffect, useContext } from 'react';
import { getAllCoursesApi, approveCourseApi, rejectCourseApi, getStatsApi, manageUserApi } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Users, BookOpen, Award } from 'lucide-react';

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const { role } = useContext(AuthContext);

  useEffect(() => {
    if (role !== 'admin') return;
    const fetchData = async () => {
      try {
        const [coursesRes, statsRes] = await Promise.all([
          getAllCoursesApi('', '', true),
          getStatsApi(),
        ]);
        setCourses(coursesRes.data);
        setStats(statsRes.data);
        setUsers(statsRes.data.users);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchData();
  }, [role]);

  const handleApprove = async (id) => {
    try {
      await approveCourseApi(id);
      toast.success('Course approved');
      const response = await getAllCoursesApi('', '', true);
      setCourses(response.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectCourseApi(id);
      toast.success('Course rejected');
      const response = await getAllCoursesApi('', '', true);
      setCourses(response.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleManageUser = async (id, action) => {
    try {
      await manageUserApi(id, action);
      toast.success(`User ${action}ed`);
      const response = await getStatsApi();
      setUsers(response.data.users);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 lg:p-10">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">Admin Dashboard</h1>

     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-blue-50 rounded-2xl shadow-lg p-8 flex items-start space-x-6 hover:shadow-xl transition-shadow duration-300">
          <Users className="w-12 h-12 text-blue-600 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Total Users</h2>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
            <p className="text-sm text-gray-600 mt-2">Active users across all platforms, updated in real-time.</p>
          </div>
        </div>
        <div className="bg-green-50 rounded-2xl shadow-lg p-8 flex items-start space-x-6 hover:shadow-xl transition-shadow duration-300">
          <BookOpen className="w-12 h-12 text-green-600 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Popular Courses</h2>
            <p className="text-lg text-gray-900">{stats.popularCourses?.join(', ') || 'None'}</p>
            <p className="text-sm text-gray-600 mt-2">Top courses based on enrollment and engagement.</p>
          </div>
        </div>
        <div className="bg-purple-50 rounded-2xl shadow-lg p-8 flex items-start space-x-6 hover:shadow-xl transition-shadow duration-300">
          <Award className="w-12 h-12 text-purple-600 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Completion Rates</h2>
            <p className="text-3xl font-bold text-gray-900">{stats.completionRate || 0}%</p>
            <p className="text-sm text-gray-600 mt-2">Percentage of users completing their enrolled courses.</p>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-semibold text-gray-900 mb-8 tracking-tight">Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map(course => (
            <div
              key={course._id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Category: {course.category}</p>
                <p>Instructor: {course.instructor?.username || 'Unknown'}</p>
                <p>Status: <span className={`font-medium ${course.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>{course.status}</span></p>
              </div>
              {course.status === 'pending' && (
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => handleApprove(course._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(course._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full">No courses available</p>
        )}
      </div>

      <h2 className="text-3xl font-semibold text-gray-900 mt-12 mb-8 tracking-tight">Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div
            key={user._id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{user.username}</h3>
            <div className="text-sm text-gray-500 space-y-1">
              <p>Role: {user.role}</p>
              <p>Status: <span className={`font-medium ${user.isBanned ? 'text-red-600' : 'text-green-600'}`}>{user.isBanned ? 'Banned' : 'Active'}</span></p>
            </div>
            <button
              onClick={() => handleManageUser(user._id, user.isBanned ? 'unban' : 'ban')}
              className={`${user.isBanned ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white px-4 py-2 rounded-lg mt-6 transition-colors duration-200 w-full`}
            >
              {user.isBanned ? 'Unban' : 'Ban'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;