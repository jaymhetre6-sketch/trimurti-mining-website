import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchProjects } from '../../lib/supabase';
import { Project } from '../../types';
import { ArrowUpRight, MapPin, Tag } from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetchProjects(true).then(setProjects);
  }, []);

  const categories = ['All', 'Mining Services', 'Earthwork & Excavation', 'Material Handling', 'Road Construction'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()) || selectedCategory.toLowerCase().includes(p.category.toLowerCase()));

  return (
    <section id="projects" className="py-24 md:py-32 bg-[#111318] text-[#F5F5F2] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Section Heading & Notice */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/[0.08]">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B18]" />
              <span className="text-xs font-bold tracking-[0.22em] text-[#FF6B18] uppercase">
                Selected Work
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.08]">
              Work in <br />
              <span className="italic font-light text-[#FF6B18]">motion.</span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-xs sm:text-sm text-[#7A838E] leading-relaxed border-l-2 border-[#FF6B18]/50 pl-4">
              Project information will be added following client approval. The imagery below is representative and does not depict company projects.
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 py-8 overflow-x-auto no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-200 border ${
                selectedCategory === category
                  ? 'bg-[#FF6B18] text-white border-[#FF6B18] shadow-glow-orange'
                  : 'bg-white/[0.03] text-[#B9C0C9] border-white/10 hover:border-white/20 hover:text-[#F5F5F2]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, clipPath: 'inset(10% 0 10% 0)' }}
                animate={{ opacity: 1, clipPath: 'inset(0% 0 0% 0)' }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, delay: (idx % 2) * 0.1 }}
                className="group relative bg-[#171A20] border border-white/[0.08] overflow-hidden flex flex-col"
              >
                {/* Project Cover Image */}
                <div className="relative h-72 sm:h-80 overflow-hidden">
                  <img
                    src={project.cover_url}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171A20] via-transparent to-transparent opacity-90" />

                  {/* Category Pill on Image */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#111318]/90 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-wider font-bold text-[#FF6B18]">
                      <Tag className="w-3 h-3" />
                      {project.category}
                    </span>
                  </div>

                  {project.location && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#111318]/80 backdrop-blur-md border border-white/10 text-[10px] text-[#B9C0C9] font-medium">
                        <MapPin className="w-3 h-3 text-[#FF6B18]" />
                        {project.location}
                      </span>
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#F5F5F2] group-hover:text-[#FF6B18] transition-colors tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#7A838E] line-clamp-2 leading-relaxed">
                      {project.summary || project.description}
                    </p>
                  </div>

                  {/* Scope badges preview */}
                  {project.scope && project.scope.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.scope.slice(0, 2).map((item, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2.5 py-1 bg-white/[0.03] border border-white/[0.06] text-[#B9C0C9]"
                        >
                          {item}
                        </span>
                      ))}
                      {project.scope.length > 2 && (
                        <span className="text-[10px] px-2 py-1 bg-white/[0.03] border border-white/[0.06] text-[#7A838E]">
                          +{project.scope.length - 2} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer link to Project Details */}
                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold text-[#B9C0C9]">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-[#F5F5F2] group-hover:text-[#FF6B18] transition-colors"
                    >
                      <span>View Project Details</span>
                      <ArrowUpRight className="w-4 h-4 text-[#FF6B18] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>

                    <Link
                      to="/contact"
                      className="text-[11px] text-[#7A838E] hover:text-[#FF6B18] uppercase tracking-wider"
                    >
                      Enquire Similar Scope
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* View all projects button */}
        <div className="mt-14 text-center">
          <Link to="/projects" className="btn-secondary text-xs">
            Browse All Tracked & Representative Projects
            <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-[#FF6B18]" />
          </Link>
        </div>
      </div>
    </section>
  );
};
