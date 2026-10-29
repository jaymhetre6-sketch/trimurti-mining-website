import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProjectBySlug } from '../lib/supabase';
import { Project } from '../types';
import { ArrowLeft, ArrowUpRight, MapPin, Tag, CheckCircle2, Hammer, Shield, Calendar, Building } from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      fetchProjectBySlug(slug)
        .then((p) => {
          setProject(p);
          if (p && p.cover_url) {
            setSelectedPhoto(p.cover_url);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-40 pb-24 min-h-screen bg-[#111318] text-center text-[#B9C0C9]">
        <div className="w-8 h-8 border-2 border-[#FF6B18] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs uppercase tracking-widest">Loading Project Profile…</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-40 pb-24 min-h-screen bg-[#111318] text-center px-6">
        <h2 className="text-2xl font-bold text-[#F5F5F2] mb-3">Project Profile Not Found</h2>
        <p className="text-sm text-[#7A838E] mb-6">The project you requested might have been updated or moved.</p>
        <Link to="/projects" className="btn-primary text-xs">
          Return to Projects Directory
        </Link>
      </div>
    );
  }

  const allPhotos = [project.cover_url, ...(project.media || [])].filter(Boolean);

  return (
    <div className="pt-32 pb-24 bg-[#111318] text-[#F5F5F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Back Link */}
        <div className="pb-8">
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#B9C0C9] hover:text-[#FF6B18] transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects Directory
          </button>
        </div>

        {/* Project Header Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-12 border-b border-white/[0.08]">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#171A20] border border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#FF6B18]">
                {project.category}
              </span>
              {project.status && (
                <span className="px-3 py-1 bg-white/[0.04] border border-white/10 text-[10px] font-semibold uppercase tracking-wider text-[#B9C0C9]">
                  Status: {project.status}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.08] text-[#F5F5F2]">
              {project.title}
            </h1>

            {project.summary && (
              <p className="text-base sm:text-lg text-[#B9C0C9] font-light leading-relaxed">
                {project.summary}
              </p>
            )}
          </div>

          {/* Key Facts Box */}
          <div className="lg:col-span-4 p-6 bg-[#171A20] border border-white/10 space-y-4 w-full">
            <h3 className="text-xs uppercase font-bold tracking-widest text-[#FF6B18]">
              Assignment Specifications
            </h3>

            {project.location && (
              <div className="flex items-start gap-3 text-xs">
                <MapPin className="w-4 h-4 text-[#FF6B18] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[#7A838E] text-[10px] uppercase font-semibold">Location</span>
                  <span className="text-[#F5F5F2] font-medium">{project.location}</span>
                </div>
              </div>
            )}

            {project.client && (
              <div className="flex items-start gap-3 text-xs">
                <Building className="w-4 h-4 text-[#FF6B18] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[#7A838E] text-[10px] uppercase font-semibold">Client Sector</span>
                  <span className="text-[#F5F5F2] font-medium">{project.client}</span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 text-xs">
              <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="block text-[#7A838E] text-[10px] uppercase font-semibold">Safety Protocol</span>
                <span className="text-emerald-300 font-medium">Standard Zero-Harm Compliant</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/contact"
                className="btn-primary w-full py-3 text-xs text-center justify-center"
              >
                Request Quotation for Similar Scope
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Media & Visual Preview */}
        <div className="py-12 space-y-4">
          <div className="relative h-[400px] sm:h-[550px] bg-[#171A20] border border-white/10 overflow-hidden">
            <img
              src={selectedPhoto || project.cover_url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Photo Reel Thumbnails */}
          {allPhotos.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allPhotos.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPhoto(photo)}
                  className={`relative w-24 h-16 flex-shrink-0 border-2 overflow-hidden transition-all ${
                    selectedPhoto === photo ? 'border-[#FF6B18]' : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Deep Dive Description & Equipment Deployed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-10">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl font-bold text-[#F5F5F2] tracking-tight">
              Operational Scope & Execution Narrative
            </h2>
            <div className="text-sm sm:text-base text-[#7A838E] leading-relaxed space-y-4">
              <p>{project.description}</p>
              <p>
                Trimurti’s operational engineers coordinated directly with on-site surveying teams to ensure benchmark levels, slope gradients and dust suppression schedules were met without operational halts.
              </p>
            </div>

            {/* Scope Checklist */}
            {project.scope && project.scope.length > 0 && (
              <div className="pt-6 space-y-3">
                <h3 className="text-sm uppercase font-bold tracking-wider text-[#FF6B18]">
                  Key Deliverables Executed:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.scope.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#171A20] border border-white/[0.06] flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#FF6B18] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#F5F5F2]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Plant & Machinery Deployed (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 bg-[#171A20] border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-[#FF6B18]">
                <Hammer className="w-5 h-5" />
                <h3 className="text-sm uppercase font-bold tracking-wider">
                  Heavy Plant & Fleet Mobilized
                </h3>
              </div>
              <p className="text-xs text-[#7A838E] leading-relaxed">
                Machinery and support equipment deployed for this assignment to ensure rigorous production rates:
              </p>
              <ul className="space-y-2 pt-2">
                {(project.equipment && project.equipment.length > 0
                  ? project.equipment
                  : [
                      '30T - 48T Heavy Hydraulic Excavators',
                      'Multi-Axle Heavy Tipper Dumpers',
                      'Crawler Dozers (Blade & Ripper equipped)',
                      'Vibratory Soil Compactor Rollers',
                      'High-Capacity Water Sprinkler Bowsers',
                    ]
                ).map((eq, i) => (
                  <li
                    key={i}
                    className="p-3 bg-[#111318] border border-white/[0.06] text-xs font-semibold text-[#F5F5F2] flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B18]" />
                    {eq}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
