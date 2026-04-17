import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import PalettesPage from './pages/PalettesPage';
import GeneratorPage from './pages/GeneratorPage';
import TypographyPage from './pages/TypographyPage';
import InspoPage from './pages/InspoPage';
import TrendingPage from './pages/TrendingPage';
import FeedbackPage from './pages/FeedbackPage';

const PAGES = {
  palettes:   <PalettesPage />,
  generator:  <GeneratorPage />,
  typography: <TypographyPage />,
  inspo:      <InspoPage />,
  trending:   <TrendingPage />,
  feedback:   <FeedbackPage />,
};

export default function App() {
  const [activePage, setActivePage] = useState('palettes');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNav = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
            display: 'none',
          }}
          className="mobile-overlay"
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar-wrap ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar active={activePage} onNav={handleNav} />
      </div>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>

        {/* Mobile top bar */}
        <div className="mobile-topbar">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 22, color: 'var(--ink)', padding: '4px 8px',
              lineHeight: 1,
            }}
          >
            ☰
          </button>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 18,
            fontStyle: 'italic', fontWeight: 300, letterSpacing: -0.5,
          }}>
            studio<span style={{ color: 'var(--accent)', fontStyle: 'normal' }}>.</span>flow
          </span>
          <div style={{ width: 40 }} />
        </div>

        <div style={{ padding: 'var(--page-padding)' }}>
          {PAGES[activePage]}
        </div>
      </main>

      <style>{`
        :root {
          --page-padding: 36px 44px;
        }
        .sidebar-wrap {
          flex-shrink: 0;
        }
        .mobile-topbar {
          display: none;
        }
        .mobile-overlay {
          display: none !important;
        }
        @media (max-width: 768px) {
          :root {
            --page-padding: 20px 18px 40px;
          }
          .sidebar-wrap {
            position: fixed;
            top: 0; left: 0; bottom: 0;
            z-index: 50;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
          }
          .sidebar-wrap.open {
            transform: translateX(0);
          }
          .mobile-topbar {
            display: flex !important;
            align-items: center;
            justify-content: space-between;
            padding: 14px 18px;
            border-bottom: 0.5px solid var(--border);
            background: var(--paper);
            position: sticky;
            top: 0;
            z-index: 30;
          }
          .mobile-overlay {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
