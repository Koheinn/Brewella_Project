import { Coffee, Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Coffee className="h-8 w-8 text-amber-500" />
              <span className="font-serif text-2xl font-bold tracking-wider">BREWELLA</span>
            </div>
            <p className="text-sm text-stone-400">
              Crafting perfect moments, one cup at a time. Experience the finest coffee and pastries in town.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-stone-400 hover:text-amber-500 transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-stone-400 hover:text-amber-500 transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-stone-400 hover:text-amber-500 transition-colors"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-amber-500 transition-colors">Our Story</a></li>
              <li><a href="/menu" className="hover:text-amber-500 transition-colors">Menu</a></li>
              <li><a href="/book-table" className="hover:text-amber-500 transition-colors">Reservations</a></li>
              <li><a href="/news" className="hover:text-amber-500 transition-colors">News & Events</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>123 Coffee Lane, Brew City, BC 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <span>hello@brewella.com</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Opening Hours</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span>8:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>9:00 AM - 11:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>9:00 AM - 9:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-stone-800 text-center text-sm text-stone-500">
          <p>&copy; {new Date().getFullYear()} Brewella Coffee Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
