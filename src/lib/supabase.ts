import { createClient } from '@supabase/supabase-js';
import { Project, Service, GalleryItem, NewsItem, Enquiry, AuditLog } from '../types';
import { INITIAL_PROJECTS, INITIAL_SERVICES, INITIAL_GALLERY, INITIAL_NEWS } from './seedData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isLiveSupabase = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project')
);

export const supabase = isLiveSupabase
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================================================
// LOCAL STORAGE MOCK ENGINE (Ensures complete offline/local testing functionality)
// ============================================================================
const STORAGE_KEYS = {
  PROJECTS: 'trimurti_projects',
  SERVICES: 'trimurti_services',
  GALLERY: 'trimurti_gallery',
  NEWS: 'trimurti_news',
  ENQUIRIES: 'trimurti_enquiries',
  AUDIT: 'trimurti_audit_logs',
  SESSION: 'trimurti_admin_session',
};

const getFromStorage = <T>(key: string, defaultVal: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const saveToStorage = <T>(key: string, val: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error('Storage save error:', err);
  }
};

// Initialize seed data in storage if not present
const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    saveToStorage(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    saveToStorage(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) {
    saveToStorage(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NEWS)) {
    saveToStorage(STORAGE_KEYS.NEWS, INITIAL_NEWS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ENQUIRIES)) {
    saveToStorage(STORAGE_KEYS.ENQUIRIES, [
      {
        id: 'enq-01',
        name: 'Rajesh Sharma',
        email: 'r.sharma@conglom-infra.in',
        phone: '+91 98230 45678',
        company: 'Apex Infrastructure Group',
        service: 'Mining Services',
        message: 'Looking for overburden removal contractor for 45-hectare quarry expansion. Need timeline estimates.',
        status: 'in_review',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'enq-02',
        name: 'Vikram Deshmukh',
        email: 'deshmukh.v@maharoads.org',
        phone: '+91 94220 11223',
        company: 'Corridor Logistics Ltd',
        service: 'Road Construction',
        message: 'Requirement for heavy haul road formation and culvert construction connecting mining zone to highway.',
        status: 'new',
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    ]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT)) {
    saveToStorage(STORAGE_KEYS.AUDIT, [
      {
        id: 'audit-01',
        action: 'SYSTEM_INIT',
        entity: 'System',
        entity_id: 'trimurti-core',
        details: { message: 'Database initialized with authentic baseline schema' },
        created_at: new Date().toISOString(),
      },
    ]);
  }
};

if (typeof window !== 'undefined') {
  initLocalStorage();
}

// Log audit trail
export const logAudit = async (action: string, entity: string, entity_id?: string, details?: any) => {
  const logEntry: AuditLog = {
    id: `audit-${Date.now()}`,
    action,
    entity,
    entity_id,
    details,
    created_at: new Date().toISOString(),
  };

  if (isLiveSupabase && supabase) {
    try {
      await supabase.from('audit_logs').insert([logEntry]);
    } catch (e) {
      console.warn('Could not write to Supabase audit_logs:', e);
    }
  }

  const logs = getFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT, []);
  saveToStorage(STORAGE_KEYS.AUDIT, [logEntry, ...logs]);
};

// ============================================================================
// DATA ACCESS API (Transparent switch between Live Supabase and Mock Storage)
// ============================================================================

// --- PROJECTS ---
export const fetchProjects = async (publicOnly = true): Promise<Project[]> => {
  if (isLiveSupabase && supabase) {
    let query = supabase.from('projects').select('*').order('order_num', { ascending: true });
    if (publicOnly) {
      query = query.eq('status', 'published');
    }
    const { data, error } = await query;
    if (!error && data) return data as Project[];
    console.warn('Supabase projects fetch error, falling back to local data:', error);
  }

  const local = getFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  return publicOnly ? local.filter((p) => p.status === 'published') : local;
};

export const fetchProjectBySlug = async (slug: string): Promise<Project | null> => {
  if (isLiveSupabase && supabase) {
    const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single();
    if (!error && data) return data as Project;
  }
  const local = getFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  return local.find((p) => p.slug === slug) || null;
};

