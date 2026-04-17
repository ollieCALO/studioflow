import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import PalettesPage from './pages/PalettesPage';
import GeneratorPage from './pages/GeneratorPage';
import AIPalettePage from './pages/AIPalettePage';
import ColourExtractorPage from './pages/ColourExtractorPage';
import TypographyPage from './pages/TypographyPage';
import InspoPage from './pages/InspoPage';
import MoodboardPage from './pages/MoodboardPage';
import TrendingPage from './pages/TrendingPage';
import FeedbackPage from './pages/FeedbackPage';
import LibraryPage from './pages/LibraryPage';
import SharedPage from './pages/SharedPage';

const PAGES = {
  palettes: <PalettesPage />, generator: <GeneratorPage />, aipalette: <AIPalettePage />,
  extractor: <ColourExtractorPage />, typography: <TypographyPage />, inspo: <InspoPage />,
  moodboard: <MoodboardPage />, trending: <TrendingPage />, feedback: <FeedbackPage />, library: <LibraryPage />,
};

export default function App() {
  const [activePage, setActivePage] = useState('aipalette');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isShared, setIsShared] = useState(false);

  useEffect(() => { if (window.location.search.includes('share=')) setIsShared(true); }, []);

  const handleNav = (page) => {
    setActivePage(page); setSidebarOpen(false); setIsShared(false);
    if (window.history) window.history.pushState({}, '', '/');
  };

  if (isShared) return <SharedPage onNav={handleNav} />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} className="mobile-overlay" />}
      <div className={`sidebar-wrap ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar active={activePage} onNav={handleNav} />
      </div>
      <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        <div className="mobile-topbar">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--ink)', padding: '4px 8px', lineHeight: 1 }}>☰</button>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontStyle: 'italic', fontWeight: 300, letterSpacing: -0.5 }}>studio<span style={{ color: 'var(--accent)', fontStyle: 'normal' }}>.</span>flow</span>
          <div style={{ width: 40 }} />
        </div>
        <div style={{ padding: 'var(--page-padding)' }}>{PAGES[activePage]}</div>
      </main>
      <style>{`
        :root { --page-padding: 36px 44px; }
        .sidebar-wrap { flex-shrink: 0; }
        .mobile-topbar { display: none; }
        .mobile-overlay { display: none; }
        @media (max-width: 768px) {
          :root { --page-padding: 20px 18px 40px; }
          .sidebar-wrap { position: fixed; top: 0; left: 0; bottom: 0; z-index: 50; transform: translateX(-100%); transition: transform 0.25s ease; }
          .sidebar-wrap.open { transform: translateX(0); }
          .mobile-topbar { display: flex !important; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 0.5px solid var(--border); background: var(--paper); position: sticky; top: 0; z-index: 30; }
          .mobile-overlay { display: block !important; }
        }
      `}</style>
    </div>
  );
}
