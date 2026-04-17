import React, { useState } from 'react';
import { PageHeader, SectionLabel, Card, Tag, Button, Grid } from '../components/UI';
import { CURATED_PALETTES, getContrastColor } from '../utils/colours';

function PaletteStrip({ colours, height = 64 }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ display: 'flex', height, borderRadius: 10, overflow: 'hidden' }}>
      {colours.map((c, i) => (
        <div
          key={i}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => navigator.clipboard?.writeText(c)}
          title={`Click to copy ${c}`}
          style={{
            flex: hovered === i ? 2 : 1,
            background: c,
            transition: 'flex 0.25s',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: 6,
          }}
        >
          {hovered === i && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              background: 'rgba(0,0,0,0.5)',
              color: '#fff',
              padding: '2px 6px',
              borderRadius: 4,
              whiteSpace: 'nowrap',
            }}>
              {c}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function PalettesPage() {
  const [copied, setCopied] = useState(null);
  const hero = CURATED_PALETTES[0];

  const handleCopy = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="fade-up">
      <PageHeader title="Colour Palettes" sub="// curated for your projects · click any swatch to copy" />

      {/* Hero palette */}
      <div style={{
        background: 'var(--ink)',
        borderRadius: 16,
        padding: 28,
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 28,
      }} className="palette-hero-inner">
        <div style={{ flex: 1 }}>
          <PaletteStrip colours={hero.colours} height={88} />
        </div>
        <div style={{ color: 'var(--paper)', minWidth: 180 }} className="palette-hero-info">
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{hero.name}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>{hero.vibe}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {hero.tags.map(t => (
              <span key={t} style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <SectionLabel>Curated Collections</SectionLabel>
      <Grid cols={3} gap={14} style={{ marginBottom: 28 }}>
        {CURATED_PALETTES.slice(1).map((p, i) => (
          <div key={i} style={{ borderRadius: 12, overflow: 'hidden', border: '0.5px solid var(--border)', cursor: 'pointer' }}>
            <PaletteStrip colours={p.colours} height={60} />
            <div style={{ padding: '10px 12px', background: 'var(--card)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{p.vibe}</div>
              <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
                {p.tags.map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            </div>
          </div>
        ))}
      </Grid>

      {/* Colour values grid for hero */}
      <SectionLabel>Featured Hex Values</SectionLabel>
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        {hero.colours.map((c, i) => (
          <div
            key={i}
            onClick={() => handleCopy(c, i)}
            style={{
              flex: 1,
              background: c,
              borderRadius: 10,
              padding: '16px 10px 10px',
              cursor: 'pointer',
              border: '0.5px solid rgba(0,0,0,0.08)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: getContrastColor(c), opacity: 0.7, marginTop: 8 }}>
              {copied === i ? '✓ Copied' : c}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
