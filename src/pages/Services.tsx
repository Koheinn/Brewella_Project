import { motion } from 'motion/react';
import { Coffee, Briefcase, Cake, Truck, Users, Calendar } from 'lucide-react';

export default function Services() {
  return (
    <div className="bg-stone-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-6"
          >
            Our <span className="text-amber-600 italic">Services</span>
          </motion.h1>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
            Beyond your daily cup, we offer a range of services designed to bring the Brewella experience to you, wherever you are.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              icon: Coffee,
              title: "In-House Café",
              desc: "Enjoy our full menu of artisanal coffees, teas, and freshly baked pastries in our cozy, welcoming atmosphere. Perfect for catching up with friends or finding a quiet corner to read.",
              img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
              icon: Briefcase,
              title: "Corporate Catering",
              desc: "Elevate your next meeting or office event with our premium coffee and pastry catering. We provide everything you need to keep your team energized and focused.",
              img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
              icon: Cake,
              title: "Custom Orders",
              desc: "Need a special cake or a large order of pastries for a celebration? Our artisan bakers can create custom treats tailored to your specific needs and dietary requirements.",
              img: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
              icon: Truck,
              title: "Wholesale Coffee",
              desc: "We supply our freshly roasted, ethically sourced beans to local businesses, restaurants, and offices. Partner with us to serve exceptional coffee to your own customers.",
              img: "https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
              icon: Users,
              title: "Barista Training",
              desc: "Passionate about coffee? Join our expert baristas for hands-on training sessions. Learn the art of espresso extraction, milk texturing, and latte art.",
              img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
              icon: Calendar,
              title: "Private Events",
              desc: "Host your next private event, workshop, or gathering in our beautiful café space after hours. We offer customizable packages to suit your event's unique needs.",
              img: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            }
          ].map((service, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 group hover:shadow-xl transition-all duration-300"
            >
              <div className="h-48 overflow-hidden relative">
                <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-stone-900/10 transition-colors"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-sm text-amber-600">
                  <service.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4 group-hover:text-amber-600 transition-colors">{service.title}</h3>
                <p className="text-stone-600 leading-relaxed mb-6">{service.desc}</p>
                <button className="text-amber-600 font-semibold hover:text-amber-700 transition-colors flex items-center gap-2">
                  Learn More <span className="text-xl leading-none">&rarr;</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-24 bg-stone-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80" alt="Coffee background" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl font-serif font-bold mb-6">Interested in our services?</h2>
            <p className="text-lg text-stone-300 mb-8">
              Whether you're planning an event, looking for wholesale coffee, or want to learn the art of the perfect pour, we're here to help.
            </p>
            <a href="mailto:hello@brewella.com" className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-amber-500/30">
              Contact Us Today
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
