import React from 'react';

const NAV = [
  { id: 'palettes',   icon: '◉', label: 'Colour Palettes' },
  { id: 'generator',  icon: '⬡', label: 'Palette Generator' },
  { id: 'typography', icon: 'Aa', label: 'Typography' },
  { id: 'inspo',      icon: '◈', label: 'Inspo Board' },
  { id: 'trending',   icon: '◆', label: 'Trending' },
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
      gap: 4,
      position: 'sticky',
      top: 0,
      height: '100vh',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 22,
        color: '#f5f2ec',
        fontStyle: 'italic',
        fontWeight: 300,
        marginBottom: 32,
        letterSpacing: -0.5,
        paddingBottom: 24,
        borderBottom: '0.5px solid rgba(255,255,255,0.12)',
      }}>
        studio<span style={{ color: '#d4501a', fontStyle: 'normal' }}>.</span>flow
      </div>

      <NavSection>Workspace</NavSection>

      {NAV.map(item => (
        <NavItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          active={active === item.id}
          onClick={() => onNav(item.id)}
        />
      ))}

      {/* Footer upload CTA */}
      <div style={{ marginTop: 'auto', paddingTop: 20 }}>
        <button
          onClick={() => onNav('feedback')}
          style={{
            width: '100%',
            padding: '12px',
            background: '#d4501a',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          ↑ Upload Work
        </button>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 12, letterSpacing: '0.5px' }}>
          v1.0 · Studioflow
        </p>
      </div>
    </aside>
  );
}

function NavSection({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'rgba(255,255,255,0.25)',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      padding: '14px 10px 6px',
    }}>
      {children}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 8,
        cursor: 'pointer',
        color: active ? '#f5f2ec' : hovered ? '#f5f2ec' : 'rgba(255,255,255,0.45)',
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: '0.3px',
        transition: 'all 0.15s',
        border: 'none',
        background: active ? '#d4501a' : hovered ? 'rgba(255,255,255,0.07)' : 'transparent',
        width: '100%',
        textAlign: 'left',
        fontFamily: 'var(--font-ui)',
      }}
    >
      <span style={{ fontSize: 13, width: 18, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      {label}
    </button>
  );
}
