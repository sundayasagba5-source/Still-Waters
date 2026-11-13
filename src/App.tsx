/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutAndValues } from './components/AboutAndValues';
import { ServicesSection } from './components/ServicesSection';
import { EthicalPackSection } from './components/EthicalPackSection';
import { BookingSection } from './components/BookingSection';
import { Footer } from './components/Footer';
import { CounsellorSyncModal } from './components/CounsellorSyncModal';
import { LegalPage } from './components/LegalPages';

type RouteMode = 'home' | 'privacy' | 'terms';

function getRouteFromPath(): RouteMode {
  const path = window.location.pathname.toLowerCase();
  if (path === '/privacy') return 'privacy';
  if (path === '/terms') return 'terms';
  return 'home';
}

export default function App() {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [route, setRoute] = useState<RouteMode>(() => getRouteFromPath());

  useEffect(() => {
    const onPopState = () => setRoute(getRouteFromPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const currentUrl = `${window.location.origin}${window.location.pathname}`;
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = currentUrl;

    let ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = currentUrl;

    if (route === 'privacy') {
      document.title = 'Privacy Policy – Still Waters Online Teen Counselling';
    } else if (route === 'terms') {
      document.title = 'Terms of Service – Still Waters Online Teen Counselling';
    } else {
      document.title = 'Still Waters – Online Teen Counselling (Ages 13–19)';
    }
  }, [route]);

  const navigateTo = (target: RouteMode) => {
    const nextPath = target === 'home' ? '/' : `/${target}`;
    window.history.pushState({}, '', nextPath);
    setRoute(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (route === 'privacy' || route === 'terms') {
    return <LegalPage mode={route} onBackHome={() => navigateTo('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FF] text-[#0B2545]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <AboutAndValues />
        <ServicesSection />
        <EthicalPackSection />
        <BookingSection />
      </main>
      <Footer
        onOpenWorkspace={() => setWorkspaceOpen(true)}
        onNavigateLegal={(mode) => navigateTo(mode)}
      />
      <CounsellorSyncModal
        isOpen={workspaceOpen}
        onClose={() => setWorkspaceOpen(false)}
      />
    </div>
  );
}