export const saveProject = async (project: Partial<Project>): Promise<Project> => {
  const isNew = !project.id;
  const projectToSave: Project = {
    id: project.id || `p-${Date.now()}`,
    title: project.title || 'Untitled Project',
    slug: project.slug || (project.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    category: project.category || 'Mining Operations',
    location: project.location || '',
    client: project.client || '',
    summary: project.summary || '',
    description: project.description || '',
    scope: project.scope || [],
    equipment: project.equipment || [],
    cover_url: project.cover_url || 'https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?auto=format&fit=crop&w=1600&q=85',
    media: project.media || [],
    status: project.status || 'published',
    featured: project.featured ?? false,
    order_num: project.order_num ?? 0,
    created_at: project.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isLiveSupabase && supabase) {
    const { data, error } = await supabase
      .from('projects')
      .upsert(projectToSave)
      .select()
      .single();
    if (!error && data) {
      await logAudit(isNew ? 'CREATE_PROJECT' : 'UPDATE_PROJECT', 'Project', projectToSave.id, { title: projectToSave.title });
      return data as Project;
    }
    console.warn('Supabase save error, persisting locally:', error);
  }

  const local = getFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  const updated = isNew
    ? [projectToSave, ...local]
    : local.map((p) => (p.id === projectToSave.id ? projectToSave : p));
  saveToStorage(STORAGE_KEYS.PROJECTS, updated);
  await logAudit(isNew ? 'CREATE_PROJECT' : 'UPDATE_PROJECT', 'Project', projectToSave.id, { title: projectToSave.title });
  return projectToSave;
};

export const deleteProject = async (id: string): Promise<void> => {
  if (isLiveSupabase && supabase) {
    await supabase.from('projects').delete().eq('id', id);
  }
  const local = getFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  saveToStorage(STORAGE_KEYS.PROJECTS, local.filter((p) => p.id !== id));
  await logAudit('DELETE_PROJECT', 'Project', id);
};

// --- SERVICES ---
export const fetchServices = async (): Promise<Service[]> => {
  if (isLiveSupabase && supabase) {
    const { data, error } = await supabase.from('services').select('*').order('order_num', { ascending: true });
    if (!error && data) return data as Service[];
  }
  return getFromStorage<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
};

export const saveService = async (service: Partial<Service>): Promise<Service> => {
  const isNew = !service.id;
  const toSave: Service = {
    id: service.id || `s-${Date.now()}`,
    order_num: service.order_num || '01',
    title: service.title || 'Untitled Service',
    slug: service.slug || (service.title || 'service').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: service.description || '',
    details: service.details || '',
    icon: service.icon || 'HardHat',
    image_url: service.image_url || 'https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?auto=format&fit=crop&w=1400&q=85',
    is_active: service.is_active ?? true,
  };

  if (isLiveSupabase && supabase) {
    const { data } = await supabase.from('services').upsert(toSave).select().single();
    if (data) return data as Service;
  }

  const local = getFromStorage<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  const updated = isNew
    ? [...local, toSave]
    : local.map((s) => (s.id === toSave.id ? toSave : s));
  saveToStorage(STORAGE_KEYS.SERVICES, updated);
  await logAudit(isNew ? 'CREATE_SERVICE' : 'UPDATE_SERVICE', 'Service', toSave.id, { title: toSave.title });
  return toSave;
};

export const deleteService = async (id: string): Promise<void> => {
  if (isLiveSupabase && supabase) {
    await supabase.from('services').delete().eq('id', id);
  }
  const local = getFromStorage<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  saveToStorage(STORAGE_KEYS.SERVICES, local.filter((s) => s.id !== id));
  await logAudit('DELETE_SERVICE', 'Service', id);
};

// --- GALLERY ---
export const fetchGallery = async (): Promise<GalleryItem[]> => {
  if (isLiveSupabase && supabase) {
    const { data, error } = await supabase.from('gallery').select('*').order('order_num', { ascending: true });
    if (!error && data) return data as GalleryItem[];
  }
  return getFromStorage<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
};

export const saveGalleryItem = async (item: Partial<GalleryItem>): Promise<GalleryItem> => {
  const isNew = !item.id;
  const toSave: GalleryItem = {
    id: item.id || `g-${Date.now()}`,
    title: item.title || 'Untitled Media',
    category: item.category || 'Mining Operations',
    image_url: item.image_url || 'https://images.unsplash.com/photo-1711012604128-8339024a3e12?auto=format&fit=crop&w=1400&q=85',
    caption: item.caption || '',
    is_featured: item.is_featured ?? false,
    order_num: item.order_num ?? 0,
    created_at: item.created_at || new Date().toISOString(),
  };

  if (isLiveSupabase && supabase) {
    const { data } = await supabase.from('gallery').upsert(toSave).select().single();
    if (data) return data as GalleryItem;
  }

  const local = getFromStorage<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
  const updated = isNew ? [toSave, ...local] : local.map((g) => (g.id === toSave.id ? toSave : g));
  saveToStorage(STORAGE_KEYS.GALLERY, updated);
  await logAudit(isNew ? 'CREATE_GALLERY' : 'UPDATE_GALLERY', 'Gallery', toSave.id);
  return toSave;
};

export const deleteGalleryItem = async (id: string): Promise<void> => {
  if (isLiveSupabase && supabase) {
    await supabase.from('gallery').delete().eq('id', id);
  }
  const local = getFromStorage<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
  saveToStorage(STORAGE_KEYS.GALLERY, local.filter((g) => g.id !== id));
  await logAudit('DELETE_GALLERY', 'Gallery', id);
};

// --- NEWS ---
export const fetchNews = async (publicOnly = true): Promise<NewsItem[]> => {
  if (isLiveSupabase && supabase) {
    let query = supabase.from('news').select('*').order('published_at', { ascending: false });
    if (publicOnly) {
      query = query.eq('is_published', true);
    }
    const { data, error } = await query;
    if (!error && data) return data as NewsItem[];
  }
  const local = getFromStorage<NewsItem[]>(STORAGE_KEYS.NEWS, INITIAL_NEWS);
  return publicOnly ? local.filter((n) => n.is_published) : local;
};

export const saveNewsItem = async (news: Partial<NewsItem>): Promise<NewsItem> => {
  const isNew = !news.id;
  const toSave: NewsItem = {
    id: news.id || `n-${Date.now()}`,
    title: news.title || 'Untitled Update',
    slug: news.slug || (news.title || 'news').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    excerpt: news.excerpt || '',
    content: news.content || '',
    cover_url: news.cover_url || 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=1400&q=85',
    category: news.category || 'Operational Update',
    published_at: news.published_at || new Date().toISOString(),
    is_published: news.is_published ?? true,
    created_at: news.created_at || new Date().toISOString(),
  };

  if (isLiveSupabase && supabase) {
    const { data } = await supabase.from('news').upsert(toSave).select().single();
    if (data) return data as NewsItem;
  }

  const local = getFromStorage<NewsItem[]>(STORAGE_KEYS.NEWS, INITIAL_NEWS);
  const updated = isNew ? [toSave, ...local] : local.map((n) => (n.id === toSave.id ? toSave : n));
  saveToStorage(STORAGE_KEYS.NEWS, updated);
  await logAudit(isNew ? 'CREATE_NEWS' : 'UPDATE_NEWS', 'News', toSave.id);
  return toSave;
};

export const deleteNewsItem = async (id: string): Promise<void> => {
  if (isLiveSupabase && supabase) {
    await supabase.from('news').delete().eq('id', id);
  }
  const local = getFromStorage<NewsItem[]>(STORAGE_KEYS.NEWS, INITIAL_NEWS);
  saveToStorage(STORAGE_KEYS.NEWS, local.filter((n) => n.id !== id));
  await logAudit('DELETE_NEWS', 'News', id);
};

// --- ENQUIRIES (SUBMITTED PUBLICLY, ADMIN ONLY VIEW) ---
export const submitEnquiry = async (enquiry: Omit<Enquiry, 'id' | 'status' | 'created_at'>): Promise<boolean> => {
  const newEnquiry: Enquiry = {
    ...enquiry,
    id: `enq-${Date.now()}`,
    status: 'new',
    created_at: new Date().toISOString(),
  };

  if (isLiveSupabase && supabase) {
    const { error } = await supabase.from('enquiries').insert([newEnquiry]);
    if (!error) return true;
    console.warn('Supabase enquiry insert failed, storing locally:', error);
  }

  const local = getFromStorage<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
  saveToStorage(STORAGE_KEYS.ENQUIRIES, [newEnquiry, ...local]);
  return true;
};

export const fetchEnquiries = async (): Promise<Enquiry[]> => {
  if (isLiveSupabase && supabase) {
    const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
    if (!error && data) return data as Enquiry[];
  }
  return getFromStorage<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
};

export const updateEnquiryStatus = async (id: string, status: Enquiry['status']): Promise<void> => {
  if (isLiveSupabase && supabase) {
    await supabase.from('enquiries').update({ status }).eq('id', id);
  }
  const local = getFromStorage<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
  saveToStorage(
    STORAGE_KEYS.ENQUIRIES,
    local.map((e) => (e.id === id ? { ...e, status } : e))
  );
  await logAudit('UPDATE_ENQUIRY_STATUS', 'Enquiry', id, { status });
};

export const deleteEnquiry = async (id: string): Promise<void> => {
  if (isLiveSupabase && supabase) {
    await supabase.from('enquiries').delete().eq('id', id);
  }
  const local = getFromStorage<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
  saveToStorage(STORAGE_KEYS.ENQUIRIES, local.filter((e) => e.id !== id));
  await logAudit('DELETE_ENQUIRY', 'Enquiry', id);
};

// --- AUDIT LOGS ---
export const fetchAuditLogs = async (): Promise<AuditLog[]> => {
  if (isLiveSupabase && supabase) {
    const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100);
    if (!error && data) return data as AuditLog[];
  }
  return getFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT, []);
};

