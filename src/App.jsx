import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About'; 
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
          <Routes>
            <Route path="/" element={
              <>
                <Navbar />
                <Home />
              </>
            } />
            <Route path="/about" element={ 
              <>
                <Navbar />
                <About />
              </>
            } />
            <Route path="/login" element={<Auth />} />
            <Route path="/student" element={
              <>
                <Navbar />
                <StudentDashboard />
              </>
            } />
            <Route path="/instructor" element={
              <>
                <Navbar />
                <InstructorDashboard />
              </>
            } />
            <Route path="/admin" element={
              <>
                <Navbar />
                <AdminDashboard />
              </>
            } />
            <Route path="/courses" element={
              <>
                <Navbar />
                <Courses />
              </>
            } />
            <Route path="/courses/:id" element={
              <>
                <Navbar />
                <CourseDetails />
              </>
            } />
            <Route path="/progress" element={
              <>
                <Navbar />
                <Courses />
              </>
            } />
            <Route path="/analytics" element={
              <>
                <Navbar />
                <InstructorDashboard />
              </>
            } />
          </Routes>
          <ToastContainer 
            position="top-right" 
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;