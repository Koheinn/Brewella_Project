import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Coffee, Clock, MapPin } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80" 
            alt="Coffee Shop Interior" 
            className="w-full h-full object-cover filter brightness-50"
          />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight"
          >
            Experience the Art of <span className="text-amber-500 italic">Coffee</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-10 text-stone-200 font-light"
          >
            Crafted with passion, served with love. Your daily escape in every cup.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/menu" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-amber-500/30 flex items-center justify-center gap-2">
              Explore Menu <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/book-table" className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-full font-semibold transition-all flex items-center justify-center">
              Book a Table
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-white shadow-sm border border-stone-100"
            >
              <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <Coffee className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4 text-stone-800">Premium Beans</h3>
              <p className="text-stone-600 leading-relaxed">
                We source only the finest Arabica beans from sustainable farms around the world, roasted to perfection.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-white shadow-sm border border-stone-100"
            >
              <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4 text-stone-800">Freshly Baked</h3>
              <p className="text-stone-600 leading-relaxed">
                Our pastries and breads are baked fresh every morning by our artisan bakers.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-white shadow-sm border border-stone-100"
            >
              <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4 text-stone-800">Cozy Atmosphere</h3>
              <p className="text-stone-600 leading-relaxed">
                A warm, inviting space designed for you to relax, work, or catch up with friends.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-stone-900 text-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1447&q=80" 
                alt="Barista making coffee" 
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Our <span className="text-amber-500 italic">Story</span></h2>
              <p className="text-lg text-stone-400 mb-6 leading-relaxed">
                Founded in 2015, Brewella started with a simple mission: to serve exceptional coffee in a space that feels like home. What began as a small cart has grown into a beloved community hub.
              </p>
              <p className="text-lg text-stone-400 mb-8 leading-relaxed">
                We believe that every cup tells a story, from the farmers who grew the beans to the barista who crafted your drink. Join us in celebrating the rich, complex world of specialty coffee.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 text-amber-500 font-semibold hover:text-amber-400 transition-colors">
                Read Full Story <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">What Our <span className="text-amber-600 italic">Guests</span> Say</h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Jenkins", text: "The best flat white I've had outside of Melbourne. The atmosphere is perfect for getting work done or reading a book." },
              { name: "Michael Chen", text: "Their freshly baked croissants are to die for! I come here every Sunday morning without fail. Highly recommend the hazelnut latte." },
              { name: "Emily Rodriguez", text: "Such a cozy spot with incredibly friendly staff. They always remember my order and make me feel welcome." }
            ].map((review, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 relative"
              >
                <div className="flex text-amber-500 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-5 w-5 fill-current" />)}
                </div>
                <p className="text-stone-600 italic mb-6">"{review.text}"</p>
                <p className="font-semibold text-stone-900">— {review.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
