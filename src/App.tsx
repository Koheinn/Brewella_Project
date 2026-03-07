import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Menu from './pages/Menu';
import BookTable from './pages/BookTable';
import News from './pages/News';
import ReportIssue from './pages/ReportIssue';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminMenu from './pages/admin/Menu';
import AdminBookings from './pages/admin/Bookings';
import AdminIssues from './pages/admin/Issues';
import AdminPosts from './pages/admin/Posts';
import { AuthProvider } from './context/AuthContext';

const PublicLayout = () => (
  <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/book-table" element={<BookTable />} />
            <Route path="/news" element={<News />} />
            <Route path="/report-issue" element={<ReportIssue />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/menu" element={<AdminMenu />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/issues" element={<AdminIssues />} />
          <Route path="/admin/posts" element={<AdminPosts />} />
        </Routes>
        <Toaster position="top-center" />
      </Router>
    </AuthProvider>
  );
}
