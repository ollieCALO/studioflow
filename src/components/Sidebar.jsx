import React, { useState } from 'react';

const NAV = [
  { section: 'AI Tools' },
  { id: 'aipalette',  icon: '✦', label: 'AI Palette Gen' },
  { id: 'extractor',  icon: '◉', label: 'Colour Extractor' },
  { id: 'moodboard',  icon: '◈', label: 'Brief → Moodboard' },
  { section: 'Colour' },
  { id: 'palettes',   icon: '▣', label: 'Curated Palettes' },
  { id: 'generator',  icon: '⬡', label: 'Palette Generator' },
  { section: 'Design' },
  { id: 'typography', icon: 'Aa', label: 'Typography' },
  { id: 'inspo',      icon: '◇', label: 'Inspo Board' },
  { id: 'trending',   icon: '◆', label: 'Trending' },
  { section: 'Work' },
  { id: 'feedback',   icon: '◎', label: 'Get Feedback' },
];

export default function Sidebar({ active, onNav }) {
  return (
    <aside style={{
      background: '#0e0e0e',
      width: 220,
      minHeight: '100vh',
      padding: '28px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
      flexShrink: 0,
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#f5f2ec', fontStyle: 'italic', fontWeight: 300, marginBottom: 24, letterSpacing: -0.5, paddingBottom: 20, borderBottom: '0.5px solid rgba(255,255,255,0.12)' }}>
        studio<span style={{ color: '#d4501a', fontStyle: 'normal' }}>.</span>flow
      </div>

      {NAV.map((item, i) =>
        item.section ? (
          <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '2px', textTransform: 'uppercase', padding: '12px 10px 4px' }}>
            {item.section}
          </div>
        ) : (
          <NavItem key={item.id} icon={item.icon} label={item.label} active={active === item.id} onClick={() => onNav(item.id)} />
        )
      )}

      <div style={{ marginTop: 'auto', paddingTop: 20 }}>
        <button
          onClick={() => onNav('feedback')}
          style={{ width: '100%', padding: '12px', background: '#d4501a', color: 'white', border: 'none', borderRadius: 8, fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          ↑ Upload Work
        </button>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 12, letterSpacing: '0.5px' }}>
          v2.0 · Studioflow
        </p>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 12px', borderRadius: 8, cursor: 'pointer',
        color: active ? '#f5f2ec' : hovered ? '#f5f2ec' : 'rgba(255,255,255,0.45)',
        fontSize: 13, fontWeight: 500, letterSpacing: '0.3px',
        transition: 'all 0.15s', border: 'none',
        background: active ? '#d4501a' : hovered ? 'rgba(255,255,255,0.07)' : 'transparent',
        width: '100%', textAlign: 'left', fontFamily: 'var(--font-ui)',
      }}
    >
      <span style={{ fontSize: 13, width: 18, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      {label}
    </button>
  );
}
