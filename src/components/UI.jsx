import React from 'react';

export function PageHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 300, fontStyle: 'italic', letterSpacing: -1.5, lineHeight: 1, color: 'var(--ink)' }}>
        {title}
      </h1>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', marginTop: 6, letterSpacing: '0.5px' }}>
        {sub}
      </p>
    </div>
  );
}

export function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
      {children}
      <span style={{ flex: 1, height: '0.5px', background: 'var(--border)' }} />
    </div>
  );
}

export function Card({ children, style, hover = true, onClick }) {
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'var(--card)',
        border: '0.5px solid var(--border)',
        borderRadius: 14,
        padding: 20,
        transition: 'transform 0.15s',
        transform: hover && isHovered ? 'translateY(-2px)' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Tag({ children, color }) {
  const colors = {
    accent:  { bg: '#d4501a', fg: '#fff' },
    green:   { bg: '#2d5a3d', fg: '#fff' },
    purple:  { bg: '#7b5ea7', fg: '#fff' },
    default: { bg: 'var(--ink)', fg: 'var(--paper)' },
  };
  const c = colors[color] || colors.default;
  return (
    <span style={{
      fontSize: 10,
      padding: '3px 10px',
      borderRadius: 20,
      fontFamily: 'var(--font-mono)',
      background: c.bg,
      color: c.fg,
      letterSpacing: '0.5px',
    }}>
      {children}
    </span>
  );
}

export function Button({ children, onClick, variant = 'dark', style, disabled }) {
  const styles = {
    dark:   { background: 'var(--ink)',    color: 'var(--paper)' },
    accent: { background: 'var(--accent)', color: '#fff' },
    ghost:  { background: 'transparent',  color: 'var(--ink)', border: '0.5px solid var(--border)' },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '11px 22px',
        borderRadius: 8,
        border: 'none',
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.3px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'opacity 0.15s',
        fontFamily: 'var(--font-ui)',
        ...styles[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Spinner() {
  return (
    <span style={{
      display: 'inline-block',
      width: 13,
      height: 13,
      border: '2px solid rgba(255,255,255,0.3)',
      borderTopColor: 'white',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      marginRight: 8,
      verticalAlign: 'middle',
    }} />
  );
}

export function Grid({ cols = 3, gap = 16, children, style, className }) {
  return (
    <div
      className={`responsive-grid cols-${cols}${className ? ' ' + className : ''}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
