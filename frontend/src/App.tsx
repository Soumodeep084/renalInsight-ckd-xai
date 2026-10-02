import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PredictionProvider } from './context/PredictionContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { DashboardPage } from './pages/DashboardPage';
import { PredictionPage } from './pages/PredictionPage';
import { ResultsPage } from './pages/ResultsPage';
import { GuidePage } from './pages/GuidePage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';

function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-teal-500 selection:text-white w-full max-w-full overflow-x-hidden">
      {/* Navigation Sidebar */}
      <Sidebar
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area (Offset for Desktop Fixed Sidebar) */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden">
        {/* Dynamic Route Header */}
        <Header onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

        {/* Dynamic View Router */}
        <main className="flex-1 w-full max-w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/predict" element={<PredictionPage />} />
            <Route path="/prediction" element={<PredictionPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </div>
  );
}

export function App() {
  return (
    <PredictionProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </PredictionProvider>
  );
}

export default App;
