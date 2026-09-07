import React, { useState } from 'react';
import { ActiveTab } from './types/ckd';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { DashboardPage } from './pages/DashboardPage';
import { AboutPage } from './pages/AboutPage';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleScrollToForm = () => {
    setActiveTab('dashboard');
    setTimeout(() => {
      const formEl = document.getElementById('prediction-form');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onScrollToForm={handleScrollToForm}
      />

      {/* Main Content Area (Offset for Desktop Sidebar) */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          activeTab={activeTab}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1">
          {activeTab === 'dashboard' ? (
            <DashboardPage />
          ) : (
            <AboutPage />
          )}
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default App;
