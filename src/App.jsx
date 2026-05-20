import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import Courses from './pages/courses/Courses'
import CourseDetail from './pages/courses/CourseDetail'
import Bookings from './pages/bookings/Bookings'
import Zones from './pages/zones/Zones'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/zones" element={<Zones />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App