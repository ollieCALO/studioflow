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

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar active={activePage} onNav={setActivePage} />
      <main style={{
        flex: 1,
        padding: '36px 44px',
        overflowY: 'auto',
        maxWidth: 960,
      }}>
        {PAGES[activePage]}
      </main>
    </div>
  );
}
