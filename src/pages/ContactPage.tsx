import React from 'react';
import { ContactSection } from '../components/home/ContactSection';
import { BRAND_INFO } from '../lib/seedData';
import { MapPin, Phone, Mail, Clock, MessageSquare, ShieldCheck } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="pt-32 pb-12 bg-[#111318] text-[#F5F5F2] min-h-screen">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-12 border-b border-white/[0.08]">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B18]" />
            <span className="text-xs font-bold tracking-[0.22em] text-[#FF6B18] uppercase">
              Direct Communications
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05]">
            Contact & <br />
            <span className="text-[#FF6B18]">mobilization.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#B9C0C9] font-light leading-relaxed pt-2">
            Connect with our engineering estimation and site deployment team. We support tender inquiries, commercial quotes and emergency earthmoving assistance.
          </p>
        </div>
      </section>

      {/* Embed Contact Section */}
      <ContactSection />

      {/* Regional Operational Corridors */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 border-t border-white/[0.08]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#171A20] border border-white/10 space-y-2">
            <Clock className="w-5 h-5 text-[#FF6B18]" />
            <h3 className="text-sm font-bold text-[#F5F5F2]">Operating Hours</h3>
            <p className="text-xs text-[#7A838E] leading-relaxed">
              Administrative: Mon – Sat: 08:30 – 19:00 IST <br />
              Field Operations & Haulage: 24 Hours / 7 Days continuous dispatch.
            </p>
          </div>

          <div className="p-6 bg-[#171A20] border border-white/10 space-y-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-[#F5F5F2]">Tender & RFP Response</h3>
            <p className="text-xs text-[#7A838E] leading-relaxed">
              Target response time for commercial inquiries and tender scope documents is within 24 to 48 business hours.
            </p>
          </div>

          <div className="p-6 bg-[#171A20] border border-white/10 space-y-2">
            <MessageSquare className="w-5 h-5 text-[#FF6B18]" />
            <h3 className="text-sm font-bold text-[#F5F5F2]">Instant WhatsApp Channel</h3>
            <p className="text-xs text-[#7A838E] leading-relaxed">
              For urgent mobilization needs or machinery availability queries, connect directly to our operations line via WhatsApp: +91 70285 32906.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
