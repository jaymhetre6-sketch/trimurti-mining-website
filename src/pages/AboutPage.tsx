import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BRAND_INFO } from '../lib/seedData';
import { Shield, Target, Award, HardHat, CheckCircle2, ArrowUpRight, Flame, Layers } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-[#111318] text-[#F5F5F2] min-h-screen">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16 border-b border-white/[0.08]">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B18]" />
            <span className="text-xs font-bold tracking-[0.22em] text-[#FF6B18] uppercase">
              Corporate Profile
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05]">
            Strength beneath <br />
            <span className="text-[#FF6B18]">every structure.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#B9C0C9] font-light leading-relaxed pt-2">
            Trimurti Mining and Infrastructure Private Limited delivers integrated mining, civil infrastructure, earthmoving and material handling solutions with a practical, execution-first approach.
          </p>
        </div>
      </section>

      {/* Main Narrative & Values */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F2]">
              Execution-First Philosophy
            </h2>
            <p className="text-sm sm:text-base text-[#7A838E] leading-relaxed">
              We bring together rigorous on-ground coordination, capable heavy plant resources and an unyielding commitment to dependable delivery. Every engagement is approached with disciplined planning, transparent client communication, and strict adherence to environmental protocols.
            </p>
            <p className="text-sm sm:text-base text-[#7A838E] leading-relaxed">
              From open-cast mining overburden extraction to multi-hectare industrial earthwork and reinforced haul road construction, Trimurti operates where terrain demands resilience, precision and heavy machinery mobilization.
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#171A20] border border-white/10">
                <Target className="w-6 h-6 text-[#FF6B18] mb-2" />
                <h3 className="text-sm font-bold text-[#F5F5F2]">Accountable Delivery</h3>
                <p className="text-xs text-[#7A838E] mt-1">Direct managerial superintendence across active sites.</p>
              </div>
              <div className="p-4 bg-[#171A20] border border-white/10">
                <Shield className="w-6 h-6 text-[#FF6B18] mb-2" />
                <h3 className="text-sm font-bold text-[#F5F5F2]">Zero-Harm Standard</h3>
                <p className="text-xs text-[#7A838E] mt-1">Daily safety briefings, PPE protocols, and pit slope checks.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative group overflow-hidden border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1680463990599-9d318aaecf71?auto=format&fit=crop&w=1600&q=85"
                alt="Mining highwall excavation"
                className="w-full h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent to-transparent opacity-70" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#171A20]/90 backdrop-blur-md border border-white/10">
                <p className="text-xs font-bold text-[#FF6B18] uppercase tracking-wider">Demanding Ground Realities</p>
                <p className="text-xs text-[#F5F5F2]">Continuous operations executed with heavy hydraulic plant machinery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="bg-[#171A20] py-20 border-y border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF6B18]">Our Foundation</p>
            <h2 className="text-3xl font-black text-[#F5F5F2]">Operational Principles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#111318] border border-white/10 space-y-4">
              <span className="text-2xl font-black text-[#FF6B18] font-mono">01</span>
              <h3 className="text-xl font-bold text-[#F5F5F2]">Site-Level Leadership</h3>
              <p className="text-xs sm:text-sm text-[#7A838E] leading-relaxed">
                Our leadership team is present on the ground. Decisions are made with direct observation of terrain conditions, machine telematics, and weather factors.
              </p>
            </div>

            <div className="p-8 bg-[#111318] border border-white/10 space-y-4">
              <span className="text-2xl font-black text-[#FF6B18] font-mono">02</span>
              <h3 className="text-xl font-bold text-[#F5F5F2]">Fleet Reliability</h3>
              <p className="text-xs sm:text-sm text-[#7A838E] leading-relaxed">
                Preventive maintenance schedules, mobile fuel bowsers, on-site mechanical teams and fast spare dispatch safeguard continuous cycle times.
              </p>
            </div>

            <div className="p-8 bg-[#111318] border border-white/10 space-y-4">
              <span className="text-2xl font-black text-[#FF6B18] font-mono">03</span>
              <h3 className="text-xl font-bold text-[#F5F5F2]">Environmental Stewardship</h3>
              <p className="text-xs sm:text-sm text-[#7A838E] leading-relaxed">
                Systematic water sprinkling for dust control, organized overburden slope stabilization, and drainage management safeguard the surrounding biosphere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-20">
        <div className="p-10 md:p-14 bg-gradient-to-r from-[#171A20] to-[#1E232B] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#F5F5F2]">Partner With Trimurti</h3>
            <p className="text-xs sm:text-sm text-[#B9C0C9] max-w-xl">
              Discuss tender requirements, plant mobilization schedules, and project timelines with our operations division.
            </p>
          </div>
          <Link to="/contact" className="btn-primary text-xs whitespace-nowrap">
            Initiate Project Discussion
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </section>
    </div>
  );
};
