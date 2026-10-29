import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../ui/BrandLogo';
import { BRAND_INFO } from '../../lib/seedData';
import { Mail, Phone, MessageSquare, ArrowUp, Shield, ExternalLink, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B0D11] border-t border-white/[0.08] text-[#B9C0C9] relative overflow-hidden">
      {/* Decorative gradient accents */}
      <div className="absolute top-0 left-1/4 w-96 h-1 bg-gradient-to-r from-transparent via-[#FF6B18]/40 to-transparent" />
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#FF6B18]/5 blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <BrandLogo />
            <p className="text-xl md:text-2xl font-light text-[#F5F5F2] leading-snug tracking-tight">
              Building Infrastructure. <br />
              <span className="font-semibold text-[#FF6B18]">Powering Progress.</span>
            </p>
            <p className="text-sm leading-relaxed text-[#7A838E] max-w-md font-sans">
              Trimurti Mining and Infrastructure Private Limited provides mining, civil and infrastructure services with a practical, execution-first approach. Built for demanding ground realities across India.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 hover:bg-emerald-900/40 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp +91 70285 32906
              </a>
              <a
                href={BRAND_INFO.telUrl}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#F5F5F2] bg-white/[0.04] border border-white/10 hover:border-[#FF6B18] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#FF6B18]" />
                Call Directly
              </a>
            </div>
          </div>

          {/* Quick Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-xs uppercase tracking-widest text-[#F5F5F2] font-bold">
              Navigation
            </p>
            <ul className="space-y-2.5 text-xs">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Company', path: '/about' },
                { name: 'Capabilities & Services', path: '/services' },
                { name: 'Selected Projects', path: '/projects' },
                { name: 'Field Gallery', path: '/gallery' },
                { name: 'News & Updates', path: '/news' },
                { name: 'Contact & Quotes', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-[#FF6B18] transition-colors block py-0.5"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Capabilities (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-xs uppercase tracking-widest text-[#F5F5F2] font-bold">
              Sectors
            </p>
            <ul className="space-y-2.5 text-xs text-[#7A838E]">
              <li>Mining Operations</li>
              <li>Civil Infrastructure</li>
              <li>Road Construction</li>
              <li>Earthwork & Grading</li>
              <li>Material Logistics</li>
              <li>Quarry Management</li>
            </ul>
          </div>

          {/* Direct Enquiries (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <p className="text-xs uppercase tracking-widest text-[#F5F5F2] font-bold">
              Direct Inquiries
            </p>
            <div className="space-y-3 text-xs">
              <a
                href={`mailto:${BRAND_INFO.email}`}
                className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/10 hover:border-[#FF6B18]/50 hover:bg-white/[0.04] transition-all group"
              >
                <Mail className="w-4 h-4 text-[#FF6B18] flex-shrink-0 mt-0.5" />
                <div className="overflow-hidden">
                  <span className="block text-[10px] uppercase tracking-wider text-[#7A838E] font-medium">Email Inquiries</span>
                  <span className="text-[#F5F5F2] font-medium group-hover:text-[#FF6B18] transition-colors break-all">
                    {BRAND_INFO.email}
                  </span>
                </div>
              </a>

              <a
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/10 hover:border-emerald-500/50 hover:bg-white/[0.04] transition-all group"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#7A838E] font-medium">WhatsApp Direct</span>
                  <span className="text-[#F5F5F2] font-medium group-hover:text-emerald-400 transition-colors">
                    {BRAND_INFO.phoneDisplay}
                  </span>
                </div>
              </a>

              <div className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/10">
                <MapPin className="w-4 h-4 text-[#FF6B18] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#7A838E] font-medium">Operating Corridors</span>
                  <span className="text-[#F5F5F2] font-medium">
                    Central & Western Mining & Infrastructure Zones, India
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-16 pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#7A838E]">
          <div className="flex items-center gap-3">
            <span>© {currentYear} Trimurti Mining and Infrastructure Private Limited.</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-[#B9C0C9] hover:text-[#FF6B18] transition-colors font-medium"
            >
              <Shield className="w-3.5 h-3.5 text-[#FF6B18]" />
              Trimurti Portal Administration
            </Link>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-[#F5F5F2] hover:text-[#FF6B18] transition-colors"
            >
              Back to top
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
