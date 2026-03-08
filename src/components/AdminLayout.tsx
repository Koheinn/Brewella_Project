import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link, Outlet, useLocation } from 'react-router-dom';
import { Users, Coffee, Calendar, AlertCircle, LayoutDashboard, FileText, ArrowLeft } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user || user.user_role !== 'Admin') return <Navigate to="/" />;

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Menu', href: '/admin/menu', icon: Coffee },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Issues', href: '/admin/issues', icon: AlertCircle },
    { name: 'Posts', href: '/admin/posts', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-stone-900 text-white flex flex-col">
        <div className="p-6 border-b border-stone-800">
          <h2 className="text-2xl font-serif font-bold text-amber-500">Admin Panel</h2>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-stone-300 hover:bg-stone-800 hover:text-white mb-4 border-b border-stone-800 pb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive ? 'bg-amber-600 text-white' : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
