import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { GalleryPage } from './pages/GalleryPage';
import { NewsPage } from './pages/NewsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

// Scroll to top automatically when navigation occurs
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Layout wrapper for public pages with standard header and footer
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#111318] text-[#F5F5F2]">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Website Routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <AboutPage />
            </PublicLayout>
          }
        />
        <Route
          path="/services"
          element={
            <PublicLayout>
              <ServicesPage />
            </PublicLayout>
          }
        />
        <Route
          path="/projects"
          element={
            <PublicLayout>
              <ProjectsPage />
            </PublicLayout>
          }
        />
        <Route
          path="/projects/:slug"
          element={
            <PublicLayout>
              <ProjectDetailPage />
            </PublicLayout>
          }
        />
        <Route
          path="/gallery"
          element={
            <PublicLayout>
              <GalleryPage />
            </PublicLayout>
          }
        />
        <Route
          path="/news"
          element={
            <PublicLayout>
              <NewsPage />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <ContactPage />
            </PublicLayout>
          }
        />

        {/* Administration Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />

        {/* Catch-all redirect */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <div className="pt-40 pb-24 text-center">
                <h1 className="text-4xl font-black text-[#FF6B18]">404</h1>
                <p className="text-sm text-[#7A838E] mt-2 mb-6">The requested page does not exist.</p>
                <a href="/" className="btn-primary text-xs">Return Home</a>
              </div>
            </PublicLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
