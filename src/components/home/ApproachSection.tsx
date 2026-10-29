import React from 'react';
import { motion } from 'framer-motion';
import { BRAND_INFO } from '../../lib/seedData';
import { CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

export const ApproachSection: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-[#171A20] text-[#F5F5F2] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Haul Truck Imagery (6 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 order-2 lg:order-1 relative"
          >
            <div className="relative group overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1719411321415-acfbe793c0aa?auto=format&fit=crop&w=1800&q=85"
                alt="Heavy haul truck moving through an industrial site"
                loading="lazy"
                className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#111318]/90 backdrop-blur-md border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[#FF6B18] font-bold">
                    Operational Discipline
                  </p>
                  <p className="text-xs text-[#F5F5F2] font-medium">
                    Continuous heavy fleet haulage under synchronized ground control
                  </p>
                </div>
                <span className="text-[10px] text-[#7A838E] border border-white/10 px-2 py-1 uppercase tracking-wider hidden sm:block">
                  Site Operations
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Approach Copy & 3 Steps (6 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-6 order-1 lg:order-2 space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B18]" />
                <span className="text-xs font-bold tracking-[0.22em] text-[#FF6B18] uppercase">
                  How We Work
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.08]">
                Grounded in <br />
                <span className="italic font-light text-[#FF6B18]">execution.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#B9C0C9] font-light leading-relaxed">
                Our approach is direct, coordinated and accountable—from initial understanding through site delivery.
              </p>
            </div>

            {/* 3 Sequential Steps */}
            <div className="space-y-4">
              {BRAND_INFO.approachSteps.map((step, idx) => (
                <motion.div
                  key={step.num}
                  whileHover={{ x: 6 }}
                  className="p-6 bg-[#111318] border border-white/[0.08] hover:border-[#FF6B18]/40 transition-all flex items-start gap-5 group"
                >
                  <span className="text-2xl font-black text-[#FF6B18] font-mono group-hover:scale-110 transition-transform">
                    {step.num}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#F5F5F2] group-hover:text-[#FF6B18] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#7A838E] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
