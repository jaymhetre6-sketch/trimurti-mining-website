import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchGallery } from '../../lib/supabase';
import { GalleryItem } from '../../types';
import { ArrowUpRight, Maximize2, X, Tag } from 'lucide-react';

export const GalleryPreview: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [activeMedia, setActiveMedia] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchGallery().then(setGallery);
  }, []);

  return (
    <section className="py-24 md:py-32 bg-[#111318] text-[#F5F5F2] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/[0.08]">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B18]" />
              <span className="text-xs font-bold tracking-[0.22em] text-[#FF6B18] uppercase">
                Field Operations
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.08]">
              Cinematic <br />
              <span className="italic font-light text-[#FF6B18]">field view.</span>
            </h2>
          </div>
          <p className="text-sm md:text-base text-[#B9C0C9] max-w-md font-light leading-relaxed">
            A visual documentation of high-tonnage mining machinery, heavy earthmoving equipment, and active infrastructure works.
          </p>
        </div>

        {/* Gallery Grid (first 6 items) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-12">
          {gallery.slice(0, 6).map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: (idx % 3) * 0.08 }}
              onClick={() => setActiveMedia(item)}
              className="group relative h-72 bg-[#171A20] border border-white/[0.08] overflow-hidden cursor-pointer"
            >
              <img
                src={item.image_url}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-[#111318]/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              {/* Tag & Title */}
              <div className="absolute top-4 left-4">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-[#111318]/80 backdrop-blur-md border border-white/10 text-[#FF6B18]">
                  {item.category}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#F5F5F2] group-hover:text-[#FF6B18] transition-colors leading-tight">
                    {item.title}
                  </h4>
                  {item.caption && (
                    <p className="text-[11px] text-[#7A838E] line-clamp-1 mt-0.5">
                      {item.caption}
                    </p>
                  )}
                </div>
                <div className="p-2 bg-white/[0.06] border border-white/10 text-[#F5F5F2] group-hover:bg-[#FF6B18] group-hover:text-white transition-colors">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View all gallery button */}
        <div className="mt-12 text-center">
          <Link to="/gallery" className="btn-secondary text-xs">
            Open Full Multimedia Gallery
            <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-[#FF6B18]" />
          </Link>
        </div>
      </div>

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
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-[65vh] bg-black">
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
                  className="btn-primary text-xs py-2 px-4 whitespace-nowrap"
                  onClick={() => setActiveMedia(null)}
                >
                  Inquire on Similar Operation
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
