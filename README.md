# TRIMURTI MINING AND INFRASTRUCTURE PRIVATE LIMITED
### Official Enterprise Website & Administrative Portal

> **Brand Identity:** Building Infrastructure. Powering Progress.  
> **Contact:** `trimurtimininginfrastructure@gmail.com` | **Phone / WhatsApp:** `+91 7028532906`  
> **Corporate Colors:** Navy Charcoal (`#111318`), High-Visibility Orange (`#FF6B18`), Metallic Slate (`#B9C0C9`), Crisp Off-White (`#F5F5F2`)  
> **Typography:** Manrope (Google Fonts)

---

## 1. Overview & Architecture

This repository contains the complete, production-ready corporate website and administrative dashboard for **Trimurti Mining and Infrastructure Private Limited**, engineered to preserve the exact identity, aesthetic tone, and geometric brand mark of the Figma design reference while significantly elevating responsiveness, performance, security, and administrative capabilities.

### Key Capabilities
- **Public Experience:**
  - **Home:** High-impact hero with image-mask transitions, corporate metrics, Who We Are section, 6-discipline services matrix, selected work showcase with category filters, 3-stage execution approach (Understand, Plan, Execute), field gallery preview with lightbox, latest news updates, and quote request module.
  - **About:** Comprehensive corporate overview, leadership philosophy, safety standardizations, and heavy equipment readiness.
  - **Services:** Dedicated breakdowns of Mining Services, Infrastructure Development, Civil Construction, Road Construction, Earthwork & Excavation, and Material Handling.
  - **Projects & Project Details (`/projects/:slug`):** Dynamic portfolio filterable by sector with client specs, execution narrative, scope checklist, heavy machinery mobilized, and project photo reels.
  - **Field Gallery:** High-resolution multimedia gallery with category filtering and full-screen lightbox modal.
  - **News & Announcements:** Operational milestones, fleet acquisitions, and safety notices with full disclosure modal.
  - **Contact & Quotation:** Interactive quotation specification form, direct WhatsApp one-click messaging, and telephone links.
- **Admin Management Portal (`/admin` & `/admin/login`):**
  - Protected session verification via Supabase Auth.
  - Separate "Admin Login" button on the navbar's right side and footer.
  - **Projects Manager:** Create, edit, publish/unpublish, and permanently delete projects. Upload cover and multiple gallery photos.
  - **Gallery Manager:** Add, categorize, caption, and delete site photography.
  - **Services Manager:** Update service sector titles, descriptions, and operational scope.
  - **News Manager:** Draft and publish press releases and operational updates.
  - **Private Enquiries Inbox:** View submitted project specifications, update review status (`new`, `in_review`, `responded`, `archived`), and reply directly.
  - **Audit Trail:** Immutable ledger of administrative actions.
- **Zero-Friction Fallback:** Includes a built-in localStorage mock engine with seeded authentic baseline data, enabling testing and evaluation out of the box even before connecting Supabase credentials.

---

## 2. Tech Stack

- **Frontend:** React 18, TypeScript, Vite 6
- **Styling:** Tailwind CSS, PostCSS, Autoprefixer
- **Motion & Interactions:** Framer Motion (page transitions, parallax scrolls, clip-path mask reveals, magnetic hover effects)
- **Icons:** Lucide React
- **Routing:** React Router DOM (v6) with automatic scroll-to-top on route navigation
- **Backend & Storage:** Supabase (PostgreSQL, Row Level Security, Supabase Auth, Supabase Storage)

---

## 3. Local Development Setup

### Prerequisites
- Node.js (v18.0.0 or higher, tested on v24)
- npm or pnpm

### Quick Start
```bash
# 1. Clone repository
git clone https://github.com/your-username/trimurti-mining-infrastructure.git
cd trimurti-mining-infrastructure

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```
The site will run at `http://localhost:3000`.

### Local Admin Login Credentials (Demo Mode)
When running without live Supabase keys, use the pre-configured administrator credentials:
- **Email:** `admin@trimurti.com`
- **Password:** `Trimurti@2026`

---

## 4. Supabase Backend Configuration

To connect the application to your live Supabase cloud database, follow these steps:

