-- ==============================================================================
-- TRIMURTI MINING AND INFRASTRUCTURE PRIVATE LIMITED
-- PostgreSQL Database Schema & Row Level Security (RLS) Policies
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  location TEXT,
  client TEXT,
  summary TEXT,
  description TEXT,
  scope TEXT[],
  equipment TEXT[],
  cover_url TEXT NOT NULL,
  media TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  featured BOOLEAN DEFAULT false,
  order_num INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_num TEXT NOT NULL, -- e.g. '01', '02'
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  details TEXT,
  icon TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Mining Operations',
  image_url TEXT NOT NULL,
  caption TEXT,
  is_featured BOOLEAN DEFAULT false,
  order_num INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. NEWS & UPDATES TABLE
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_url TEXT,
  category TEXT DEFAULT 'Operational Update',
  published_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. ENQUIRIES TABLE (PRIVATE TO ADMINS)
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'responded', 'archived')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- PROJECTS
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
CREATE POLICY "Public can view published projects"
  ON public.projects FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Admins have full access to projects" ON public.projects;
CREATE POLICY "Admins have full access to projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- SERVICES
DROP POLICY IF EXISTS "Public can view active services" ON public.services;
CREATE POLICY "Public can view active services"
  ON public.services FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins have full access to services" ON public.services;
CREATE POLICY "Admins have full access to services"
  ON public.services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- GALLERY
DROP POLICY IF EXISTS "Public can view gallery" ON public.gallery;
CREATE POLICY "Public can view gallery"
  ON public.gallery FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins have full access to gallery" ON public.gallery;
CREATE POLICY "Admins have full access to gallery"
  ON public.gallery FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- NEWS
DROP POLICY IF EXISTS "Public can view published news" ON public.news;
CREATE POLICY "Public can view published news"
  ON public.news FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "Admins have full access to news" ON public.news;
CREATE POLICY "Admins have full access to news"
  ON public.news FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ENQUIRIES: PUBLIC CAN ONLY INSERT; AUTHENTICATED ADMINS CAN VIEW AND MANAGE
DROP POLICY IF EXISTS "Public can submit enquiries" ON public.enquiries;
CREATE POLICY "Public can submit enquiries"
  ON public.enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view and manage enquiries" ON public.enquiries;
CREATE POLICY "Admins can view and manage enquiries"
  ON public.enquiries FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- AUDIT LOGS
DROP POLICY IF EXISTS "Admins can manage audit logs" ON public.audit_logs;
CREATE POLICY "Admins can manage audit logs"
  ON public.audit_logs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKET CONFIGURATION (Execute in Supabase Storage SQL Editor)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('trimurti-media', 'trimurti-media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view trimurti-media" ON storage.objects;
CREATE POLICY "Public can view trimurti-media" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'trimurti-media');

DROP POLICY IF EXISTS "Admins can upload to trimurti-media" ON storage.objects;
CREATE POLICY "Admins can upload to trimurti-media" 
  ON storage.objects FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'trimurti-media');

DROP POLICY IF EXISTS "Admins can update in trimurti-media" ON storage.objects;
CREATE POLICY "Admins can update in trimurti-media" 
  ON storage.objects FOR UPDATE 
  TO authenticated 
  USING (bucket_id = 'trimurti-media');

DROP POLICY IF EXISTS "Admins can delete from trimurti-media" ON storage.objects;
CREATE POLICY "Admins can delete from trimurti-media" 
  ON storage.objects FOR DELETE 
  TO authenticated 
  USING (bucket_id = 'trimurti-media');

-- ==============================================================================
-- SEED DATA (Authentic Foundation Data)
-- ==============================================================================

