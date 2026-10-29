import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchNews } from '../lib/supabase';
import { NewsItem } from '../types';
import { Calendar, Tag, ArrowUpRight, X, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);

  useEffect(() => {
    fetchNews(true).then(setNews);
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="pt-32 pb-24 bg-[#111318] text-[#F5F5F2] min-h-screen">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-12 border-b border-white/[0.08]">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B18]" />
            <span className="text-xs font-bold tracking-[0.22em] text-[#FF6B18] uppercase">
              Corporate Disclosures
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05]">
            News & <br />
            <span className="text-[#FF6B18]">announcements.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#B9C0C9] font-light leading-relaxed pt-2">
            Stay informed on our fleet inductions, safety milestones, technical capabilities and regional project accomplishments.
          </p>
        </div>
      </section>

      {/* News Articles Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {news.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group bg-[#171A20] border border-white/10 overflow-hidden flex flex-col justify-between"
            >
              {item.cover_url && (
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.cover_url}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171A20] via-transparent to-transparent opacity-80" />
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

                  <h2 className="text-xl sm:text-2xl font-bold text-[#F5F5F2] group-hover:text-[#FF6B18] transition-colors leading-snug">
                    {item.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#7A838E] leading-relaxed line-clamp-3">
                    {item.excerpt || item.content}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold">
                  <button
                    onClick={() => setActiveArticle(item)}
                    className="inline-flex items-center gap-1.5 text-[#FF6B18] hover:text-white transition-colors uppercase tracking-wider font-bold"
                  >
                    <span>Read Full Disclosure</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Full Article Modal */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setActiveArticle(null)}
          >
            <div
              className="relative max-w-3xl w-full max-h-[85vh] bg-[#171A20] border border-white/10 overflow-y-auto p-8 sm:p-10 space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-5 right-5 p-2 bg-[#111318] text-white hover:text-[#FF6B18] border border-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-[#FF6B18]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(activeArticle.published_at)}</span>
                  {activeArticle.category && (
                    <span className="ml-2 px-2 py-0.5 bg-white/[0.04] text-[10px] uppercase font-bold text-[#B9C0C9]">
                      {activeArticle.category}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-[#F5F5F2] leading-snug">
                  {activeArticle.title}
                </h2>
              </div>

              {activeArticle.cover_url && (
                <div className="h-64 sm:h-80 overflow-hidden border border-white/10">
                  <img
                    src={activeArticle.cover_url}
                    alt={activeArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="text-sm sm:text-base text-[#B9C0C9] leading-relaxed space-y-4">
                <p className="font-semibold text-[#F5F5F2]">{activeArticle.excerpt}</p>
                <p className="whitespace-pre-line">{activeArticle.content}</p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-[#7A838E]">
                  Issued by Trimurti Mining & Infrastructure Communications Office
                </span>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Close Article
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
