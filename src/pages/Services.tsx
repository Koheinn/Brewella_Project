import { motion, AnimatePresence } from 'motion/react';
import { Coffee, Briefcase, Cake, Truck, Users, Calendar, X } from 'lucide-react';
import { useState } from 'react';

type Service = {
  icon: any;
  title: string;
  desc: string;
  img: string;
  details: string;
};

export default function Services() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const services: Service[] = [
    {
      icon: Coffee,
      title: "In-House Café",
      desc: "Enjoy our full menu of artisanal coffees, teas, and freshly baked pastries in our cozy, welcoming atmosphere.",
      img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      details: "Our café offers a warm and inviting space where you can relax, work, or meet with friends. We serve a wide variety of specialty coffee drinks made by our expert baristas, along with premium teas and fresh pastries baked daily. Free WiFi, comfortable seating, and a peaceful ambiance make it the perfect spot for any occasion. Open daily from 7 AM to 9 PM."
    },
    {
      icon: Briefcase,
      title: "Corporate Catering",
      desc: "Elevate your next meeting or office event with our premium coffee and pastry catering.",
      img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      details: "We provide full-service catering for corporate events, meetings, and conferences. Our packages include freshly brewed coffee, espresso drinks, a selection of teas, and an assortment of pastries and snacks. We handle setup, service, and cleanup, allowing you to focus on your event. Customizable packages available for groups of 10 to 500+. Contact us for a quote."
    },
    {
      icon: Cake,
      title: "Custom Orders",
      desc: "Need a special cake or a large order of pastries for a celebration? Our artisan bakers can create custom treats.",
      img: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      details: "Our talented bakers specialize in creating custom cakes, cupcakes, and pastries for weddings, birthdays, and special occasions. We work with you to design the perfect dessert that matches your vision and dietary needs. We accommodate gluten-free, vegan, and other dietary restrictions. Orders require at least 48 hours notice. Schedule a consultation to discuss your ideas."
    },
    {
      icon: Truck,
      title: "Wholesale Coffee",
      desc: "We supply our freshly roasted, ethically sourced beans to local businesses, restaurants, and offices.",
      img: "https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      details: "Partner with Brewella to serve exceptional coffee at your establishment. We offer wholesale pricing on our premium, ethically sourced coffee beans, roasted fresh weekly. Our team provides training, equipment recommendations, and ongoing support to ensure you're serving the best coffee possible. Flexible delivery schedules and competitive pricing. Minimum order quantities apply."
    },
    {
      icon: Users,
      title: "Barista Training",
      desc: "Join our expert baristas for hands-on training sessions. Learn the art of espresso extraction, milk texturing, and latte art.",
      img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      details: "Our comprehensive barista training program covers everything from coffee basics to advanced techniques. Learn proper espresso extraction, milk steaming and texturing, latte art, coffee tasting, and equipment maintenance. Classes are available for beginners and experienced baristas looking to refine their skills. Private and group sessions available. Certificate provided upon completion."
    },
    {
      icon: Calendar,
      title: "Private Events",
      desc: "Host your next private event, workshop, or gathering in our beautiful café space after hours.",
      img: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      details: "Our café transforms into an elegant private venue for your special events. Perfect for birthday parties, bridal showers, corporate workshops, book clubs, and more. We offer customizable food and beverage packages, AV equipment, and dedicated staff to ensure your event runs smoothly. Capacity up to 50 guests. Available evenings and weekends. Book at least 2 weeks in advance."
    }
  ];

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
          {services.map((service, i) => (
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
                <button 
                  onClick={() => setSelectedService(service)}
                  className="text-amber-600 font-semibold hover:text-amber-700 transition-colors flex items-center gap-2"
                >
                  Learn More <span className="text-xl leading-none">&rarr;</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Service Details Modal */}
        <AnimatePresence>
          {selectedService && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedService(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="relative h-64 overflow-hidden rounded-t-3xl">
                  <img src={selectedService.img} alt={selectedService.title} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setSelectedService(null)}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                  >
                    <X className="h-6 w-6 text-stone-900" />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-sm text-amber-600">
                    <selectedService.icon className="h-8 w-8" />
                  </div>
                </div>
                <div className="p-8">
                  <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">{selectedService.title}</h2>
                  <p className="text-stone-600 leading-relaxed text-lg">{selectedService.details}</p>
                  <div className="mt-8 pt-6 border-t border-stone-100">
                    <a
                      href="mailto:hello@brewella.com"
                      className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                      Get in Touch
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
