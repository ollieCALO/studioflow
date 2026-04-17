import React, { useEffect, useState } from 'react';
import { getSharedItem, saveItem } from '../utils/library';

export default function SharedPage({ onNav }) {
  const [item, setItem] = useState(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => { const s = getSharedItem(); if (s) setItem(s); }, []);
  if (!item) return null;
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontStyle: 'italic', fontWeight: 300 }}>studio<span style={{ color: 'var(--accent)', fontStyle: 'normal' }}>.</span>flow</div>
        <button onClick={() => onNav('aipalette')} style={{ padding: '8px 16px', background: 'var(--ink)', color: 'var(--paper)', border: 'none', borderRadius: 8, fontSize: 12, fontFamily: 'var(--font-mono)', cursor: 'pointer' }}>Open App →</button>
      </div>
      {item.type === 'palette' && item.data.colours && (
        <div>
          <div style={{ display: 'flex', height: 80, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>{item.data.colours.map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}</div>
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{item.data.name}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>{item.data.mood}</div>
        </div>
      )}
      {item.type === 'moodboard' && (
        <div style={{ background: 'var(--ink)', borderRadius: 14, padding: 24, color: 'var(--paper)', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontStyle: 'italic', fontWeight: 300, marginBottom: 6 }}>{item.data.brandName}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>"{item.data.tagline}"</div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)' }}>{item.data.essence}</p>
        </div>
      )}
      {item.type === 'feedback' && (
        <div>
          {item.data.previewUrl && <img src={item.data.previewUrl} alt="design" style={{ width: '100%', borderRadius: 12, marginBottom: 16, maxHeight: 300, objectFit: 'contain' }} />}
          <div style={{ background: 'var(--ink)', borderRadius: 14, padding: 20, color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.75 }}>
            {item.data.feedback?.split('\n').map((line, i) => <p key={i} style={{ marginBottom: 6 }}>{line}</p>)}
          </div>
        </div>
      )}
      <button onClick={() => { saveItem({ type: item.type, data: item.data }); setSaved(true); }} disabled={saved} style={{ width: '100%', marginTop: 20, padding: 14, background: saved ? '#2d5a3d' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontFamily: 'var(--font-ui)', fontWeight: 700, cursor: saved ? 'default' : 'pointer' }}>
        {saved ? '✓ Saved to your library' : 'Save to my library'}
      </button>
    </div>
  );
}
