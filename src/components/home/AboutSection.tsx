import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, Shield, Compass, Mountain } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-[#111318] text-[#F5F5F2] relative overflow-hidden">
      {/* Decorative subtle border line */}
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Column (6 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B18]" />
              <span className="text-xs font-bold tracking-[0.22em] text-[#FF6B18] uppercase">
                Who We Are
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
              Strength beneath <br />
              <span className="italic font-light text-[#FF6B18]">every</span> structure.
            </h2>

            <p className="text-base sm:text-lg text-[#F5F5F2]/90 leading-relaxed font-normal">
              Trimurti Mining and Infrastructure Private Limited provides mining, civil and infrastructure services with a practical, execution-first approach.
            </p>

            <p className="text-sm sm:text-base text-[#7A838E] leading-relaxed">
              We bring together on-ground coordination, capable resources and a commitment to reliable delivery. Every engagement is approached with careful planning, clear communication and respect for the environment in which we operate.
            </p>

            {/* Core Values Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              {[
                { title: 'Ground Execution', desc: 'Direct, hands-on site superintendence' },
                { title: 'Stringent Safety', desc: 'Zero-harm operational philosophy' },
                { title: 'Heavy Fleet Readiness', desc: 'High-availability machinery pool' },
                { title: 'Environmental Respect', desc: 'Regulated dust & water controls' },
              ].map((val) => (
                <div key={val.title} className="p-3.5 bg-white/[0.02] border border-white/[0.07] flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B18] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-[#F5F5F2]">{val.title}</p>
                    <p className="text-[11px] text-[#7A838E]">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Link to="/about" className="btn-primary text-xs">
                About Our Company
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Link>
              <Link to="/services" className="btn-secondary text-xs">
                Discover Our Services
              </Link>
            </div>
          </motion.div>

          {/* Right Visual Image Column (6 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative group overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1711012604128-8339024a3e12?auto=format&fit=crop&w=1400&q=85"
                alt="Excavator loading material into a haul truck at a quarry"
                loading="lazy"
                className="w-full h-[420px] md:h-[520px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent to-transparent opacity-80" />

              {/* Floating info tag */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#171A20]/90 backdrop-blur-md border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[#FF6B18] font-bold">
                    Field Capability
                  </p>
                  <p className="text-xs text-[#F5F5F2] font-medium">
                    Excavator loading material into a haul truck at an active pit
                  </p>
                </div>
                <span className="text-[10px] text-[#7A838E] border border-white/10 px-2 py-1 uppercase tracking-wider hidden sm:block">
                  Representative Imagery
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
