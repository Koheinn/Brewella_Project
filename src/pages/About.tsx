import { motion } from 'motion/react';
import { Coffee, Heart, Users, Leaf, Star, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-stone-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-6"
          >
            Our <span className="text-amber-600 italic">Story</span>
          </motion.h1>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
            Brewella isn't just a coffee shop; it's a community hub where passion for exceptional coffee meets genuine hospitality.
          </p>
        </div>

        {/* The Journey */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
              alt="Coffee beans roasting" 
              className="rounded-3xl shadow-2xl object-cover h-[500px] w-full"
            />
            <div className="absolute -bottom-10 -right-10 bg-amber-600 text-white p-8 rounded-3xl shadow-xl hidden md:block">
              <p className="text-4xl font-bold font-serif mb-2">10+</p>
              <p className="text-amber-100 font-medium tracking-wider uppercase text-sm">Years of Excellence</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-serif font-bold text-stone-900">From a Small Cart to a Beloved Destination</h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              Founded in 2015 by two coffee enthusiasts, Brewella began as a humble espresso cart at the local farmers' market. Our commitment to sourcing the finest beans and perfecting the roasting process quickly garnered a loyal following.
            </p>
            <p className="text-lg text-stone-600 leading-relaxed">
              Today, Brewella stands as a testament to that original vision. We've grown into a full-service café, but our core values remain unchanged: quality, community, and sustainability. Every cup we serve is a reflection of our journey and our dedication to the craft.
            </p>
            <div className="pt-6 border-t border-stone-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-stone-200 rounded-full overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Founder" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-stone-900 text-lg">David Chen</p>
                  <p className="text-amber-600 font-medium">Co-Founder & Head Roaster</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Core Values */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Our <span className="text-amber-600 italic">Values</span></h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Coffee, title: "Quality First", desc: "We never compromise on the quality of our beans or our brewing methods." },
              { icon: Users, title: "Community", desc: "Creating a welcoming space where everyone feels at home." },
              { icon: Leaf, title: "Sustainability", desc: "Ethically sourced beans and eco-friendly practices in everything we do." },
              { icon: Heart, title: "Passion", desc: "Pouring love and dedication into every single cup we serve." }
            ].map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 text-center hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-16 h-16 mx-auto bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-600 transform rotate-3">
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">{value.title}</h3>
                <p className="text-stone-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Meet the <span className="text-amber-600 italic">Team</span></h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              The passionate individuals behind your daily cup of joy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { name: "Elena Rodriguez", role: "Head Barista", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
              { name: "Marcus Johnson", role: "Pastry Chef", img: "https://images.unsplash.com/photo-1627161683077-e34782c24d81?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
              { name: "Sarah Williams", role: "Store Manager", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" }
            ].map((member, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="group relative overflow-hidden rounded-3xl"
              >
                <img src={member.img} alt={member.name} className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-amber-400 font-medium">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
