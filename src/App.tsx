import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Breadcrumbs } from './components/Breadcrumbs';
import { Footer } from './components/Footer';
import { WhatsAppFloating } from './components/WhatsAppFloating';
import { ScrollToTop } from './components/ScrollToTop';
import { DynamicFavicon } from './components/DynamicFavicon';

// Pages
import { Home } from './pages/Home';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { FleetPage } from './pages/FleetPage';
import { FAQPage } from './pages/FAQPage';
import { CareersPage } from './pages/CareersPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfUsePage } from './pages/TermsOfUsePage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#141416] text-neutral-100 flex flex-col font-sans selection:bg-[#B43034] selection:text-white">
        {/* Scroll restoration helper */}
        <ScrollToTop />

        {/* Dynamic Favicon switcher based on theme and priority */}
        <DynamicFavicon />

        {/* Global Institutional Header */}
        <Header />

        {/* Global Breadcrumbs Navigation below Header */}
        <Breadcrumbs />

        {/* Dynamic Route Pages */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/empresa" element={<AboutPage />} />
            <Route path="/servicos" element={<ServicesPage />} />
            <Route path="/servicos/:slug" element={<ServiceDetailPage />} />
            <Route path="/frota" element={<FleetPage />} />
            <Route path="/perguntas-frequentes" element={<FAQPage />} />
            <Route path="/trabalhe-conosco" element={<CareersPage />} />
            <Route path="/contato" element={<ContactPage />} />
            <Route path="/politica-de-privacidade" element={<PrivacyPolicyPage />} />
            <Route path="/termos-de-uso" element={<TermsOfUsePage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Global Institutional Footer */}
        <Footer />

        {/* Persistent Floating WhatsApp CTA */}
        <WhatsAppFloating />
      </div>
    </BrowserRouter>
  );
}
