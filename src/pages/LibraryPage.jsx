import React, { useState, useEffect } from 'react';
import { PageHeader, SectionLabel, Card } from '../components/UI';
import { getLocalLibrary, deleteItem, generateShareUrl } from '../utils/library';

const TYPE_LABELS = {
  palette:   { label: 'AI Palette',  color: '#d4501a', icon: '◉' },
  moodboard: { label: 'Moodboard',   color: '#7b5ea7', icon: '◈' },
  feedback:  { label: 'Feedback',    color: '#2d5a3d', icon: '◎' },
  extracted: { label: 'Extracted',   color: '#185FA5', icon: '⬡' },
};

function TypeBadge({ type }) {
  const t = TYPE_LABELS[type] || TYPE_LABELS.palette;
  return <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, fontFamily: 'var(--font-mono)', background: t.color, color: '#fff' }}>{t.icon} {t.label}</span>;
}

function ItemActions({ onDelete, onShare }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button onClick={() => { onShare(); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ flex: 1, padding: '7px 12px', borderRadius: 8, border: '0.5px solid var(--border)', fontSize: 11, fontFamily: 'var(--font-mono)', background: copied ? '#2d5a3d' : 'var(--warm)', color: copied ? '#fff' : 'var(--ink)', cursor: 'pointer' }}>
        {copied ? '✓ Copied!' : '↗ Share'}
      </button>
      <button onClick={onDelete} style={{ padding: '7px 12px', borderRadius: 8, border: '0.5px solid var(--border)', fontSize: 11, fontFamily: 'var(--font-mono)', background: 'none', color: 'var(--muted)', cursor: 'pointer' }}>✕</button>
    </div>
  );
}

const FILTERS = ['All', 'Palettes', 'Moodboards', 'Feedback', 'Extracted'];
const filterMap = { All: null, Palettes: 'palette', Moodboards: 'moodboard', Feedback: 'feedback', Extracted: 'extracted' };

export default function LibraryPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => { setItems(getLocalLibrary()); }, []);

  const handleDelete = (id) => { deleteItem(id); setItems(getLocalLibrary()); };
  const handleShare = (item) => navigator.clipboard?.writeText(generateShareUrl(item));
  const filtered = filter === 'All' ? items : items.filter(i => i.type === filterMap[filter]);

  if (items.length === 0) return (
    <div className="fade-up">
      <PageHeader title="My Library" sub="// your saved palettes, moodboards & feedback" />
      <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--warm)', borderRadius: 16 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>◈</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Nothing saved yet</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>Hit Save on any palette, moodboard, or feedback to build your library</div>
      </div>
    </div>
  );

  return (
    <div className="fade-up">
      <PageHeader title="My Library" sub={`// ${items.length} saved item${items.length !== 1 ? 's' : ''}`} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 16px', borderRadius: 20, border: '0.5px solid var(--border)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-mono)', background: filter === f ? 'var(--ink)' : 'var(--card)', color: filter === f ? 'var(--paper)' : 'var(--ink)' }}>
            {f}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }} className="responsive-grid cols-2">
        {filtered.map(item => (
          <Card key={item.id} style={{ padding: 0, overflow: 'hidden' }}>
            {item.type === 'palette' && item.data.colours && (
              <div style={{ display: 'flex', height: 56 }}>
                {item.data.colours.map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
              </div>
            )}
            {item.type === 'moodboard' && (
              <div style={{ background: 'var(--ink)', padding: '16px 16px 12px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontStyle: 'italic', fontWeight: 300, color: 'var(--paper)', letterSpacing: -0.5 }}>{item.data.brandName}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>"{item.data.tagline}"</div>
                {item.data.palette && <div style={{ display: 'flex', height: 20, borderRadius: 4, overflow: 'hidden', marginTop: 10 }}>{item.data.palette.map((c, i) => <div key={i} style={{ flex: 1, background: c.hex }} />)}</div>}
              </div>
            )}
            {item.type === 'feedback' && item.data.previewUrl && (
              <img src={item.data.previewUrl} alt="design" style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }} />
            )}
            {item.type === 'extracted' && item.data.colours && (
              <div style={{ display: 'flex', height: 48 }}>
                {item.data.colours.map((c, i) => <div key={i} style={{ flex: 1, background: c.hex }} />)}
              </div>
            )}
            <div style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                {item.type === 'palette' && <div style={{ fontWeight: 700, fontSize: 13 }}>{item.data.name}</div>}
                {item.type !== 'palette' && <TypeBadge type={item.type} />}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)' }}>{new Date(item.savedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
              </div>
              <ItemActions onDelete={() => handleDelete(item.id)} onShare={() => handleShare(item)} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
