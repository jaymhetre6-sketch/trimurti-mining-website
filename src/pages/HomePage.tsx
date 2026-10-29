import React from 'react';
import { Hero } from '../components/home/Hero';
import { AboutSection } from '../components/home/AboutSection';
import { ServicesSection } from '../components/home/ServicesSection';
import { ProjectsSection } from '../components/home/ProjectsSection';
import { ApproachSection } from '../components/home/ApproachSection';
import { GalleryPreview } from '../components/home/GalleryPreview';
import { NewsSection } from '../components/home/NewsSection';
import { ContactSection } from '../components/home/ContactSection';

export const HomePage: React.FC = () => {
  return (
    <main>
      <Hero />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ApproachSection />
      <GalleryPreview />
      <NewsSection />
      <ContactSection />
    </main>
  );
};
