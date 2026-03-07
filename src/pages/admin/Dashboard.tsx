import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Users, Coffee, Calendar, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    menuItems: 0,
    bookings: 0,
    issues: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd have a dedicated endpoint for dashboard stats
    // For now, we'll just fetch the counts from the other endpoints
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [usersRes, menuRes, bookingsRes, issuesRes] = await Promise.all([
          fetch('/api/admin/users', { headers }),
          fetch('/api/menu'),
          fetch('/api/admin/bookings', { headers }),
          fetch('/api/admin/issues', { headers })
        ]);

        const users = await usersRes.json();
        const menu = await menuRes.json();
        const bookings = await bookingsRes.json();
        const issues = await issuesRes.json();

        setStats({
          users: users.length || 0,
          menuItems: menu.length || 0,
          bookings: bookings.length || 0,
          issues: issues.length || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats.users, icon: Users, color: 'bg-blue-500' },
    { title: 'Menu Items', value: stats.menuItems, icon: Coffee, color: 'bg-amber-500' },
    { title: 'Total Bookings', value: stats.bookings, icon: Calendar, color: 'bg-green-500' },
    { title: 'Reported Issues', value: stats.issues, icon: AlertCircle, color: 'bg-red-500' }
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-stone-900">Dashboard Overview</h1>
        <p className="text-stone-600">Welcome to the Brewella Admin Panel.</p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading stats...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 flex items-center gap-4">
              <div className={`${stat.color} text-white p-4 rounded-xl`}>
                <stat.icon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-500">{stat.title}</p>
                <p className="text-3xl font-bold text-stone-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
