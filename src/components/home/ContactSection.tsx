import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { submitEnquiry } from '../../lib/supabase';
import { BRAND_INFO } from '../../lib/seedData';
import { Mail, Phone, MessageSquare, Send, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'Mining Services',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error('Please fill in your name, email, and project scope.');
      }

      const success = await submitEnquiry(formData);
      if (success) {
        setFeedback({
          type: 'success',
          message: 'Thank you. Your project enquiry has been submitted. Our engineering team will review the scope and contact you shortly.',
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          service: 'Mining Services',
          message: '',
        });
      } else {
        throw new Error('Unable to send your enquiry. Please try again or reach out directly via WhatsApp.');
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-[#111318] text-[#F5F5F2] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Inquiries & Brand Details (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B18]" />
                <span className="text-xs font-bold tracking-[0.22em] text-[#FF6B18] uppercase">
                  Start a Conversation
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.08]">
                Have a project <br />
                in <span className="italic font-light text-[#FF6B18]">mind?</span>
              </h2>
              <p className="text-sm sm:text-base text-[#B9C0C9] font-light leading-relaxed">
                Tell us about the scope, location and timeline. We’ll respond promptly to discuss operational sequencing and resource deployment.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4 pt-2">
              <a
                href={`mailto:${BRAND_INFO.email}?subject=Project%20Enquiry`}
                className="flex items-center gap-4 p-5 bg-[#171A20] border border-white/10 hover:border-[#FF6B18] transition-all group"
              >
                <div className="p-3 bg-white/[0.04] text-[#FF6B18] group-hover:bg-[#FF6B18] group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-[#7A838E] font-medium">Direct Email</span>
                  <span className="text-sm sm:text-base font-bold text-[#F5F5F2] group-hover:text-[#FF6B18] transition-colors break-all">
                    {BRAND_INFO.email}
                  </span>
                </div>
              </a>

              <a
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-5 bg-[#171A20] border border-white/10 hover:border-emerald-500 transition-all group"
              >
                <div className="p-3 bg-white/[0.04] text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-[#7A838E] font-medium">WhatsApp Discussion</span>
                  <span className="text-sm sm:text-base font-bold text-[#F5F5F2] group-hover:text-emerald-400 transition-colors">
                    {BRAND_INFO.phoneDisplay}
                  </span>
                </div>
              </a>

              <a
                href={BRAND_INFO.telUrl}
                className="flex items-center gap-4 p-5 bg-[#171A20] border border-white/10 hover:border-[#FF6B18] transition-all group"
              >
                <div className="p-3 bg-white/[0.04] text-[#FF6B18] group-hover:bg-[#FF6B18] group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-[#7A838E] font-medium">Telephone Direct</span>
                  <span className="text-sm sm:text-base font-bold text-[#F5F5F2] group-hover:text-[#FF6B18] transition-colors">
                    {BRAND_INFO.phoneDisplay}
                  </span>
                </div>
              </a>
            </div>

            <div className="p-5 bg-white/[0.02] border border-white/[0.06] text-xs text-[#7A838E] space-y-1.5">
              <p className="font-bold text-[#F5F5F2] uppercase tracking-wider text-[11px]">
                Commitment to Client Privacy
              </p>
              <p>
                All project scopes, client details, and tender estimates submitted through this channel are stored confidentially behind strict server-side access controls.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 bg-[#171A20] border border-white/10 shadow-2xl">
              <h3 className="text-xl sm:text-2xl font-bold text-[#F5F5F2] mb-2">
                Submit Project Specification
              </h3>
              <p className="text-xs sm:text-sm text-[#7A838E] mb-8">
                Fill out the form below. For urgent mobilization, reach us directly via WhatsApp.
              </p>

              {feedback && (
                <div
                  className={`p-4 mb-6 flex items-start gap-3 border ${
                    feedback.type === 'success'
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-950/40 border-red-500/30 text-red-300'
                  }`}
                  role="alert"
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
                  )}
                  <p className="text-xs leading-relaxed">{feedback.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B9C0C9]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Anand Patel"
                      className="w-full bg-[#111318] border border-white/10 px-4 py-3 text-xs text-[#F5F5F2] placeholder-[#7A838E] focus:outline-none focus:border-[#FF6B18] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B9C0C9]">
                      Corporate Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. anand@company.com"
                      className="w-full bg-[#111318] border border-white/10 px-4 py-3 text-xs text-[#F5F5F2] placeholder-[#7A838E] focus:outline-none focus:border-[#FF6B18] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B9C0C9]">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#111318] border border-white/10 px-4 py-3 text-xs text-[#F5F5F2] placeholder-[#7A838E] focus:outline-none focus:border-[#FF6B18] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B9C0C9]">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Infrastructure Ltd"
                      className="w-full bg-[#111318] border border-white/10 px-4 py-3 text-xs text-[#F5F5F2] placeholder-[#7A838E] focus:outline-none focus:border-[#FF6B18] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B9C0C9]">
                    Primary Sector Required
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-[#111318] border border-white/10 px-4 py-3 text-xs text-[#F5F5F2] focus:outline-none focus:border-[#FF6B18] transition-colors"
                  >
                    <option value="Mining Services">Mining Services & Overburden</option>
                    <option value="Infrastructure Development">Infrastructure Development</option>
                    <option value="Civil Construction">Civil Construction</option>
                    <option value="Road Construction">Road & Heavy Haul Formation</option>
                    <option value="Earthwork & Excavation">Earthwork & Site Grading</option>
                    <option value="Material Handling">Material Handling & Logistics</option>
                    <option value="Other Scope">Other Specialized Scope</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B9C0C9]">
                    Project Scope, Location & Target Timeline *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe estimated quantities, terrain characteristics, project location, equipment requirements and expected mobilization timeframe..."
                    className="w-full bg-[#111318] border border-white/10 px-4 py-3 text-xs text-[#F5F5F2] placeholder-[#7A838E] focus:outline-none focus:border-[#FF6B18] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 text-xs tracking-widest disabled:opacity-50"
                >
                  {loading ? (
                    'Transmitting Scope Data…'
                  ) : (
                    <>
                      <span>Transmit Project Enquiry</span>
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
