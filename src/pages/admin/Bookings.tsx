import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';
import { Calendar, Clock, MapPin, User, Settings, Plus, Edit, Trash2 } from 'lucide-react';
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

type CafeTable = {
  table_id: number;
  table_number: string;
  capacity: number;
  area: string;
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tables, setTables] = useState<CafeTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showTableForm, setShowTableForm] = useState(false);
  const [editingTable, setEditingTable] = useState<CafeTable | null>(null);
  const [settings, setSettings] = useState({ opening_time: '08:00', closing_time: '22:00', shop_status: 'open' });
  const [tableForm, setTableForm] = useState({ table_number: '', capacity: 2, area: 'Main Hall' });

  useEffect(() => {
    fetchBookings();
    fetchTables();
    fetchSettings();
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

  const fetchTables = async () => {
    try {
      const res = await fetch('/api/tables');
      if (res.ok) {
        const data = await res.json();
        setTables(data);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        toast.success('Settings updated successfully');
        setShowSettings(false);
      } else {
        toast.error('Failed to update settings');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleTableSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTable ? `/api/admin/tables/${editingTable.table_id}` : '/api/admin/tables';
      const method = editingTable ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(tableForm)
      });
      if (res.ok) {
        toast.success(`Table ${editingTable ? 'updated' : 'created'} successfully`);
        setShowTableForm(false);
        setEditingTable(null);
        setTableForm({ table_number: '', capacity: 2, area: 'Main Hall' });
        fetchTables();
      } else {
        toast.error('Failed to save table');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleTableDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this table?')) return;
    try {
      const res = await fetch(`/api/admin/tables/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        toast.success('Table deleted successfully');
        fetchTables();
      } else {
        toast.error('Failed to delete table');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const editTable = (table: CafeTable) => {
    setEditingTable(table);
    setTableForm({ table_number: table.table_number, capacity: table.capacity, area: table.area });
    setShowTableForm(true);
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
        <div className="flex gap-2">
          <button onClick={() => setShowSettings(!showSettings)} className="bg-stone-600 text-white px-4 py-2 rounded-xl hover:bg-stone-700 transition-colors flex items-center gap-2">
            <Settings className="h-5 w-5" /> Shop Settings
          </button>
          <button onClick={() => { setShowTableForm(!showTableForm); setEditingTable(null); setTableForm({ table_number: '', capacity: 2, area: 'Main Hall' }); }} className="bg-amber-600 text-white px-4 py-2 rounded-xl hover:bg-amber-700 transition-colors flex items-center gap-2">
            <Plus className="h-5 w-5" /> Manage Tables
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 mb-8">
          <h2 className="text-xl font-bold text-stone-900 mb-4">Shop Settings</h2>
          <form onSubmit={handleSettingsUpdate} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Opening Time</label>
                <input type="time" value={settings.opening_time} onChange={(e) => setSettings({...settings, opening_time: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Closing Time</label>
                <input type="time" value={settings.closing_time} onChange={(e) => setSettings({...settings, closing_time: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Shop Status</label>
                <select value={settings.shop_status} onChange={(e) => setSettings({...settings, shop_status: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-stone-900 text-white px-6 py-2 rounded-xl hover:bg-stone-800 transition-colors">Save Settings</button>
            </div>
          </form>
        </div>
      )}

      {showTableForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 mb-8">
          <h2 className="text-xl font-bold text-stone-900 mb-4">{editingTable ? 'Edit' : 'Add'} Table</h2>
          <form onSubmit={handleTableSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Table Number</label>
                <input type="text" required value={tableForm.table_number} onChange={(e) => setTableForm({...tableForm, table_number: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Capacity</label>
                <input type="number" required min="1" value={tableForm.capacity} onChange={(e) => setTableForm({...tableForm, capacity: parseInt(e.target.value)})} className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Area</label>
                <input type="text" required value={tableForm.area} onChange={(e) => setTableForm({...tableForm, area: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setShowTableForm(false); setEditingTable(null); }} className="bg-stone-200 text-stone-700 px-6 py-2 rounded-xl hover:bg-stone-300 transition-colors">Cancel</button>
              <button type="submit" className="bg-stone-900 text-white px-6 py-2 rounded-xl hover:bg-stone-800 transition-colors">Save Table</button>
            </div>
          </form>
          <div className="mt-6">
            <h3 className="font-bold text-stone-900 mb-3">Existing Tables</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {tables.map(table => (
                <div key={table.table_id} className="border border-stone-200 rounded-xl p-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{table.table_number}</div>
                    <div className="text-xs text-stone-500">Capacity: {table.capacity} | {table.area}</div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => editTable(table)} className="text-blue-500 hover:text-blue-700 p-1"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => handleTableDelete(table.table_id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
