import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGallery } from '../lib/supabase';
import { GalleryItem } from '../types';
import { Maximize2, X, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GalleryPage: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [category, setCategory] = useState('All');
  const [activeMedia, setActiveMedia] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchGallery().then(setGallery);
  }, []);

  const categories = ['All', 'Mining Operations', 'Material Handling', 'Earthwork & Excavation', 'Road Construction'];

  const filtered = category === 'All'
    ? gallery
    : gallery.filter((item) => item.category.toLowerCase().includes(category.toLowerCase()) || category.toLowerCase().includes(item.category.toLowerCase()));

  return (
    <div className="pt-32 pb-24 bg-[#111318] text-[#F5F5F2] min-h-screen">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-12 border-b border-white/[0.08]">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B18]" />
            <span className="text-xs font-bold tracking-[0.22em] text-[#FF6B18] uppercase">
              Field Documentation
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05]">
            Operational <br />
            <span className="text-[#FF6B18]">gallery.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#B9C0C9] font-light leading-relaxed pt-2">
            High-resolution visual record of open-cast operations, heavy plant deployments, aggregate logistics and infrastructure construction.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-10">
        <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-white/[0.08]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all border ${
                category === cat
                  ? 'bg-[#FF6B18] text-white border-[#FF6B18] shadow-glow-orange'
                  : 'bg-white/[0.03] text-[#B9C0C9] border-white/10 hover:border-white/20 hover:text-[#F5F5F2]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Media Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.06 }}
                onClick={() => setActiveMedia(item)}
                className="group relative h-80 bg-[#171A20] border border-white/10 overflow-hidden cursor-pointer"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 bg-[#111318]/90 text-[10px] font-bold uppercase tracking-wider text-[#FF6B18] border border-white/10">
                    {item.category}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#F5F5F2] group-hover:text-[#FF6B18] transition-colors">
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p className="text-[11px] text-[#7A838E] line-clamp-1 mt-0.5">
                        {item.caption}
                      </p>
                    )}
                  </div>
                  <div className="p-2 bg-white/[0.08] border border-white/10 text-white group-hover:bg-[#FF6B18] transition-colors">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
            onClick={() => setActiveMedia(null)}
          >
            <div
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col bg-[#171A20] border border-white/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveMedia(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/60 text-white hover:text-[#FF6B18] border border-white/20 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-[68vh] bg-black">
                <img
                  src={activeMedia.image_url}
                  alt={activeMedia.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 bg-[#171A20] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B18]">
                    {activeMedia.category}
                  </span>
                  <h3 className="text-lg font-bold text-[#F5F5F2]">{activeMedia.title}</h3>
                  {activeMedia.caption && (
                    <p className="text-xs text-[#B9C0C9] mt-1">{activeMedia.caption}</p>
                  )}
                </div>
                <Link
                  to="/contact"
                  className="btn-primary text-xs py-2.5 px-4 whitespace-nowrap"
                  onClick={() => setActiveMedia(null)}
                >
                  Contact About Operation
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
