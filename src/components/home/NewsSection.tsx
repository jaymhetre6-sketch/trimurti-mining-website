import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchNews } from '../../lib/supabase';
import { NewsItem } from '../../types';
import { ArrowUpRight, Calendar, Newspaper, Tag } from 'lucide-react';

export const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetchNews(true).then(setNews);
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="py-24 md:py-32 bg-[#171A20] text-[#F5F5F2] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/[0.08]">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B18]" />
              <span className="text-xs font-bold tracking-[0.22em] text-[#FF6B18] uppercase">
                News & Press
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.08]">
              Operational <br />
              <span className="italic font-light text-[#FF6B18]">milestones.</span>
            </h2>
          </div>
          <p className="text-sm md:text-base text-[#B9C0C9] max-w-md font-light leading-relaxed">
            Latest operational updates, equipment acquisitions, safety briefings, and infrastructure milestones from Trimurti.
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
          {news.slice(0, 2).map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group bg-[#111318] border border-white/[0.08] hover:border-[#FF6B18]/40 transition-all flex flex-col justify-between overflow-hidden"
            >
              {item.cover_url && (
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={item.cover_url}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent to-transparent opacity-80" />
                  {item.category && (
                    <div className="absolute top-4 left-4">
                      <span className="px-2.5 py-1 bg-[#111318]/90 text-[10px] font-bold uppercase tracking-wider text-[#FF6B18] border border-white/10">
                        {item.category}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="p-8 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#7A838E]">
                    <Calendar className="w-3.5 h-3.5 text-[#FF6B18]" />
                    <span>{formatDate(item.published_at)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#F5F5F2] group-hover:text-[#FF6B18] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#7A838E] leading-relaxed line-clamp-3">
                    {item.excerpt || item.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-[#B9C0C9]">
                  <Link
                    to="/news"
                    className="inline-flex items-center gap-1.5 text-[#FF6B18] hover:text-white transition-colors"
                  >
                    <span>Read Full Update</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/news" className="btn-secondary text-xs">
            Browse All News & Press Releases
            <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-[#FF6B18]" />
          </Link>
        </div>
      </div>
    </section>
  );
};