// --- STORAGE UPLOAD ---
export const uploadMediaFile = async (file: File): Promise<string> => {
  // Validate file type & size (max 10MB)
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    throw new Error('Only image and video files are permitted.');
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File exceeds 10MB limit.');
  }

  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  if (isLiveSupabase && supabase) {
    const { error: uploadError } = await supabase.storage
      .from('trimurti-media')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (!uploadError) {
      const { data } = supabase.storage.from('trimurti-media').getPublicUrl(filePath);
      return data.publicUrl;
    }
    console.warn('Supabase storage upload error, falling back to base64 preview:', uploadError);
  }

  // Fallback to Base64 Data URL for offline testing
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
};

// ============================================================================
// AUTHENTICATION HELPER
// ============================================================================
export const adminAuth = {
  async signIn(email: string, pass: string): Promise<{ success: boolean; error?: string }> {
    if (isLiveSupabase && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    }

    // Local Demo / Offline admin credentials
    if (
      (email.trim().toLowerCase() === 'admin@trimurti.com' || email.trim().toLowerCase() === 'trimurtimininginfrastructure@gmail.com') &&
      pass === 'Trimurti@2026'
    ) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ email, loggedInAt: new Date().toISOString() }));
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid credentials or access is not authorized. For demo access use admin@trimurti.com / Trimurti@2026',
    };
  },

  async signOut(): Promise<void> {
    if (isLiveSupabase && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  async getSession(): Promise<{ authenticated: boolean; email?: string }> {
    if (isLiveSupabase && supabase) {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        return { authenticated: true, email: data.session.user.email };
      }
      return { authenticated: false };
    }

    try {
      const session = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (session) {
        const parsed = JSON.parse(session);
        return { authenticated: true, email: parsed.email };
      }
    } catch {}
    return { authenticated: false };
  },

  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    if (isLiveSupabase && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin`,
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    }
    return { success: true };
  },
};
