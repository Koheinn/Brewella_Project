import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

type Booking = {
  booking_id: number;
  booking_date: string;
  booking_time: string;
  guest_count: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  special_request: string;
  status: string;
  table_number: string;
  area: string;
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        toast.success(`Booking status updated to ${status}`);
        fetchBookings();
      } else {
        toast.error('Failed to update booking status');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Booking Management</h1>
          <p className="text-stone-600">View and manage table reservations.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-600 text-sm uppercase tracking-wider border-b border-stone-200">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Date & Time</th>
                <th className="p-4 font-medium">Table Info</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-500">Loading bookings...</td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-500">No bookings found.</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.booking_id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-4 text-stone-500 text-sm">#{booking.booking_id}</td>
                    <td className="p-4">
                      <div className="font-medium text-stone-900">{booking.customer_name}</div>
                      <div className="text-xs text-stone-500">{booking.customer_phone}</div>
                      <div className="text-xs text-stone-500">{booking.customer_email}</div>
                      {booking.special_request && (
                        <div className="text-xs text-amber-600 mt-1 italic max-w-xs truncate">
                          Note: {booking.special_request}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-stone-900 font-medium">
                        <Calendar className="h-4 w-4 text-amber-500" />
                        {format(new Date(booking.booking_date), 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center gap-1 text-stone-600 text-sm mt-1">
                        <Clock className="h-4 w-4" />
                        {booking.booking_time}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-stone-900 font-medium">
                        <MapPin className="h-4 w-4 text-amber-500" />
                        Table {booking.table_number}
                      </div>
                      <div className="flex items-center gap-1 text-stone-600 text-sm mt-1">
                        <User className="h-4 w-4" />
                        {booking.guest_count} Guests
                      </div>
                      <div className="text-xs text-stone-500 mt-1">{booking.area}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                        booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'Checked-in' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.booking_id, e.target.value)}
                        className="text-sm border-stone-300 rounded-lg shadow-sm focus:ring-amber-500 focus:border-amber-500 py-1.5 pl-3 pr-8 bg-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Checked-in">Checked-in</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
