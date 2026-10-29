import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchProjects } from '../lib/supabase';
import { Project } from '../types';
import { Search, Tag, MapPin, ArrowUpRight, Filter } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetchProjects(true).then(setProjects);
  }, []);

  const categories = ['All', 'Mining Services', 'Earthwork & Excavation', 'Material Handling', 'Road Construction'];

  const filtered = projects.filter((p) => {
    const matchesCat = category === 'All' || p.category.toLowerCase().includes(category.toLowerCase()) || category.toLowerCase().includes(p.category.toLowerCase());
    const matchesSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      (p.location && p.location.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="pt-32 pb-24 bg-[#111318] text-[#F5F5F2] min-h-screen">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-12 border-b border-white/[0.08]">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B18]" />
            <span className="text-xs font-bold tracking-[0.22em] text-[#FF6B18] uppercase">
              Portfolio & Assignments
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05]">
            Work in <br />
            <span className="text-[#FF6B18]">motion.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#B9C0C9] font-light leading-relaxed pt-2">
            Explore our assignments across open-cast surface mining, heavy earthwork, highway formation and logistics corridors.
          </p>
          <p className="text-xs text-[#7A838E] border-l-2 border-[#FF6B18]/50 pl-3">
            Note: Project information is displayed in accordance with client confidentiality agreements. Representative imagery is utilized where client nondisclosure governs.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-10">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 bg-[#171A20] border border-white/10">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  category === cat
                    ? 'bg-[#FF6B18] text-white shadow-glow-orange'
                    : 'bg-white/[0.04] text-[#B9C0C9] hover:text-[#F5F5F2]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-[#7A838E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search scope, location, keyword…"
              className="w-full bg-[#111318] border border-white/10 pl-10 pr-4 py-2 text-xs text-[#F5F5F2] placeholder-[#7A838E] focus:outline-none focus:border-[#FF6B18]"
            />
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        {filtered.length === 0 ? (
          <div className="p-16 text-center bg-[#171A20] border border-white/10 space-y-3">
            <p className="text-base font-semibold text-[#F5F5F2]">No projects match your current filter.</p>
            <p className="text-xs text-[#7A838E]">Try clearing the search query or selecting "All" categories.</p>
            <button
              onClick={() => {
                setCategory('All');
                setSearch('');
              }}
              className="btn-secondary text-xs mt-4"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, idx) => (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="group bg-[#171A20] border border-white/10 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={project.cover_url}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171A20] via-transparent to-transparent opacity-90" />

                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#111318]/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#FF6B18] border border-white/10">
                        {project.category}
                      </span>
                    </div>

                    {project.location && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-[#111318]/90 backdrop-blur-md text-[10px] text-[#B9C0C9] border border-white/10 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#FF6B18]" />
                          {project.location}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-8 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#F5F5F2] group-hover:text-[#FF6B18] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#7A838E] leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    {project.scope && project.scope.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        <span className="text-[10px] uppercase font-bold text-[#FF6B18] tracking-wider block">
                          Scope Highlights:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {project.scope.slice(0, 3).map((item, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2.5 py-1 bg-[#111318] border border-white/[0.06] text-[#B9C0C9]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold text-[#B9C0C9]">
                      <Link
                        to={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1.5 text-[#F5F5F2] group-hover:text-[#FF6B18] transition-colors"
                      >
                        <span>Full Project Profile</span>
                        <ArrowUpRight className="w-4 h-4 text-[#FF6B18]" />
                      </Link>

                      <Link
                        to="/contact"
                        className="text-[11px] text-[#7A838E] hover:text-[#FF6B18] uppercase tracking-wider"
                      >
                        Request Quote
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
};
