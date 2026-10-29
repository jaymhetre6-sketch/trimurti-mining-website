import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandLogo } from '../ui/BrandLogo';
import { BRAND_INFO } from '../../lib/seedData';
import { Menu, X, ArrowUpRight, Shield, Phone, MessageSquare } from 'lucide-react';

interface NavbarProps {
  isAdmin?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isAdmin = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Projects', path: '/projects' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'News', path: '/news' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-header h-20 shadow-2xl'
            : 'bg-gradient-to-b from-[#111318]/90 via-[#111318]/40 to-transparent h-24 border-b border-white/[0.06]'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-6 md:px-10 flex items-center justify-between">
          {/* Logo */}
          <BrandLogo isAdmin={isAdmin} />

          {/* Desktop Navigation Links */}
          {!isAdmin && (
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative text-xs font-semibold tracking-wider uppercase transition-colors duration-200 py-1 ${
                      isActive
                        ? 'text-[#FF6B18]'
                        : 'text-[#F5F5F2]/80 hover:text-[#F5F5F2]'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF6B18]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3.5">
            {!isAdmin ? (
              <>
                {/* Request Quote Button */}
                <Link
                  to="/contact"
                  className="btn-primary text-[11px] py-2.5 px-4 font-bold tracking-wider"
                >
                  Request a quote
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>

                {/* Separate Admin Login Button on the Right */}
                <Link
                  to="/admin/login"
                  title="Trimurti Portal Administration"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold tracking-wider uppercase text-[#B9C0C9] bg-white/[0.04] hover:bg-white/[0.08] hover:text-[#FF6B18] border border-white/10 transition-all duration-200"
                >
                  <Shield className="w-3.5 h-3.5 text-[#FF6B18]" />
                  <span>Admin Login</span>
                </Link>
              </>
            ) : (
              <Link
                to="/"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary text-[11px] py-2.5 px-4 font-bold tracking-wider"
              >
                View Public Site
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/admin/login"
              className="p-2 text-[#B9C0C9] hover:text-[#FF6B18] border border-white/10 bg-white/[0.04]"
              aria-label="Admin Portal"
            >
              <Shield className="w-4 h-4 text-[#FF6B18]" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F5F5F2] hover:text-[#FF6B18] transition-colors focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-0 z-40 bg-[#111318]/98 backdrop-blur-2xl flex flex-col justify-between p-8 pt-28 md:hidden"
          >
            <div className="space-y-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#FF6B18] font-semibold">
                Menu Navigation
              </p>
              <nav className="flex flex-col space-y-4">
                {navLinks.map((item, idx) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block text-2xl font-bold tracking-tight py-1 transition-colors ${
                        location.pathname === item.path
                          ? 'text-[#FF6B18]'
                          : 'text-[#F5F5F2] hover:text-[#FF6B18]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Bottom Quick Contact & Actions */}
            <div className="border-t border-white/10 pt-6 space-y-4">
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary w-full py-3.5 justify-center text-xs"
              >
                Request a Quote
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={BRAND_INFO.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 p-3 text-xs font-semibold bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-900/40"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
                <a
                  href={BRAND_INFO.telUrl}
                  className="flex items-center justify-center gap-2 p-3 text-xs font-semibold bg-white/[0.04] border border-white/10 text-[#F5F5F2] hover:text-[#FF6B18]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#FF6B18]" />
                  Call Now
                </a>
              </div>

              <div className="pt-2 text-center">
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#B9C0C9] hover:text-[#FF6B18]"
                >
                  <Shield className="w-3.5 h-3.5 text-[#FF6B18]" />
                  Admin Management Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
