import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  adminAuth,
  isLiveSupabase,
  fetchProjects,
  saveProject,
  deleteProject,
  fetchServices,
  saveService,
  deleteService,
  fetchGallery,
  saveGalleryItem,
  deleteGalleryItem,
  fetchNews,
  saveNewsItem,
  deleteNewsItem,
  fetchEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  fetchAuditLogs,
  uploadMediaFile,
} from '../../lib/supabase';
import { Project, Service, GalleryItem, NewsItem, Enquiry, AuditLog } from '../../types';
import { BrandLogo } from '../../components/ui/BrandLogo';
import {
  Briefcase,
  Image,
  Wrench,
  Newspaper,
  Inbox,
  Activity,
  LogOut,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Upload,
  Eye,
  EyeOff,
  Database,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  Building,
  Calendar,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessionLoading, setSessionLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'projects' | 'gallery' | 'services' | 'news' | 'enquiries' | 'activity'>('projects');

  // Data States
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Feedback & Loading
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Forms / Editing states
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryItem> | null>(null);
  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);
  const [viewingEnquiry, setViewingEnquiry] = useState<Enquiry | null>(null);

  // Scope & Equipment raw text inputs for Project Editor
  const [scopeInput, setScopeInput] = useState('');
  const [equipmentInput, setEquipmentInput] = useState('');

  // Media upload state
  const [uploadingFile, setUploadingFile] = useState(false);

  // Verify Session
  useEffect(() => {
    adminAuth.getSession().then((res) => {
      if (!res.authenticated) {
        navigate('/admin/login');
      } else {
        setAdminEmail(res.email || 'Admin');
        setSessionLoading(false);
        loadAllData();
      }
    });
  }, [navigate]);

  const loadAllData = async () => {
    try {
      const [projData, servData, gallData, newsData, enqData, auditData] = await Promise.all([
        fetchProjects(false),
        fetchServices(),
        fetchGallery(),
        fetchNews(false),
        fetchEnquiries(),
        fetchAuditLogs(),
      ]);
      setProjects(projData);
      setServices(servData);
      setGallery(gallData);
      setNews(newsData);
      setEnquiries(enqData);
      setAuditLogs(auditData);
    } catch (err) {
      console.error('Data load error:', err);
    }
  };

  const handleLogout = async () => {
    await adminAuth.signOut();
    navigate('/admin/login');
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // --- PROJECT ACTIONS ---
  const handleStartCreateProject = () => {
    setEditingProject({
      title: '',
      category: 'Mining Services',
      location: '',
      client: '',
      summary: '',
      description: '',
      cover_url: 'https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?auto=format&fit=crop&w=1600&q=85',
      media: [],
      status: 'published',
      featured: false,
      order_num: projects.length + 1,
    });
    setScopeInput('');
    setEquipmentInput('');
  };

  const handleEditProject = (p: Project) => {
    setEditingProject(p);
    setScopeInput(p.scope?.join('\n') || '');
    setEquipmentInput(p.equipment?.join('\n') || '');
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title) return;
    setActionLoading(true);
    try {
      const scopeArray = scopeInput.split('\n').map((s) => s.trim()).filter(Boolean);
      const eqArray = equipmentInput.split('\n').map((s) => s.trim()).filter(Boolean);

      const saved = await saveProject({
        ...editingProject,
        scope: scopeArray,
        equipment: eqArray,
      });

      setProjects((prev) => {
        const exists = prev.some((p) => p.id === saved.id);
        return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...prev];
      });

      setEditingProject(null);
      showNotification('success', `Project "${saved.title}" saved successfully.`);
      const logs = await fetchAuditLogs();
      setAuditLogs(logs);
    } catch (err) {
      showNotification('error', err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (!window.confirm(`Permanently remove project "${title}"?`)) return;
    setActionLoading(true);
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showNotification('success', `Project "${title}" deleted.`);
      const logs = await fetchAuditLogs();
      setAuditLogs(logs);
    } catch (err) {
      showNotification('error', 'Failed to delete project.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePublishProject = async (p: Project) => {
    const updatedStatus = p.status === 'published' ? 'draft' : 'published';
    const updated = await saveProject({ ...p, status: updatedStatus });
    setProjects((prev) => prev.map((item) => (item.id === p.id ? updated : item)));
    showNotification('success', `Project status set to ${updatedStatus}.`);
  };

  // --- FILE UPLOADER HANDLER ---
  const handleFileUpload = async (file: File, target: 'projectCover' | 'projectMedia' | 'gallery' | 'news') => {
    setUploadingFile(true);
    try {
      const url = await uploadMediaFile(file);
      if (target === 'projectCover' && editingProject) {
        setEditingProject({ ...editingProject, cover_url: url });
      } else if (target === 'projectMedia' && editingProject) {
        setEditingProject({ ...editingProject, media: [...(editingProject.media || []), url] });
      } else if (target === 'gallery' && editingGallery) {
        setEditingGallery({ ...editingGallery, image_url: url });
      } else if (target === 'news' && editingNews) {
        setEditingNews({ ...editingNews, cover_url: url });
      }
      showNotification('success', 'File verified and processed successfully.');
    } catch (err) {
      showNotification('error', err instanceof Error ? err.message : 'File upload failed.');
    } finally {
      setUploadingFile(false);
    }
  };

  // --- GALLERY ACTIONS ---
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery?.title || !editingGallery?.image_url) return;
    setActionLoading(true);
    try {
      const saved = await saveGalleryItem(editingGallery);
      setGallery((prev) => {
        const exists = prev.some((g) => g.id === saved.id);
        return exists ? prev.map((g) => (g.id === saved.id ? saved : g)) : [saved, ...prev];
      });
      setEditingGallery(null);
      showNotification('success', 'Gallery item saved.');
    } catch (err) {
      showNotification('error', 'Failed to save gallery item.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!window.confirm('Delete this gallery media item?')) return;
    await deleteGalleryItem(id);
    setGallery((prev) => prev.filter((g) => g.id !== id));
    showNotification('success', 'Gallery item removed.');
  };

  // --- SERVICES ACTIONS ---
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title) return;
    setActionLoading(true);
    try {
      const saved = await saveService(editingService);
      setServices((prev) => {
        const exists = prev.some((s) => s.id === saved.id);
        return exists ? prev.map((s) => (s.id === saved.id ? saved : s)) : [...prev, saved];
      });
      setEditingService(null);
      showNotification('success', 'Service updated successfully.');
    } catch (err) {
      showNotification('error', 'Failed to save service.');
    } finally {
      setActionLoading(false);
    }
  };

  // --- NEWS ACTIONS ---
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews?.title || !editingNews?.content) return;
    setActionLoading(true);
    try {
      const saved = await saveNewsItem(editingNews);
      setNews((prev) => {
        const exists = prev.some((n) => n.id === saved.id);
        return exists ? prev.map((n) => (n.id === saved.id ? saved : n)) : [saved, ...prev];
      });
      setEditingNews(null);
      showNotification('success', 'News announcement saved.');
    } catch (err) {
      showNotification('error', 'Failed to save news.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!window.confirm('Delete this news publication?')) return;
    await deleteNewsItem(id);
    setNews((prev) => prev.filter((n) => n.id !== id));
    showNotification('success', 'News item removed.');
  };

  // --- ENQUIRY ACTIONS ---
  const handleStatusChange = async (id: string, status: Enquiry['status']) => {
    await updateEnquiryStatus(id, status);
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    showNotification('success', `Enquiry marked as ${status}.`);
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!window.confirm('Delete this client enquiry record?')) return;
    await deleteEnquiry(id);
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    if (viewingEnquiry?.id === id) setViewingEnquiry(null);
    showNotification('success', 'Enquiry deleted.');
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-[#0B0D11] flex items-center justify-center text-[#B9C0C9]">
        <div className="space-y-4 text-center">
          <div className="w-8 h-8 border-2 border-[#FF6B18] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest">Verifying Secure Admin Authorization…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D11] text-[#F5F5F2] flex flex-col">
      {/* Top Admin Bar */}
      <header className="h-16 bg-[#111318] border-b border-white/[0.08] px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-6">
          <BrandLogo isAdmin={true} />

          {/* Database Connection Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/10 text-[11px]">
            <Database className={`w-3.5 h-3.5 ${isLiveSupabase ? 'text-emerald-400' : 'text-[#FF6B18]'}`} />
            <span className="text-[#B9C0C9]">
              {isLiveSupabase ? 'Supabase Database Connected' : 'Local Persistence Store'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#B9C0C9] hover:text-[#FF6B18] transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <span className="hidden md:inline-block text-xs text-[#7A838E] border-l border-white/10 pl-4">
            Signed in as: <span className="text-[#F5F5F2] font-semibold">{adminEmail}</span>
          </span>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-400 bg-red-950/20 border border-red-500/20 hover:bg-red-900/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-[#111318] border-b md:border-b-0 md:border-r border-white/[0.08] p-4 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {[
            { id: 'projects', label: 'Projects', icon: Briefcase, count: projects.length },
            { id: 'gallery', label: 'Field Gallery', icon: Image, count: gallery.length },
            { id: 'services', label: 'Services', icon: Wrench, count: services.length },
            { id: 'news', label: 'News & Updates', icon: Newspaper, count: news.length },
            { id: 'enquiries', label: 'Client Inquiries', icon: Inbox, count: enquiries.filter((e) => e.status === 'new').length },
            { id: 'activity', label: 'Audit Trail', icon: Activity, count: auditLogs.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setEditingProject(null);
                  setEditingService(null);
                  setEditingGallery(null);
                  setEditingNews(null);
                }}
                className={`flex items-center justify-between px-3.5 py-3 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#FF6B18] text-white shadow-glow-orange'
                    : 'text-[#B9C0C9] hover:bg-white/[0.04] hover:text-[#F5F5F2]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-none font-mono ${
                      isActive ? 'bg-black/30 text-white' : 'bg-white/[0.06] text-[#7A838E]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto bg-[#0E1015]">
          {/* Notification Toast */}
          {feedback && (
            <div
              className={`p-4 mb-6 flex items-start gap-3 border transition-all ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-950/40 border-red-500/30 text-red-300'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
              )}
              <span className="text-xs font-medium">{feedback.message}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 1: PROJECTS */}
          {/* ============================================================== */}
          {activeTab === 'projects' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#F5F5F2]">
                    Projects Management
                  </h2>
                  <p className="text-xs text-[#7A838E]">
                    Published projects automatically synchronize to the public website showcase.
                  </p>
                </div>
                {!editingProject && (
                  <button
                    onClick={handleStartCreateProject}
                    className="btn-primary text-xs tracking-wider"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    New Project Profile
                  </button>
                )}
              </div>

              {/* PROJECT EDITOR FORM */}
              {editingProject ? (
                <div className="p-8 bg-[#171A20] border border-white/10 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <h3 className="text-lg font-bold text-[#F5F5F2]">
                      {editingProject.id ? 'Edit Project Profile' : 'Create New Project Profile'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="text-xs text-[#B9C0C9] hover:text-white"
                    >
                      Cancel & Return
                    </button>
                  </div>

                  <form onSubmit={handleSaveProject} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B9C0C9]">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProject.title || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                          placeholder="e.g. Surface Mining & Overburden Removal"
                          className="w-full bg-[#111318] border border-white/10 px-4 py-2.5 text-xs text-[#F5F5F2] focus:outline-none focus:border-[#FF6B18]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B9C0C9]">
                          Category Sector
                        </label>
                        <select
                          value={editingProject.category || 'Mining Services'}
                          onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                          className="w-full bg-[#111318] border border-white/10 px-4 py-2.5 text-xs text-[#F5F5F2] focus:outline-none focus:border-[#FF6B18]"
                        >
                          <option value="Mining Services">Mining Services</option>
                          <option value="Earthwork & Excavation">Earthwork & Excavation</option>
                          <option value="Material Handling">Material Handling</option>
                          <option value="Road Construction">Road Construction</option>
                          <option value="Infrastructure Development">Infrastructure Development</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B9C0C9]">
                          Location
                        </label>
                        <input
                          type="text"
                          value={editingProject.location || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                          placeholder="e.g. Central Mining Belt"
                          className="w-full bg-[#111318] border border-white/10 px-4 py-2.5 text-xs text-[#F5F5F2] focus:outline-none focus:border-[#FF6B18]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B9C0C9]">
                          Client / Sector Classification
                        </label>
                        <input
                          type="text"
                          value={editingProject.client || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                          placeholder="e.g. Industrial Mineral Consortium"
                          className="w-full bg-[#111318] border border-white/10 px-4 py-2.5 text-xs text-[#F5F5F2] focus:outline-none focus:border-[#FF6B18]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B9C0C9]">
                        Short Summary
                      </label>
                      <input
                        type="text"
                        value={editingProject.summary || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                        placeholder="Brief 1-sentence synopsis for project card preview..."
                        className="w-full bg-[#111318] border border-white/10 px-4 py-2.5 text-xs text-[#F5F5F2] focus:outline-none focus:border-[#FF6B18]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B9C0C9]">
                        Detailed Execution Narrative *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={editingProject.description || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                        placeholder="Thorough description of operations, pit conditions, compaction standards..."
                        className="w-full bg-[#111318] border border-white/10 px-4 py-2.5 text-xs text-[#F5F5F2] focus:outline-none focus:border-[#FF6B18]"
                      />
                    </div>

                    {/* Scope & Equipment inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B9C0C9]">
                          Scope Items (One per line)
                        </label>
                        <textarea
                          rows={4}
                          value={scopeInput}
                          onChange={(e) => setScopeInput(e.target.value)}
                          placeholder="Topsoil preservation&#10;Overburden mass excavation&#10;Bench slope stabilization"
                          className="w-full bg-[#111318] border border-white/10 px-4 py-2.5 text-xs text-[#F5F5F2] focus:outline-none focus:border-[#FF6B18]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B9C0C9]">
                          Heavy Plant & Equipment Deployed (One per line)
                        </label>
                        <textarea
                          rows={4}
                          value={equipmentInput}
                          onChange={(e) => setEquipmentInput(e.target.value)}
                          placeholder="30T - 48T Heavy Excavators&#10;Multi-axle Tipper Dumpers&#10;Vibratory Soil Compactors"
                          className="w-full bg-[#111318] border border-white/10 px-4 py-2.5 text-xs text-[#F5F5F2] focus:outline-none focus:border-[#FF6B18]"
                        />
                      </div>
                    </div>

                    {/* Cover Image & Upload */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B9C0C9]">
                        Cover Photo
                      </label>
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <input
                          type="text"
                          value={editingProject.cover_url || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, cover_url: e.target.value })}
                          placeholder="Image URL or upload below"
                          className="flex-1 bg-[#111318] border border-white/10 px-4 py-2.5 text-xs text-[#F5F5F2] focus:outline-none focus:border-[#FF6B18]"
                        />
                        <label className="cursor-pointer btn-secondary text-xs py-2.5 px-4 whitespace-nowrap">
                          <Upload className="w-3.5 h-3.5 mr-1" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleFileUpload(e.target.files[0], 'projectCover');
                              }
                            }}
                          />
                        </label>
                      </div>

                      {editingProject.cover_url && (
                        <div className="w-32 h-20 border border-white/10 overflow-hidden mt-2">
                          <img src={editingProject.cover_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    {/* Status & Featured */}
                    <div className="flex items-center gap-8 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                        <input
                          type="checkbox"
                          checked={editingProject.status === 'published'}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              status: e.target.checked ? 'published' : 'draft',
                            })
                          }
                          className="accent-[#FF6B18] w-4 h-4"
                        />
                        <span>Publish to Public Website</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                        <input
                          type="checkbox"
                          checked={editingProject.featured || false}
                          onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                          className="accent-[#FF6B18] w-4 h-4"
                        />
                        <span>Feature on Homepage</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="btn-primary text-xs"
                      >
                        {actionLoading ? 'Saving Project…' : 'Save Project Profile'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProject(null)}
                        className="btn-secondary text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* PROJECTS LIST TABLE */
                <div className="bg-[#171A20] border border-white/10 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#111318] border-b border-white/10 text-[10px] uppercase tracking-wider text-[#7A838E]">
                      <tr>
                        <th className="p-4">Cover</th>
                        <th className="p-4">Project Title</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {projects.map((project) => (
                        <tr key={project.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4">
                            <img
                              src={project.cover_url}
                              alt=""
                              className="w-16 h-10 object-cover border border-white/10"
                            />
                          </td>
                          <td className="p-4 font-bold text-[#F5F5F2]">
                            {project.title}
                            {project.featured && (
                              <span className="ml-2 text-[9px] bg-[#FF6B18]/20 text-[#FF6B18] px-1.5 py-0.5 uppercase tracking-wider font-bold">
                                Featured
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-[#B9C0C9]">{project.category}</td>
                          <td className="p-4 text-[#7A838E]">{project.location || '—'}</td>
                          <td className="p-4">
                            <button
                              onClick={() => handleTogglePublishProject(project)}
                              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                                project.status === 'published'
                                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                                  : 'bg-amber-950/40 text-amber-300 border-amber-500/30'
                              }`}
                            >
                              {project.status === 'published' ? 'Published' : 'Draft'}
                            </button>
                          </td>
                          <td className="p-4 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => handleEditProject(project)}
                              className="p-1.5 text-[#B9C0C9] hover:text-[#FF6B18] transition-colors"
                              title="Edit Project"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id, project.title)}
                              className="p-1.5 text-[#B9C0C9] hover:text-red-400 transition-colors"
                              title="Delete Project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: GALLERY */}
          {/* ============================================================== */}
          {activeTab === 'gallery' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#F5F5F2]">
                    Field Gallery Management
                  </h2>
                  <p className="text-xs text-[#7A838E]">
                    Upload and categorize heavy equipment photography and site operations.
                  </p>
                </div>
                {!editingGallery && (
                  <button
                    onClick={() =>
                      setEditingGallery({
                        title: '',
                        category: 'Mining Operations',
                        image_url: '',
                        caption: '',
                        is_featured: false,
                        order_num: gallery.length + 1,
                      })
                    }
                    className="btn-primary text-xs tracking-wider"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Media Item
                  </button>
                )}
              </div>

              {/* GALLERY ITEM EDITOR */}
              {editingGallery ? (
                <div className="p-8 bg-[#171A20] border border-white/10 space-y-6 max-w-2xl">
                  <h3 className="text-lg font-bold text-[#F5F5F2]">
                    {editingGallery.id ? 'Edit Media Item' : 'Upload New Gallery Media'}
                  </h3>
                  <form onSubmit={handleSaveGallery} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-[#B9C0C9]">Title *</label>
                      <input
                        type="text"
                        required
                        value={editingGallery.title || ''}
                        onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                        className="w-full bg-[#111318] border border-white/10 px-4 py-2 text-xs text-[#F5F5F2]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-[#B9C0C9]">Category</label>
                      <select
                        value={editingGallery.category || 'Mining Operations'}
                        onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value })}
                        className="w-full bg-[#111318] border border-white/10 px-4 py-2 text-xs text-[#F5F5F2]"
                      >
                        <option value="Mining Operations">Mining Operations</option>
                        <option value="Material Handling">Material Handling</option>
                        <option value="Earthwork & Excavation">Earthwork & Excavation</option>
                        <option value="Road Construction">Road Construction</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase text-[#B9C0C9]">Image File / URL *</label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          required
                          value={editingGallery.image_url || ''}
                          onChange={(e) => setEditingGallery({ ...editingGallery, image_url: e.target.value })}
                          placeholder="Paste image URL or upload"
                          className="flex-1 bg-[#111318] border border-white/10 px-4 py-2 text-xs text-[#F5F5F2]"
                        />
                        <label className="cursor-pointer btn-secondary text-xs py-2 px-3 whitespace-nowrap">
                          <Upload className="w-3.5 h-3.5 mr-1" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'gallery');
                            }}
                          />
                        </label>
                      </div>
                      {editingGallery.image_url && (
                        <img src={editingGallery.image_url} alt="" className="w-32 h-20 object-cover border border-white/10" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-[#B9C0C9]">Caption</label>
                      <input
                        type="text"
                        value={editingGallery.caption || ''}
                        onChange={(e) => setEditingGallery({ ...editingGallery, caption: e.target.value })}
                        placeholder="Brief description of field activity..."
                        className="w-full bg-[#111318] border border-white/10 px-4 py-2 text-xs text-[#F5F5F2]"
                      />
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-white/10">
                      <button type="submit" className="btn-primary text-xs">Save to Gallery</button>
                      <button type="button" onClick={() => setEditingGallery(null)} className="btn-secondary text-xs">Cancel</button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {gallery.map((item) => (
                    <div key={item.id} className="bg-[#171A20] border border-white/10 overflow-hidden flex flex-col justify-between">
                      <div className="relative h-48">
                        <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#111318]/90 text-[#FF6B18]">
                          {item.category}
                        </span>
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-[#F5F5F2]">{item.title}</h4>
                          {item.caption && <p className="text-[10px] text-[#7A838E] line-clamp-1">{item.caption}</p>}
                        </div>
                        <button
                          onClick={() => handleDeleteGallery(item.id)}
                          className="p-1.5 text-[#B9C0C9] hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: SERVICES */}
          {/* ============================================================== */}
          {activeTab === 'services' && (
            <div className="space-y-8">
              <div className="pb-6 border-b border-white/[0.08]">
                <h2 className="text-2xl font-bold tracking-tight text-[#F5F5F2]">Services Disciplines</h2>
                <p className="text-xs text-[#7A838E]">Core sectors offered to mining and infrastructure clients.</p>
              </div>

              {editingService ? (
                <div className="p-8 bg-[#171A20] border border-white/10 space-y-6 max-w-2xl">
                  <h3 className="text-lg font-bold text-[#F5F5F2]">Edit Service Sector</h3>
                  <form onSubmit={handleSaveService} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-[#B9C0C9]">Title</label>
                      <input
                        type="text"
                        required
                        value={editingService.title || ''}
                        onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                        className="w-full bg-[#111318] border border-white/10 px-4 py-2 text-xs text-[#F5F5F2]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-[#B9C0C9]">Short Description</label>
                      <textarea
                        rows={3}
                        required
                        value={editingService.description || ''}
                        onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                        className="w-full bg-[#111318] border border-white/10 px-4 py-2 text-xs text-[#F5F5F2]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-[#B9C0C9]">Detailed Technical Scope</label>
                      <textarea
                        rows={4}
                        value={editingService.details || ''}
                        onChange={(e) => setEditingService({ ...editingService, details: e.target.value })}
                        className="w-full bg-[#111318] border border-white/10 px-4 py-2 text-xs text-[#F5F5F2]"
                      />
                    </div>
                    <div className="flex gap-4 pt-4 border-t border-white/10">
                      <button type="submit" className="btn-primary text-xs">Save Service</button>
                      <button type="button" onClick={() => setEditingService(null)} className="btn-secondary text-xs">Cancel</button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <div key={service.id} className="p-6 bg-[#171A20] border border-white/10 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-[#FF6B18] font-mono">{service.order_num}</span>
                          <button
                            onClick={() => setEditingService(service)}
                            className="p-1.5 text-[#B9C0C9] hover:text-[#FF6B18]"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="text-base font-bold text-[#F5F5F2]">{service.title}</h4>
                        <p className="text-xs text-[#7A838E] leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: NEWS */}
          {/* ============================================================== */}
          {activeTab === 'news' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#F5F5F2]">News & Releases</h2>
                  <p className="text-xs text-[#7A838E]">Publish corporate updates, fleet expansion stories, and safety protocols.</p>
                </div>
                {!editingNews && (
                  <button
                    onClick={() =>
                      setEditingNews({
                        title: '',
                        excerpt: '',
                        content: '',
                        category: 'Operational Update',
                        is_published: true,
                        cover_url: 'https://images.unsplash.com/photo-1711012604128-8339024a3e12?auto=format&fit=crop&w=1400&q=85',
                      })
                    }
                    className="btn-primary text-xs tracking-wider"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Compose Article
                  </button>
                )}
              </div>

              {editingNews ? (
                <div className="p-8 bg-[#171A20] border border-white/10 space-y-6 max-w-2xl">
                  <h3 className="text-lg font-bold text-[#F5F5F2]">{editingNews.id ? 'Edit Article' : 'Draft New Article'}</h3>
                  <form onSubmit={handleSaveNews} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-[#B9C0C9]">Article Title *</label>
                      <input
                        type="text"
                        required
                        value={editingNews.title || ''}
                        onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                        className="w-full bg-[#111318] border border-white/10 px-4 py-2 text-xs text-[#F5F5F2]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-[#B9C0C9]">Category Tag</label>
                      <input
                        type="text"
                        value={editingNews.category || ''}
                        onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })}
                        placeholder="Fleet Expansion, Safety, etc."
                        className="w-full bg-[#111318] border border-white/10 px-4 py-2 text-xs text-[#F5F5F2]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-[#B9C0C9]">Excerpt Summary</label>
                      <textarea
                        rows={2}
                        value={editingNews.excerpt || ''}
                        onChange={(e) => setEditingNews({ ...editingNews, excerpt: e.target.value })}
                        className="w-full bg-[#111318] border border-white/10 px-4 py-2 text-xs text-[#F5F5F2]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-[#B9C0C9]">Full Article Content *</label>
                      <textarea
                        rows={6}
                        required
                        value={editingNews.content || ''}
                        onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                        className="w-full bg-[#111318] border border-white/10 px-4 py-2 text-xs text-[#F5F5F2]"
                      />
                    </div>
                    <div className="flex gap-4 pt-4 border-t border-white/10">
                      <button type="submit" className="btn-primary text-xs">Publish Article</button>
                      <button type="button" onClick={() => setEditingNews(null)} className="btn-secondary text-xs">Cancel</button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="space-y-4">
                  {news.map((item) => (
                    <div key={item.id} className="p-6 bg-[#171A20] border border-white/10 flex items-center justify-between">
                      <div className="space-y-1 max-w-2xl">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B18]">{item.category}</span>
                        <h4 className="text-base font-bold text-[#F5F5F2]">{item.title}</h4>
                        <p className="text-xs text-[#7A838E] line-clamp-1">{item.excerpt}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setEditingNews(item)} className="p-2 text-[#B9C0C9] hover:text-[#FF6B18]">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteNews(item.id)} className="p-2 text-[#B9C0C9] hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: CLIENT ENQUIRIES (PRIVATE TO ADMIN ONLY) */}
          {/* ============================================================== */}
          {activeTab === 'enquiries' && (
            <div className="space-y-8">
              <div className="pb-6 border-b border-white/[0.08]">
                <h2 className="text-2xl font-bold tracking-tight text-[#F5F5F2]">Client Enquiries & Quote Requests</h2>
                <p className="text-xs text-[#7A838E]">
                  Private tender requests and client specifications submitted via the website contact form.
                </p>
              </div>

              {enquiries.length === 0 ? (
                <div className="p-16 text-center bg-[#171A20] border border-white/10">
                  <Inbox className="w-8 h-8 text-[#7A838E] mx-auto mb-3" />
                  <p className="text-sm font-semibold text-[#F5F5F2]">No enquiries received yet.</p>
                </div>
              ) : (
                <div className="bg-[#171A20] border border-white/10 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#111318] border-b border-white/10 text-[10px] uppercase tracking-wider text-[#7A838E]">
                      <tr>
                        <th className="p-4">Date</th>
                        <th className="p-4">Client Name</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">Service</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {enquiries.map((enq) => (
                        <tr key={enq.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 text-[#7A838E] whitespace-nowrap">
                            {new Date(enq.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-4 font-bold text-[#F5F5F2]">
                            {enq.name}
                            {enq.company && <span className="block text-[11px] font-normal text-[#7A838E]">{enq.company}</span>}
                          </td>
                          <td className="p-4 text-[#B9C0C9]">
                            <div>{enq.email}</div>
                            {enq.phone && <div className="text-[#7A838E]">{enq.phone}</div>}
                          </td>
                          <td className="p-4 text-[#FF6B18] font-semibold">{enq.service}</td>
                          <td className="p-4">
                            <select
                              value={enq.status}
                              onChange={(e) => handleStatusChange(enq.id, e.target.value as any)}
                              className="bg-[#111318] border border-white/10 text-[10px] uppercase font-bold tracking-wider px-2 py-1 text-[#F5F5F2] focus:outline-none"
                            >
                              <option value="new">New</option>
                              <option value="in_review">In Review</option>
                              <option value="responded">Responded</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>
                          <td className="p-4 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => setViewingEnquiry(enq)}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-white/[0.04] border border-white/10 text-[#F5F5F2] hover:border-[#FF6B18]"
                            >
                              View Scope
                            </button>
                            <button
                              onClick={() => handleDeleteEnquiry(enq.id)}
                              className="p-1.5 text-[#B9C0C9] hover:text-red-400"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* View Scope Modal */}
              {viewingEnquiry && (
                <div
                  className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                  onClick={() => setViewingEnquiry(null)}
                >
                  <div
                    className="bg-[#171A20] border border-white/10 p-8 max-w-xl w-full space-y-5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <h3 className="text-lg font-bold text-[#F5F5F2]">Client Enquiry Specifications</h3>
                      <button onClick={() => setViewingEnquiry(null)} className="text-[#B9C0C9] hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-4 p-4 bg-[#111318]">
                        <div>
                          <span className="text-[10px] uppercase text-[#7A838E] block">Client Name</span>
                          <span className="font-bold text-[#F5F5F2]">{viewingEnquiry.name}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-[#7A838E] block">Company</span>
                          <span className="font-bold text-[#F5F5F2]">{viewingEnquiry.company || '—'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-[#7A838E] block">Email</span>
                          <a href={`mailto:${viewingEnquiry.email}`} className="text-[#FF6B18] underline">
                            {viewingEnquiry.email}
                          </a>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-[#7A838E] block">Phone / WhatsApp</span>
                          <span className="text-[#F5F5F2]">{viewingEnquiry.phone || '—'}</span>
                        </div>
                      </div>

                      <div className="p-4 bg-[#111318] space-y-2">
                        <span className="text-[10px] uppercase text-[#FF6B18] font-bold block">
                          Submitted Project Scope & Requirements:
                        </span>
                        <p className="text-[#F5F5F2] leading-relaxed whitespace-pre-wrap">
                          {viewingEnquiry.message}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center">
                      <a
                        href={`mailto:${viewingEnquiry.email}?subject=RE:%20Trimurti%20Project%20Scope%20Discussion`}
                        className="btn-primary text-xs py-2 px-4"
                      >
                        Reply via Email
                      </a>
                      <button
                        onClick={() => setViewingEnquiry(null)}
                        className="btn-secondary text-xs py-2 px-4"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 6: AUDIT TRAIL */}
          {/* ============================================================== */}
          {activeTab === 'activity' && (
            <div className="space-y-8">
              <div className="pb-6 border-b border-white/[0.08]">
                <h2 className="text-2xl font-bold tracking-tight text-[#F5F5F2]">Administrative Activity & Audit Log</h2>
                <p className="text-xs text-[#7A838E]">
                  Immutable ledger of changes, creations and deletions performed on the system.
                </p>
              </div>

              <div className="bg-[#171A20] border border-white/10 divide-y divide-white/[0.06]">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 bg-[#111318] border border-white/10 text-[10px] font-mono text-[#FF6B18]">
                        {log.action}
                      </span>
                      <span className="font-semibold text-[#F5F5F2]">{log.entity}</span>
                      {log.entity_id && <span className="text-[#7A838E]">({log.entity_id})</span>}
                    </div>
                    <span className="text-[#7A838E] text-[11px]">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
