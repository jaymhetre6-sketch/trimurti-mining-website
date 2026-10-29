import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchServices } from '../../lib/supabase';
import { Service } from '../../types';
import { ArrowUpRight, Pickaxe, Building2, HardHat, Milestone, Shovel, Truck } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchServices().then(setServices);
  }, []);

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Pickaxe':
        return <Pickaxe className="w-6 h-6 text-[#FF6B18]" />;
      case 'Building2':
        return <Building2 className="w-6 h-6 text-[#FF6B18]" />;
      case 'HardHat':
        return <HardHat className="w-6 h-6 text-[#FF6B18]" />;
      case 'Milestone':
        return <Milestone className="w-6 h-6 text-[#FF6B18]" />;
      case 'Shovel':
        return <Shovel className="w-6 h-6 text-[#FF6B18]" />;
      case 'Truck':
        return <Truck className="w-6 h-6 text-[#FF6B18]" />;
      default:
        return <Pickaxe className="w-6 h-6 text-[#FF6B18]" />;
    }
  };

  return (
    <section id="services-overview" className="py-24 md:py-32 bg-[#171A20] text-[#F5F5F2] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-16 border-b border-white/[0.08]">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B18]" />
              <span className="text-xs font-bold tracking-[0.22em] text-[#FF6B18] uppercase">
                What We Do
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.08]">
              Capability <br />
              at <span className="italic font-light text-[#FF6B18]">scale.</span>
            </h2>
          </div>
          <p className="text-sm md:text-base text-[#B9C0C9] max-w-md font-light leading-relaxed">
            Integrated support across mining, infrastructure and civil construction—adapted to the ground realities of each assignment.
          </p>
        </div>

        {/* Services Grid (6 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-12">
          {services.map((service, idx) => (
            <motion.article
              key={service.id || service.order_num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: (idx % 3) * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative p-8 bg-[#111318] border border-white/[0.07] hover:border-[#FF6B18]/50 transition-all duration-300 flex flex-col justify-between h-full"
            >
              {/* Top Row: Service Number and Icon */}
              <div className="flex items-center justify-between pb-6">
                <span className="text-2xl font-black text-[#7A838E]/50 group-hover:text-[#FF6B18] transition-colors font-mono">
                  {service.order_num}
                </span>
                <div className="p-3 bg-white/[0.03] border border-white/10 group-hover:bg-[#FF6B18]/10 group-hover:border-[#FF6B18]/30 transition-all">
                  {getIcon(service.icon)}
                </div>
              </div>

              {/* Middle: Title & Description */}
              <div className="space-y-3 my-auto">
                <h3 className="text-xl font-bold text-[#F5F5F2] group-hover:text-[#FF6B18] transition-colors tracking-tight">
                  {service.title}
                </h3>
                <p className="text-sm text-[#7A838E] group-hover:text-[#B9C0C9] transition-colors leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Bottom: Action link */}
              <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-[#B9C0C9] group-hover:text-[#F5F5F2]">
                <Link to="/services" className="inline-flex items-center gap-1.5 hover:text-[#FF6B18] transition-colors">
                  <span>Explore Scope</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#FF6B18] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="text-[11px] text-[#7A838E] hover:text-[#FF6B18] uppercase tracking-wider"
                >
                  Request Quote
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View all services CTA */}
        <div className="mt-14 text-center">
          <Link to="/services" className="btn-secondary text-xs">
            View Complete Services & Plant Capabilities
            <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-[#FF6B18]" />
          </Link>
        </div>
      </div>
    </section>
  );
};
