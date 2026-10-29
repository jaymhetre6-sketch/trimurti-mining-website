export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  location?: string;
  client?: string;
  summary?: string;
  description: string;
  scope: string[];
  equipment: string[];
  cover_url: string;
  media: string[];
  status: 'published' | 'draft' | 'archived';
  featured: boolean;
  order_num?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  order_num: string; // e.g., '01', '02'
  title: string;
  slug: string;
  description: string;
  details?: string;
  icon?: string;
  image_url?: string;
  is_active: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  caption?: string;
  is_featured?: boolean;
  order_num?: number;
  created_at?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url?: string;
  category?: string;
  published_at: string;
  is_published: boolean;
  created_at?: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  status: 'new' | 'in_review' | 'responded' | 'archived';
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  entity: string;
  entity_id?: string;
  details?: any;
  created_at: string;
}
