import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Coffee, Croissant, Cake } from 'lucide-react';

type MenuItem = {
  menu_id: number;
  menu_name: string;
  menu_description: string;
  menu_price: number;
  menu_image_path: string;
};

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching menu:', err);
        setLoading(false);
      });
  }, []);

  const categories = ['All', 'Coffee', 'Pastry', 'Dessert'];

  const filteredMenu = menuItems.filter(item => {
    const matchesSearch = item.menu_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.menu_description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Simple category matching based on name/description for this demo
    // In a real app, you'd have a category field in the DB
    const matchesCategory = activeCategory === 'All' || 
                            (activeCategory === 'Coffee' && (item.menu_name.toLowerCase().includes('coffee') || item.menu_name.toLowerCase().includes('espresso') || item.menu_name.toLowerCase().includes('latte') || item.menu_name.toLowerCase().includes('mocha') || item.menu_name.toLowerCase().includes('brew') || item.menu_name.toLowerCase().includes('americano') || item.menu_name.toLowerCase().includes('macchiato') || item.menu_name.toLowerCase().includes('cappuccino'))) ||
                            (activeCategory === 'Pastry' && (item.menu_name.toLowerCase().includes('croissant') || item.menu_name.toLowerCase().includes('muffin'))) ||
                            (activeCategory === 'Dessert' && (item.menu_name.toLowerCase().includes('cake') || item.menu_name.toLowerCase().includes('affogato')));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-stone-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-serif font-bold text-stone-900 mb-4"
          >
            Our <span className="text-amber-600 italic">Menu</span>
          </motion.h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Discover our carefully curated selection of artisanal coffees, freshly baked pastries, and delightful desserts.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex space-x-2 overflow-x-auto pb-2 w-full md:w-auto hide-scrollbar">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                  activeCategory === category 
                    ? 'bg-amber-600 text-white shadow-md' 
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-stone-400" />
          </div>
        </div>

        {/* Menu Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMenu.map((item, index) => (
              <motion.div
                key={item.menu_id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-shadow group"
              >
                <div className="h-48 bg-stone-200 relative overflow-hidden">
                  {item.menu_image_path ? (
                    <img 
                      src={item.menu_image_path} 
                      alt={item.menu_name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400">
                      <Coffee className="h-12 w-12 opacity-20" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-bold text-amber-700 shadow-sm">
                    {item.menu_price} Ks
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">{item.menu_name}</h3>
                  <p className="text-stone-600 text-sm line-clamp-3 leading-relaxed">
                    {item.menu_description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredMenu.length === 0 && (
          <div className="text-center py-20">
            <Coffee className="h-16 w-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-2xl font-serif text-stone-500">No items found</h3>
            <p className="text-stone-400 mt-2">Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
