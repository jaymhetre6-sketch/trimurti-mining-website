import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchServices } from '../lib/supabase';
import { Service } from '../types';
import { ArrowUpRight, Pickaxe, Building2, HardHat, Milestone, Shovel, Truck, Check } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchServices().then(setServices);
  }, []);

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Pickaxe':
        return <Pickaxe className="w-8 h-8 text-[#FF6B18]" />;
      case 'Building2':
        return <Building2 className="w-8 h-8 text-[#FF6B18]" />;
      case 'HardHat':
        return <HardHat className="w-8 h-8 text-[#FF6B18]" />;
      case 'Milestone':
        return <Milestone className="w-8 h-8 text-[#FF6B18]" />;
      case 'Shovel':
        return <Shovel className="w-8 h-8 text-[#FF6B18]" />;
      case 'Truck':
        return <Truck className="w-8 h-8 text-[#FF6B18]" />;
      default:
        return <HardHat className="w-8 h-8 text-[#FF6B18]" />;
    }
  };

  return (
    <div className="pt-32 pb-24 bg-[#111318] text-[#F5F5F2] min-h-screen">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16 border-b border-white/[0.08]">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B18]" />
            <span className="text-xs font-bold tracking-[0.22em] text-[#FF6B18] uppercase">
              Our Capabilities
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05]">
            Capability <br />
            at <span className="text-[#FF6B18]">scale.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#B9C0C9] font-light leading-relaxed pt-2">
            Integrated support across mining, infrastructure and civil construction—adapted to the ground realities of each assignment.
          </p>
        </div>
      </section>

      {/* Services List with Detailed Expanded Sections */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 space-y-20">
        {services.map((service, idx) => (
          <motion.div
            key={service.id || service.order_num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7 }}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 sm:p-12 bg-[#171A20] border border-white/[0.08] ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Visual (5 cols) */}
            <div className={`lg:col-span-5 ${idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
              <div className="relative group overflow-hidden border border-white/10 h-72 sm:h-96">
                <img
                  src={service.image_url || 'https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?auto=format&fit=crop&w=1400&q=85'}
                  alt={service.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 left-4 p-3 bg-[#111318]/90 backdrop-blur-md border border-white/10">
                  {getIcon(service.icon)}
                </div>
              </div>
            </div>

            {/* Description & Scope (7 cols) */}
            <div className={`lg:col-span-7 space-y-6 ${idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-[#FF6B18] font-mono">
                  {service.order_num}
                </span>
                <span className="text-xs uppercase tracking-widest text-[#7A838E] font-semibold">
                  Discipline Specification
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F2] tracking-tight">
                {service.title}
              </h2>

              <p className="text-base text-[#F5F5F2]/90 leading-relaxed font-normal">
                {service.description}
              </p>

              {service.details && (
                <p className="text-sm text-[#7A838E] leading-relaxed">
                  {service.details}
                </p>
              )}

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="btn-primary text-xs"
                >
                  Request Quotation for {service.title}
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Link>
                <Link
                  to="/projects"
                  className="btn-secondary text-xs"
                >
                  View Related Projects
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
};
