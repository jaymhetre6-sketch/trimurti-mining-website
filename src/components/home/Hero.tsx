import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, ShieldCheck, Clock, Award, Hammer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRAND_INFO } from '../../lib/seedData';

export const Hero: React.FC = () => {
  const scrollToExplore = () => {
    const el = document.getElementById('services-overview');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-32 pb-12 px-6 md:px-10 overflow-hidden bg-[#111318]">
      {/* Background Image with Cinematic Overlay & Framer Motion Parallax Mask */}
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1680463990599-9d318aaecf71?auto=format&fit=crop&w=2400&q=88')`,
          }}
        />
        {/* Layered cinematic gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-[#111318]/70 to-[#111318]/40" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#111318]/60 to-[#111318]/90" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      </motion.div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-12">
        <div className="max-w-4xl space-y-6">
          {/* Eyebrow / Kicker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-white/[0.06] border border-white/10 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF6B18] animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#F5F5F2]">
              Built for Demanding Ground
            </span>
          </motion.div>

          {/* Core Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-[#F5F5F2] tracking-tight leading-[1.04]"
          >
            Building <br />
            Infrastructure.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B18] via-[#FF8A3D] to-[#FFA768]">
              Powering Progress.
            </span>
          </motion.h1>

          {/* Subtitle / Value Proposition */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-base sm:text-lg md:text-xl text-[#B9C0C9] max-w-2xl font-light leading-relaxed pt-2"
          >
            Mining, earthwork and infrastructure solutions built around dependable execution, heavy plant capacity and ground-level accountability.
          </motion.p>

          {/* Call-to-Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <button
              onClick={scrollToExplore}
              className="btn-primary text-xs tracking-wider"
            >
              Explore Capabilities
              <ArrowDown className="w-3.5 h-3.5 ml-1" />
            </button>

            <Link
              to="/contact"
              className="btn-secondary text-xs tracking-wider group"
            >
              Start a Conversation
              <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-[#FF6B18] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <a
              href={BRAND_INFO.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 hover:bg-emerald-900/40 transition-colors"
            >
              <span>WhatsApp Direct</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Hero Foot: Metrics & Scroll Prompt */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-8 border-t border-white/[0.08]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/[0.04] border border-white/10 text-[#FF6B18]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#F5F5F2]">100% Safety</p>
              <p className="text-[11px] text-[#7A838E]">Zero-Harm Protocol</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/[0.04] border border-white/10 text-[#FF6B18]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#F5F5F2]">24/7 Operations</p>
              <p className="text-[11px] text-[#7A838E]">Continuous Logistics</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/[0.04] border border-white/10 text-[#FF6B18]">
              <Hammer className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#F5F5F2]">Heavy Machinery</p>
              <p className="text-[11px] text-[#7A838E]">Excavators & Tippers</p>
            </div>
          </div>

          <div className="flex items-center justify-start md:justify-end">
            <button
              onClick={scrollToExplore}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#B9C0C9] hover:text-[#FF6B18] transition-colors uppercase"
            >
              <span>Scroll to explore</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#FF6B18]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