-- SERVICES SEED
INSERT INTO public.services (order_num, title, slug, description, details, icon, image_url)
VALUES 
  ('01', 'Mining Services', 'mining-services', 'End-to-end operational support for responsible, efficient mining activity.', 'Overburden removal, bench development, open-cast excavation, precision blasting assistance, drilling and quarry management with stringent regulatory and environmental compliance.', 'Pickaxe', 'https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?auto=format&fit=crop&w=1400&q=85'),
  ('02', 'Infrastructure Development', 'infrastructure-development', 'Robust groundwork and infrastructure shaped around project requirements.', 'Site preparation, mass grade leveling, drainage network construction, industrial platform stabilization, retaining structures, and industrial facility foundations.', 'Building2', 'https://images.unsplash.com/photo-1711012604128-8339024a3e12?auto=format&fit=crop&w=1400&q=85'),
  ('03', 'Civil Construction', 'civil-construction', 'Disciplined civil execution built on planning, coordination and site safety.', 'Heavy RCC foundations, structural culverts, drainage conduits, industrial retaining walls, and utility corridors tailored for industrial projects.', 'HardHat', 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=1400&q=85'),
  ('04', 'Road Construction', 'road-construction', 'Reliable road formation and construction for industrial and public access.', 'Subgrade preparation, sub-base compaction, flexible and rigid pavement laying, heavy haul road construction for mine pits, and industrial access highways.', 'Milestone', 'https://images.unsplash.com/photo-1637669886956-bf0e1cc4f0d3?auto=format&fit=crop&w=1400&q=85'),
  ('05', 'Earthwork & Excavation', 'earthwork-excavation', 'Precision excavation, grading and land development for complex sites.', 'Mass cutting and filling, hillside slope cutting, embankment construction, soil stabilization, and GPS-guided heavy earthmoving.', 'Shovel', 'https://images.unsplash.com/photo-1719411606465-5143b163b608?auto=format&fit=crop&w=1400&q=85'),
  ('06', 'Material Handling', 'material-handling', 'Streamlined movement and handling of bulk materials across operations.', 'Crushing and screening logistics, internal haulage, tipper fleet dispatch, stockpile management, and bulk mineral transport.', 'Truck', 'https://images.unsplash.com/photo-1719411321415-acfbe793c0aa?auto=format&fit=crop&w=1400&q=85')
ON CONFLICT (slug) DO NOTHING;

-- PROJECTS SEED
INSERT INTO public.projects (title, slug, category, location, client, summary, description, scope, equipment, cover_url, media, status, featured, order_num)
VALUES
  (
    'Surface Mining & Overburden Removal',
    'surface-mining-overburden-removal',
    'Mining Operations',
    'Central Mining Belt',
    'Industrial Mineral Client',
    'Large-scale strata extraction, overburden excavation, and pit safety benching.',
    'Systematic open-cast operations including deep stratum overburden removal, controlled blasting assistance, pit haul road maintenance, and rapid overburden haulage to designated dump yards.',
    ARRAY['Topsoil preservation & stripping', 'Overburden excavation & haulage', 'Bench slope stabilization', 'Dust suppression & environmental mitigation'],
    ARRAY['Heavy Excavators (30T - 48T)', 'Multi-axle Tipper Dumpers', 'Crawler Dozers', 'Water Sprinklers'],
    'https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?auto=format&fit=crop&w=1600&q=85',
    ARRAY['https://images.unsplash.com/photo-1680463990599-9d318aaecf71?auto=format&fit=crop&w=1600&q=85', 'https://images.unsplash.com/photo-1711012604128-8339024a3e12?auto=format&fit=crop&w=1600&q=85'],
    'published',
    true,
    1
  ),
  (
    'Precision Earthwork & Site Grading',
    'precision-earthwork-site-grading',
    'Earthwork & Excavation',
    'Western Industrial Corridor',
    'Infrastructure Consortium',
    'Massive site leveling and terrain grading for an expansive industrial complex.',
    'High-volume bulk earthmoving involving cut-and-fill operations across rolling terrain, subgrade compaction to 98% MDD, and perimeter stormwater channel establishment.',
    ARRAY['Bulk cut & fill excavation', 'High-density compaction testing', 'Perimeter embankment grading', 'Foundation bench preparation'],
    ARRAY['Hydraulic Excavators', 'Vibratory Soil Compactors', 'Motor Graders', 'Heavy Tippers'],
    'https://images.unsplash.com/photo-1719411606465-5143b163b608?auto=format&fit=crop&w=1400&q=85',
    ARRAY['https://images.unsplash.com/photo-1517089152318-42ec560349c0?auto=format&fit=crop&w=1400&q=85'],
    'published',
    true,
    2
  ),
  (
    'Heavy Haulage & Pit Transport Operations',
    'heavy-haulage-pit-transport',
    'Material Handling',
    'Regional Mineral Zone',
    'Resource Development Corp',
    'Fleet management and synchronized continuous haulage of quarried aggregates.',
    'Integrated dispatch and haulage logistics operating 24/7 across pit ramps and processing crushers, ensuring seamless throughput and zero downtime for processing units.',
    ARRAY['Internal pit haulage', 'Crusher feeding logistics', 'Weighbridge integration & tracking', 'Fleet preventive maintenance'],
    ARRAY['Off-Highway Tippers (16-32 CuM)', 'Wheel Loaders', 'Service & Fuel Bowsers'],
    'https://images.unsplash.com/photo-1517089152318-42ec560349c0?auto=format&fit=crop&w=1400&q=85',
    ARRAY['https://images.unsplash.com/photo-1719411321415-acfbe793c0aa?auto=format&fit=crop&w=1800&q=85'],
    'published',
    true,
    3
  ),
  (
    'Industrial Highway & Heavy Access Formation',
    'industrial-highway-access-formation',
    'Road Construction',
    'Corridor Linkage Sector',
    'Highways & Access Authority',
    'Heavy-duty access road engineered to withstand sustained high-tonnage truck traffic.',
    'Construction of multi-lane reinforced industrial corridor including granular sub-base (GSB), wet mix macadam (WMM), dense bituminous macadam (DBM), and heavy reinforced concrete box culverts.',
    ARRAY['Subgrade stabilization', 'GSB & WMM layer laying', 'Asphalt paving & compaction', 'Cross-drainage culvert structures'],
    ARRAY['Asphalt Pavers', 'Pneumatic Tired Rollers', 'Tandem Vibratory Rollers', 'Transit Mixers'],
    'https://images.unsplash.com/photo-1637669886956-bf0e1cc4f0d3?auto=format&fit=crop&w=1400&q=85',
    ARRAY['https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=1400&q=85'],
    'published',
    true,
    4
  )
ON CONFLICT (slug) DO NOTHING;

-- GALLERY SEED
INSERT INTO public.gallery (title, category, image_url, caption, is_featured, order_num)
VALUES
  ('Heavy Excavator Pit Loading', 'Mining Operations', 'https://images.unsplash.com/photo-1711012604128-8339024a3e12?auto=format&fit=crop&w=1400&q=85', 'Hydraulic excavator executing precision bench loading into rigid haul tipper', true, 1),
  ('Highwall Mining Cut', 'Mining Operations', 'https://images.unsplash.com/photo-1680463990599-9d318aaecf71?auto=format&fit=crop&w=1600&q=85', 'Stratified rock formation and bench safety profile at surface mine', true, 2),
  ('Heavy Haul Truck en Route', 'Material Handling', 'https://images.unsplash.com/photo-1719411321415-acfbe793c0aa?auto=format&fit=crop&w=1800&q=85', 'Loaded heavy haul truck navigating graded industrial haul road', true, 3),
  ('Bulk Earthmoving & Grading', 'Earthwork & Excavation', 'https://images.unsplash.com/photo-1719411606465-5143b163b608?auto=format&fit=crop&w=1400&q=85', 'Synchronized earthmoving and grade stabilization on expansive terrain', true, 4),
  ('Aggregate Stockpile Management', 'Material Handling', 'https://images.unsplash.com/photo-1517089152318-42ec560349c0?auto=format&fit=crop&w=1400&q=85', 'Graded stone aggregate stockpiles ready for dispatch to infrastructure sites', true, 5),
  ('Industrial Road Base Laying', 'Road Construction', 'https://images.unsplash.com/photo-1637669886956-bf0e1cc4f0d3?auto=format&fit=crop&w=1400&q=85', 'Sub-base rolling and compaction along access logistics corridor', true, 6);

-- NEWS SEED
INSERT INTO public.news (title, slug, excerpt, content, cover_url, category, published_at, is_published)
VALUES
  (
    'Trimurti Expands Earthmoving Fleet with High-Capacity Hydraulic Excavators',
    'fleet-expansion-hydraulic-excavators',
    'Strategic acquisition of latest-generation heavy machinery strengthens output capacity for demanding mining and civil contracts.',
    'Trimurti Mining and Infrastructure Private Limited has inducted modern high-capacity excavators and reinforced tippers to meet escalating client demands across regional mining and infrastructure sites. This expansion bolsters cycle-time efficiency, lowers fuel consumption, and reinforces our commitment to rigorous site delivery schedules.',
    'https://images.unsplash.com/photo-1711012604128-8339024a3e12?auto=format&fit=crop&w=1400&q=85',
    'Fleet Expansion',
    NOW() - INTERVAL '12 days',
    true
  ),
  (
    'Commitment to Zero-Harm Operational Protocols and Safe Site Standards',
    'zero-harm-safety-protocols',
    'Reinforced daily safety briefings, PPE compliance, and environmental dust-suppression standards implemented across all live projects.',
    'At Trimurti Mining and Infrastructure, worker safety and environmental stewardship remain foundational. Our updated standard operating procedures mandate regular equipment inspections, slope stability audits, continuous water sprinkling for dust containment, and emergency response readiness drills.',
    'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=1400&q=85',
    'Safety & Compliance',
    NOW() - INTERVAL '30 days',
    true
  );