### Step 1: Create a Supabase Project
1. Log in to [Supabase](https://supabase.com) and click **New project**.
2. Set your Project Name (e.g. `trimurti-mining`) and database password.
3. Select the closest region (e.g. `ap-south-1` Mumbai).

### Step 2: Execute Database Schema & RLS Policies
1. In your Supabase dashboard, navigate to the **SQL Editor** tab.
2. Open the file `supabase/schema.sql` from this repository.
3. Paste the contents into the SQL Editor and click **Run**.
4. This script automatically:
   - Creates the `projects`, `services`, `gallery`, `news`, `enquiries`, and `audit_logs` tables.
   - Sets up strict **Row Level Security (RLS)**:
     - Public can only view published projects, active services, gallery, and published news.
     - Public can **only INSERT** to `enquiries` (client quote requests). Public **CANNOT read or delete** enquiries.
     - Only authenticated administrators have full access to manage projects, services, gallery, news, and private enquiries.
   - Creates the public storage bucket `trimurti-media` with upload and delete policies for authenticated administrators.
   - Seeds initial authentic data into services, projects, gallery, and news.

### Step 3: Create Your Administrator Account (No Public Sign-Up)
In accordance with security requirements, public registration is disabled:
1. In your Supabase dashboard, go to **Authentication** -> **Users**.
2. Click **Add user** -> **Create user**.
3. Enter your administrator email (e.g. `trimurtimininginfrastructure@gmail.com`) and a secure password.
4. Set **Auto Confirm User?** to **Yes** and click **Create user**.
5. Go to **Authentication** -> **Sign In / Providers** -> **Email** and ensure **Enable Email Signup** is **Disabled** (so random visitors cannot register accounts).

### Step 4: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your Supabase credentials found under **Settings** -> **API**:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
Restart the Vite dev server (`npm run dev`) or build for production (`npm run build`). The application will instantly switch from Demo mode to live Supabase!

---

## 5. Deployment Instructions

### Option A: Deploy on Vercel (Recommended)
1. Push your repository to **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete production-ready Trimurti Mining website and admin portal"
   git branch -M main
   git remote add origin https://github.com/your-username/trimurti-mining.git
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com) and click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Under **Build and Output Settings**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase Anon Key
6. Click **Deploy**. Vercel will build the project and provision an SSL certificate.

### Option B: Deploy on Netlify
1. Connect your repository on [Netlify](https://netlify.com).
2. Set Build Command: `npm run build` and Publish directory: `dist`.
3. Add the two environment variables in **Site Settings** -> **Environment Variables**.
4. The included `public/_redirects` ensures SPA client-side routing functions cleanly.

---

## 6. Custom `.com` Domain & DNS Setup

To link your own `.com` domain (e.g. `trimurtimining.com`):

### DNS Records Configuration
In your domain registrar dashboard (GoDaddy, Namecheap, Google Domains / Squarespace, Cloudflare):

| Type | Name / Host | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` (root) | `76.76.21.21` (Vercel IP) | Automatic or 3600 |
| **CNAME** | `www` | `cname.vercel-dns.com` | Automatic or 3600 |

*(If using Netlify, set CNAME `www` to `your-site.netlify.app` and Apex `@` to Netlify's load balancer IP `75.2.60.5` or use Netlify DNS).*

### Verification & SSL
1. In Vercel, go to **Settings** -> **Domains**.
2. Enter your domain: `trimurtimining.com` and `www.trimurtimining.com`.
3. Vercel automatically checks DNS propagation and generates a free, auto-renewing Let's Encrypt SSL/TLS certificate within 5–15 minutes.
4. No builder branding or watermarks are present anywhere in this codebase.

---

## 7. Remaining Manual Steps & Service Requirements

| Task | Status | Requirement |
| :--- | :--- | :--- |
| **Domain Registration** | User Responsibility | Purchase your desired `.com` domain from any accredited registrar (~$10–$14/yr). |
| **Supabase Project** | User Responsibility | Free tier includes 500MB database, 1GB file storage, 50,000 monthly active users (100% free for this scope). |
| **Admin User Creation** | User Responsibility | Add admin email and password in Supabase Dashboard -> Auth -> Users (takes 1 minute). |
| **Hosting Platform** | Free Tier Available | Vercel Hobby tier is completely free with automated CI/CD and global CDN edge routing. |
