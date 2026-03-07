import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit, Image as ImageIcon } from 'lucide-react';

type MenuItem = {
  menu_id: number;
  menu_name: string;
  menu_description: string;
  menu_price: number;
  menu_image_path: string;
};

export default function AdminMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    menu_name: '',
    menu_description: '',
    menu_price: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        setMenuItems(data);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('menu_name', formData.menu_name);
    formDataToSend.append('menu_description', formData.menu_description);
    formDataToSend.append('menu_price', formData.menu_price);
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      if (res.ok) {
        toast.success('Menu item added successfully');
        setIsAdding(false);
        setFormData({ menu_name: '', menu_description: '', menu_price: '' });
        setImageFile(null);
        fetchMenu();
      } else {
        toast.error('Failed to add menu item');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        toast.success('Menu item deleted');
        fetchMenu();
      } else {
        toast.error('Failed to delete menu item');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Menu Management</h1>
          <p className="text-stone-600">Add, edit, or remove items from the menu.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
        >
          {isAdding ? 'Cancel' : <><Plus className="h-5 w-5" /> Add Item</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 mb-8">
          <h2 className="text-xl font-bold text-stone-900 mb-4">Add New Menu Item</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Item Name</label>
                <input
                  type="text"
                  name="menu_name"
                  required
                  value={formData.menu_name}
                  onChange={handleChange}
                  className="w-full rounded-xl border-stone-300 shadow-sm focus:ring-amber-500 focus:border-amber-500 py-2 px-3 bg-stone-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Price (Ks)</label>
                <input
                  type="number"
                  name="menu_price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.menu_price}
                  onChange={handleChange}
                  className="w-full rounded-xl border-stone-300 shadow-sm focus:ring-amber-500 focus:border-amber-500 py-2 px-3 bg-stone-50"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
              <textarea
                name="menu_description"
                required
                rows={3}
                value={formData.menu_description}
                onChange={handleChange}
                className="w-full rounded-xl border-stone-300 shadow-sm focus:ring-amber-500 focus:border-amber-500 py-2 px-3 bg-stone-50"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Image</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-stone-300 rounded-xl cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-colors">
                  <div className="flex flex-col items-center">
                    <ImageIcon className="h-8 w-8 text-stone-400" />
                    <span className="text-xs text-stone-500 mt-2">Upload</span>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
                {imageFile && <span className="text-sm text-stone-600">{imageFile.name}</span>}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
              >
                Save Item
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-600 text-sm uppercase tracking-wider border-b border-stone-200">
                <th className="p-4 font-medium w-20">Image</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Description</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-500">Loading menu...</td>
                </tr>
              ) : menuItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-500">No menu items found.</td>
                </tr>
              ) : (
                menuItems.map((item) => (
                  <tr key={item.menu_id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-lg bg-stone-200 overflow-hidden">
                        {item.menu_image_path ? (
                          <img src={item.menu_image_path} alt={item.menu_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-stone-900">{item.menu_name}</td>
                    <td className="p-4 text-stone-600 text-sm max-w-xs truncate">{item.menu_description}</td>
                    <td className="p-4 font-semibold text-amber-700">{item.menu_price} Ks</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(item.menu_id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
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
