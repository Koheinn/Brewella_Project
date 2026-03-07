import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Coffee, Menu as MenuIcon, X, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-stone-900 text-stone-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Coffee className="h-8 w-8 text-amber-500" />
              <span className="font-serif text-2xl font-bold tracking-wider">BREWELLA</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-amber-500 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-amber-500 transition-colors">About</Link>
            <Link to="/services" className="hover:text-amber-500 transition-colors">Services</Link>
            <Link to="/menu" className="hover:text-amber-500 transition-colors">Menu</Link>
            <Link to="/book-table" className="hover:text-amber-500 transition-colors">Book Table</Link>
            <Link to="/news" className="hover:text-amber-500 transition-colors">News</Link>
            <Link to="/report-issue" className="hover:text-amber-500 transition-colors">Report Issue</Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                {user.user_role === 'Admin' && (
                  <Link to="/admin" className="text-amber-500 hover:text-amber-400 font-semibold">Admin Panel</Link>
                )}
                <Link to="/profile" className="flex items-center gap-2 hover:text-amber-500">
                  <UserIcon className="h-5 w-5" />
                  <span>{user.first_name}</span>
                </Link>
                <button onClick={handleLogout} className="bg-stone-800 hover:bg-stone-700 px-4 py-2 rounded-md transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="hover:text-amber-500 transition-colors">Login</Link>
                <Link to="/register" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-stone-300 hover:text-white">
              {isOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-stone-800 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="block px-3 py-2 hover:bg-stone-700 rounded-md">Home</Link>
          <Link to="/about" className="block px-3 py-2 hover:bg-stone-700 rounded-md">About</Link>
          <Link to="/services" className="block px-3 py-2 hover:bg-stone-700 rounded-md">Services</Link>
          <Link to="/menu" className="block px-3 py-2 hover:bg-stone-700 rounded-md">Menu</Link>
          <Link to="/book-table" className="block px-3 py-2 hover:bg-stone-700 rounded-md">Book Table</Link>
          <Link to="/news" className="block px-3 py-2 hover:bg-stone-700 rounded-md">News</Link>
          <Link to="/report-issue" className="block px-3 py-2 hover:bg-stone-700 rounded-md">Report Issue</Link>
          
          {user ? (
            <>
              {user.user_role === 'Admin' && (
                <Link to="/admin" className="block px-3 py-2 text-amber-500 font-semibold">Admin Panel</Link>
              )}
              <Link to="/profile" className="block px-3 py-2 hover:bg-stone-700 rounded-md">Profile</Link>
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2 hover:bg-stone-700 rounded-md">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 hover:bg-stone-700 rounded-md">Login</Link>
              <Link to="/register" className="block px-3 py-2 bg-amber-600 text-white rounded-md mt-2">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
