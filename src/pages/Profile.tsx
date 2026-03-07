import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Mail, Shield } from 'lucide-react';
import { format } from 'date-fns';

type Booking = {
  booking_id: number;
  booking_date: string;
  booking_time: string;
  guest_count: number;
  status: string;
  table_number: string;
  area: string;
};

export default function Profile() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('/api/bookings/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setBookings(data);
          setLoadingBookings(false);
        })
        .catch(err => {
          console.error('Error fetching bookings:', err);
          setLoadingBookings(false);
        });
    }
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="bg-stone-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">My Profile</h1>
          <p className="text-stone-600">Manage your account and view your reservations.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-serif font-bold text-amber-700">
                  {user.first_name[0]}{user.last_name[0]}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-center text-stone-900 mb-6">
                {user.first_name} {user.last_name}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-stone-600">
                  <Mail className="h-5 w-5 text-amber-500" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-stone-600">
                  <Shield className="h-5 w-5 text-amber-500" />
                  <span>Role: {user.user_role}</span>
                </div>
                <div className="flex items-center gap-3 text-stone-600">
                  <User className="h-5 w-5 text-amber-500" />
                  <span>Status: <span className="text-green-600 font-medium">{user.status}</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking History */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <h3 className="text-2xl font-serif font-bold text-stone-900 mb-6 border-b pb-4">My Reservations</h3>
              
              {loadingBookings ? (
                <div className="text-center py-8 text-stone-500">Loading reservations...</div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
                  <Calendar className="h-12 w-12 text-stone-300 mx-auto mb-3" />
                  <p className="text-stone-500">You don't have any reservations yet.</p>
                  <a href="/book-table" className="mt-4 inline-block text-amber-600 font-medium hover:text-amber-700">
                    Book a table now
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.booking_id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border border-stone-100 rounded-2xl hover:border-amber-200 transition-colors bg-stone-50/50">
                      <div className="space-y-2 mb-4 sm:mb-0">
                        <div className="flex items-center gap-2 font-semibold text-stone-900 text-lg">
                          <Calendar className="h-5 w-5 text-amber-500" />
                          {format(new Date(booking.booking_date), 'MMMM d, yyyy')}
                        </div>
                        <div className="flex items-center gap-4 text-stone-600 text-sm">
                          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {booking.booking_time}</span>
                          <span className="flex items-center gap-1"><User className="h-4 w-4" /> {booking.guest_count} Guests</span>
                          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Table {booking.table_number} ({booking.area})</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                          booking.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          booking.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-stone-100 text-stone-700'
                        }`}>
                          {booking.status}
                        </span>
                        <span className="text-xs text-stone-400">ID: #{booking.booking_id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
