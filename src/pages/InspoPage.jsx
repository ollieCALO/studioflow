import React, { useState } from 'react';
import { PageHeader, SectionLabel, Button } from '../components/UI';

const INSPO_ITEMS = [
  { id: 1, label: 'Typography', height: 180, bg: 'linear-gradient(135deg,#667eea,#764ba2)', content: <span style={{fontFamily:"'Fraunces',serif",fontSize:48,color:'#fff',fontStyle:'italic',fontWeight:300}}>Aa</span> },
  { id: 2, label: 'Pattern',    height: 120, bg: '#0D0D0D', content: <span style={{fontFamily:"'Syne',sans-serif",fontSize:32,color:'#E94560',letterSpacing:8}}>◆◇◆</span> },
  { id: 3, label: 'Palette',    height: 220, bg: 'linear-gradient(to bottom,#F8EDE3,#DFB189)', content: null },
  { id: 4, label: 'Layout',     height: 150, bg: '#1B1B2F', content: (
    <div style={{width:'80%',display:'flex',flexDirection:'column',gap:6}}>
      <div style={{width:'100%',height:3,background:'#E94560'}}/>
      <div style={{width:'100%',height:3,background:'#E94560',opacity:.5}}/>
      <div style={{width:'60%',height:3,background:'#E94560',opacity:.25}}/>
    </div>
  )},
  { id: 5, label: 'Organic',    height: 130, bg: '#F0F4C3', content: <span style={{fontSize:52}}>🌿</span> },
  { id: 6, label: 'Type',       height: 190, bg: '#2C3E50', content: <span style={{fontFamily:"'Fraunces',serif",fontSize:44,color:'#ECF0F1',fontStyle:'italic',fontWeight:300}}>Studio</span> },
  { id: 7, label: 'Texture',    height: 140, bg: 'repeating-linear-gradient(45deg,#f5f0e8 0px,#f5f0e8 2px,#e8e0d0 2px,#e8e0d0 4px)', content: null },
  { id: 8, label: 'Colour',     height: 160, bg: 'linear-gradient(to right,#E74C3C,#F39C12,#1ABC9C)', content: null },
  { id: 9, label: 'Grid',       height: 120, bg: '#fff', content: (
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:4,width:'70%'}}>
      {Array.from({length:9}).map((_,i)=><div key={i} style={{height:24,background:i%3===1?'#0e0e0e':'#e8e0d0',borderRadius:3}}/>)}
    </div>
  )},
];

const CATEGORIES = ['All', 'Typography', 'Colour', 'Layout', 'Pattern', 'Organic'];

export default function InspoPage() {
  const [saved, setSaved] = useState(new Set([1, 3]));
  const [filter, setFilter] = useState('All');

  const toggleSave = (id, e) => {
    e.stopPropagation();
    setSaved(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const filtered = filter === 'All' ? INSPO_ITEMS : INSPO_ITEMS.filter(i => i.label === filter);

  return (
    <div className="fade-up">
      <PageHeader title="Inspo Board" sub="// visual references & moodboarding" />

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              border: '0.5px solid var(--border)',
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              background: filter === cat ? 'var(--ink)' : 'var(--card)',
              color: filter === cat ? 'var(--paper)' : 'var(--ink)',
              transition: 'all 0.15s',
            }}
          >
            {cat}
          </button>
        ))}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', alignSelf: 'center', marginLeft: 4 }}>
          {saved.size} saved
        </span>
      </div>

      <SectionLabel>References</SectionLabel>

      {/* Masonry-style grid using CSS columns */}
      <div style={{ columns: 3, gap: 14, marginBottom: 28 }} className="inspo-masonry">
        {filtered.map(item => (
          <InspoItem
            key={item.id}
            item={item}
            isSaved={saved.has(item.id)}
            onSave={e => toggleSave(item.id, e)}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <Button variant="accent" onClick={() => alert('In the full app, this would open an AI search for inspiration images based on your brief.')}>
          Find more inspo
        </Button>
        <Button variant="ghost" onClick={() => alert('Export board as PDF — coming soon!')}>
          Export board
        </Button>
      </div>
    </div>
  );
}

function InspoItem({ item, isSaved, onSave }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        breakInside: 'avoid',
        marginBottom: 14,
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        border: '0.5px solid var(--border)',
      }}
    >
      {/* Visual area */}
      <div style={{
        height: item.height,
        background: item.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {item.content}
      </div>

      {/* Hover overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 10,
      }}>
        <span style={{
          fontSize: 11,
          background: 'var(--accent)',
          color: 'white',
          padding: '4px 14px',
          borderRadius: 20,
          fontFamily: 'var(--font-mono)',
        }}>
          {item.label}
        </span>
        <button
          onClick={onSave}
          style={{
            fontSize: 11,
            color: 'white',
            fontFamily: 'var(--font-mono)',
            background: 'rgba(255,255,255,0.15)',
            border: '0.5px solid rgba(255,255,255,0.3)',
            padding: '4px 14px',
            borderRadius: 20,
            cursor: 'pointer',
          }}
        >
          {isSaved ? '✓ Saved' : '+ Save'}
        </button>
      </div>

      {/* Saved indicator */}
      {isSaved && !hovered && (
        <div style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'var(--accent)',
          color: 'white',
          borderRadius: '50%',
          width: 22,
          height: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
        }}>
          ✓
        </div>
      )}
    </div>
  );
}
