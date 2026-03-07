import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Calendar, Clock, Users, MessageSquare, User, Phone, Mail, MapPin, Coffee } from 'lucide-react';

type CafeTable = {
  table_id: number;
  table_number: string;
  capacity: number;
  area: string;
};

export default function BookTable() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tables, setTables] = useState<CafeTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    table_id: '',
    booking_date: '',
    booking_time: '',
    guest_count: 1,
    customer_name: user ? `${user.first_name} ${user.last_name}` : '',
    customer_phone: '',
    customer_email: user ? user.email : '',
    special_request: ''
  });

  useEffect(() => {
    fetch('/api/tables')
      .then(res => res.json())
      .then(data => {
        setTables(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching tables:', err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book a table');
      navigate('/login', { state: { from: '/book-table' } });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success('Table booked successfully!');
        navigate('/profile');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to book table');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Get unique areas for filtering
  const areas = Array.from(new Set(tables.map(t => t.area)));

  return (
    <div className="bg-stone-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-serif font-bold text-stone-900 mb-4"
          >
            Reserve Your <span className="text-amber-600 italic">Table</span>
          </motion.h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Secure your spot at Brewella for a perfect coffee experience, meetings, or casual hangouts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Booking Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-8 bg-white p-8 rounded-3xl shadow-sm border border-stone-100"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Personal Details */}
                <div className="space-y-6">
                  <h3 className="text-xl font-serif font-semibold text-stone-800 border-b pb-2">Personal Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Full Name *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-stone-400" />
                      </div>
                      <input
                        type="text"
                        name="customer_name"
                        required
                        value={formData.customer_name}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-xl border-stone-300 shadow-sm focus:ring-amber-500 focus:border-amber-500 py-3 bg-stone-50"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Email Address *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-stone-400" />
                      </div>
                      <input
                        type="email"
                        name="customer_email"
                        required
                        value={formData.customer_email}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-xl border-stone-300 shadow-sm focus:ring-amber-500 focus:border-amber-500 py-3 bg-stone-50"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Phone Number *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-stone-400" />
                      </div>
                      <input
                        type="tel"
                        name="customer_phone"
                        required
                        value={formData.customer_phone}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-xl border-stone-300 shadow-sm focus:ring-amber-500 focus:border-amber-500 py-3 bg-stone-50"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>

                {/* Reservation Details */}
                <div className="space-y-6">
                  <h3 className="text-xl font-serif font-semibold text-stone-800 border-b pb-2">Reservation Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Date *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-stone-400" />
                      </div>
                      <input
                        type="date"
                        name="booking_date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.booking_date}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-xl border-stone-300 shadow-sm focus:ring-amber-500 focus:border-amber-500 py-3 bg-stone-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Time *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock className="h-5 w-5 text-stone-400" />
                        </div>
                        <input
                          type="time"
                          name="booking_time"
                          required
                          min="08:00"
                          max="22:00"
                          value={formData.booking_time}
                          onChange={handleChange}
                          className="pl-10 w-full rounded-xl border-stone-300 shadow-sm focus:ring-amber-500 focus:border-amber-500 py-3 bg-stone-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Guests *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Users className="h-5 w-5 text-stone-400" />
                        </div>
                        <input
                          type="number"
                          name="guest_count"
                          required
                          min="1"
                          max="20"
                          value={formData.guest_count}
                          onChange={handleChange}
                          className="pl-10 w-full rounded-xl border-stone-300 shadow-sm focus:ring-amber-500 focus:border-amber-500 py-3 bg-stone-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Select Table *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-stone-400" />
                      </div>
                      <select
                        name="table_id"
                        required
                        value={formData.table_id}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-xl border-stone-300 shadow-sm focus:ring-amber-500 focus:border-amber-500 py-3 bg-stone-50 appearance-none"
                      >
                        <option value="" disabled>Choose a table...</option>
                        {loading ? (
                          <option disabled>Loading tables...</option>
                        ) : (
                          areas.map(area => (
                            <optgroup key={area} label={area}>
                              {tables.filter(t => t.area === area).map(table => (
                                <option key={table.table_id} value={table.table_id} disabled={table.capacity < formData.guest_count}>
                                  Table {table.table_number} (Capacity: {table.capacity}) {table.capacity < formData.guest_count ? '- Too small' : ''}
                                </option>
                              ))}
                            </optgroup>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Special Requests (Optional)</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-stone-400" />
                  </div>
                  <textarea
                    name="special_request"
                    rows={4}
                    value={formData.special_request}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-xl border-stone-300 shadow-sm focus:ring-amber-500 focus:border-amber-500 py-3 bg-stone-50"
                    placeholder="Any allergies, special occasions, or specific seating preferences?"
                  ></textarea>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors disabled:opacity-70"
                >
                  {submitting ? 'Confirming Reservation...' : 'Confirm Reservation'}
                </button>
                {!user && (
                  <p className="text-center text-sm text-stone-500 mt-4">
                    You will be redirected to login before confirming.
                  </p>
                )}
              </div>
            </form>
          </motion.div>

          {/* Info Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-4 space-y-8"
          >
            <div className="bg-stone-900 text-stone-100 p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -top-10 opacity-10">
                <Coffee className="w-48 h-48" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-6 relative z-10">Booking Policy</h3>
              <ul className="space-y-4 relative z-10 text-stone-300">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                  <p>Reservations are held for 15 minutes past the booking time.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                  <p>For parties larger than 8, please contact us directly via phone.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                  <p>Cancellations must be made at least 2 hours in advance.</p>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100">
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-4">Need Help?</h3>
              <p className="text-stone-600 mb-6">Having trouble booking online? Give us a call and we'll sort it out for you.</p>
              <a href="tel:+15551234567" className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-amber-200 text-amber-700 rounded-xl font-medium hover:bg-amber-100 transition-colors">
                <Phone className="h-5 w-5" />
                (555) 123-4567
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
