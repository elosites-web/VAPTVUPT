import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { FleetGallery } from './components/FleetGallery';
import { FleetViewer3D } from './components/FleetViewer3D';
import { HowItWorks } from './components/HowItWorks';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { WhatsAppFloating } from './components/WhatsAppFloating';

export default function App() {
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    const sectionIds = [
      'inicio',
      'empresa',
      'servicos',
      'frota',
      'modelo-3d',
      'como-funciona',
      'contato',
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#141416] text-neutral-100 flex flex-col font-sans">
      {/* Fixed Sticky Header */}
      <Header activeSection={activeSection} />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Institutional About Section */}
        <About />

        {/* Specialized Services */}
        <Services />

        {/* Verified Fleet Photo Gallery */}
        <FleetGallery />

        {/* Procedural 3D Fleet Viewer */}
        <FleetViewer3D />

        {/* How It Works & WhatsApp Inquiry Builder */}
        <HowItWorks />

        {/* Contact & Conversion Section */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Persistent Floating WhatsApp CTA */}
      <WhatsAppFloating />
    </div>
  );
}
