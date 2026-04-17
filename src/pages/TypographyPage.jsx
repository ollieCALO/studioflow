import React, { useState, useEffect, useRef } from 'react';
import { PageHeader, SectionLabel, Card, Button, Grid, Tag, Spinner } from '../components/UI';
import { FONT_PAIRINGS, TYPE_SCALE, TRENDING_FONTS } from '../utils/typography';

function FontPairingCard({ pairing, expanded, onToggle }) {
  const loaded = useRef(false);

  useEffect(() => {
    if (!loaded.current) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = pairing.googleUrl;
      document.head.appendChild(link);
      loaded.current = true;
    }
  }, [pairing]);

  return (
    <div
      style={{
        background: 'var(--card)',
        border: expanded ? '1.5px solid var(--accent)' : '0.5px solid var(--border)',
        borderRadius: 14,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
      onClick={onToggle}
    >
      {/* Specimen preview */}
      <div style={{ padding: '28px 24px 20px', borderBottom: '0.5px solid var(--border)' }}>
        <div style={{
          fontFamily: pairing.display.family,
          fontSize: expanded ? 36 : 28,
          fontWeight: pairing.display.weight,
          fontStyle: pairing.display.style || 'normal',
          lineHeight: 1.15,
          marginBottom: 10,
          transition: 'font-size 0.2s',
          color: 'var(--ink)',
        }}>
          {pairing.specimen.heading}
        </div>
        <div style={{
          fontFamily: pairing.body.family,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          marginBottom: expanded ? 14 : 0,
        }}>
          {pairing.specimen.sub}
        </div>
        {expanded && (
          <p style={{
            fontFamily: pairing.body.family,
            fontSize: 14,
            lineHeight: 1.7,
            color: '#555',
            fontWeight: pairing.body.weight,
          }}>
            {pairing.specimen.body}
          </p>
        )}
      </div>

      {/* Pairing info */}
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{pairing.name}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>{pairing.vibe}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {pairing.tags.slice(0, 2).map(t => <Tag key={t}>{t}</Tag>)}
          <span style={{ fontSize: 16, color: 'var(--muted)', marginLeft: 4 }}>{expanded ? '↑' : '↓'}</span>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 20px 16px', borderTop: '0.5px solid var(--border)', paddingTop: 14 }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
            <FontChip label="Display" name={pairing.display.name} category={pairing.display.category} />
            <div style={{ fontSize: 18, color: 'var(--muted)', alignSelf: 'center' }}>+</div>
            <FontChip label="Body" name={pairing.body.name} category={pairing.body.category} />
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', lineHeight: 1.6 }}>
            {pairing.use}
          </p>
        </div>
      )}
    </div>
  );
}

function FontChip({ label, name, category }) {
  return (
    <div style={{ background: 'var(--warm)', borderRadius: 8, padding: '8px 14px', flex: 1 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700 }}>{name}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', marginTop: 2 }}>{category}</div>
    </div>
  );
}

export default function TypographyPage() {
  const [expanded, setExpanded] = useState('editorial-power');
  const [scaleFont, setScaleFont] = useState("'Playfair Display', Georgia, serif");
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pairings');

  const askAI = async () => {
    if (!aiPrompt.trim()) return;
    setLoading(true);
    setAiResult('');
    try {
      const res = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: 'You are a senior typographer and brand identity designer. Give specific, practical font pairing advice. Always recommend real Google Fonts. Format clearly with font names, rationale, and use cases. Be direct and opinionated.',
          messages: [{ role: 'user', content: aiPrompt }],
        }),
      });
      const data = await res.json();
      setAiResult(data.content?.[0]?.text || 'No response received.');
    } catch {
      setAiResult('Could not connect. Make sure VITE_ANTHROPIC_API_KEY is set.');
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'pairings', label: 'Font Pairings' },
    { id: 'scale', label: 'Type Scale' },
    { id: 'trending', label: 'Trending' },
    { id: 'ai', label: 'AI Advisor' },
  ];

  return (
    <div className="fade-up">
      <PageHeader title="Typography" sub="// pairings, scale & font intelligence" />

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'var(--warm)', padding: 4, borderRadius: 10, width: 'fit-content' }} className="tab-bar">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              border: 'none',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
              background: activeTab === t.id ? 'var(--ink)' : 'transparent',
              color: activeTab === t.id ? 'var(--paper)' : 'var(--muted)',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* PAIRINGS TAB */}
      {activeTab === 'pairings' && (
        <>
          <SectionLabel>Curated Pairings</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FONT_PAIRINGS.map(p => (
              <FontPairingCard
                key={p.id}
                pairing={p}
                expanded={expanded === p.id}
                onToggle={() => setExpanded(expanded === p.id ? null : p.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* TYPE SCALE TAB */}
      {activeTab === 'scale' && (
        <>
          <SectionLabel>Type Scale</SectionLabel>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
              Preview font
            </label>
            <select
              value={scaleFont}
              onChange={e => setScaleFont(e.target.value)}
              style={{
                padding: '8px 14px',
                border: '0.5px solid var(--border)',
                borderRadius: 8,
                fontFamily: 'var(--font-ui)',
                fontSize: 13,
                background: 'var(--card)',
                cursor: 'pointer',
                outline: 'none',
                color: 'var(--ink)',
              }}
            >
              {FONT_PAIRINGS.map(p => (
                <option key={p.id} value={p.display.family}>{p.display.name}</option>
              ))}
            </select>
          </div>

          <div style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            {TYPE_SCALE.map((item, i) => (
              <div
                key={item.name}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 20,
                  padding: '14px 24px',
                  borderBottom: i < TYPE_SCALE.length - 1 ? '0.5px solid var(--border)' : 'none',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', width: 80, flexShrink: 0 }}>
                  {item.name} / {item.rem}
                </span>
                <span style={{
                  fontFamily: scaleFont,
                  fontSize: item.rem,
                  lineHeight: 1.2,
                  flex: 1,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}>
                  The quick brown fox
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', flexShrink: 0 }}>
                  {item.use}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* TRENDING TAB */}
      {activeTab === 'trending' && (
        <>
          <SectionLabel>Trending Fonts Right Now</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {TRENDING_FONTS.map((f, i) => (
              <div
                key={f.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '16px 20px',
                  background: 'var(--card)',
                  border: '0.5px solid var(--border)',
                  borderRadius: 12,
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: 'rgba(0,0,0,0.08)', fontWeight: 500, minWidth: 28 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 3 }}>{f.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>{f.vibe}</div>
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  padding: '4px 12px',
                  borderRadius: 20,
                  background: f.trend.startsWith('↑') ? '#e8f5e9' : '#f5f5f5',
                  color: f.trend.startsWith('↑') ? 'var(--accent2)' : 'var(--muted)',
                }}>
                  {f.trend}
                </span>
              </div>
            ))}
          </div>

          <SectionLabel>Type Trends 2025–2026</SectionLabel>
          <Grid cols={2} gap={14}>
            {[
              { title: 'Variable Font Expansion', desc: 'Fonts that morph across weight, width, and optical size — one file, infinite expression. Designers using the full axis range.' },
              { title: 'Serif Renaissance', desc: 'Classic serifs reimagined with contemporary sensibility. Refined but not stuffy — heritage letterforms for modern brands.' },
              { title: 'Anti-Legibility as Aesthetic', desc: 'Experimental type that deliberately challenges readability. Style over function for poster work and fashion identity.' },
              { title: 'Mixed Classification Pairings', desc: 'Display serifs with monospace body copy. Decorative headlines with geometric sans. Breaking the old rules on purpose.' },
            ].map((t, i) => (
              <Card key={i}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{t.title}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{t.desc}</div>
              </Card>
            ))}
          </Grid>
        </>
      )}

      {/* AI ADVISOR TAB */}
      {activeTab === 'ai' && (
        <>
          <SectionLabel>AI Typography Advisor</SectionLabel>
          <Card style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.6 }}>
              Describe your project and get specific font pairing recommendations from a senior typographer.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
              {[
                'Luxury skincare brand, minimal and clean',
                'Music festival with an underground vibe',
                'B2B SaaS dashboard, professional',
                'Independent bookshop with character',
              ].map(prompt => (
                <button
                  key={prompt}
                  onClick={() => setAiPrompt(prompt)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    border: '0.5px solid var(--border)',
                    fontSize: 12,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    background: 'var(--warm)',
                    color: 'var(--ink)',
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
            <textarea
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="Describe your project — industry, tone, audience, mood..."
              rows={3}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '0.5px solid var(--border)',
                borderRadius: 8,
                fontFamily: 'var(--font-ui)',
                fontSize: 14,
                resize: 'vertical',
                outline: 'none',
                background: 'var(--warm)',
                color: 'var(--ink)',
                marginBottom: 12,
              }}
            />
            <Button onClick={askAI} variant="accent" disabled={loading || !aiPrompt.trim()}>
              {loading ? <><Spinner />Consulting typographer...</> : 'Get Font Recommendations'}
            </Button>
          </Card>

          {aiResult && (
            <div style={{
              background: 'var(--ink)',
              borderRadius: 14,
              padding: 24,
              color: 'rgba(255,255,255,0.8)',
              fontSize: 14,
              lineHeight: 1.8,
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', marginBottom: 14, textTransform: 'uppercase' }}>
                // AI Typographer
              </div>
              {aiResult.split('\n').map((line, i) => (
                <p key={i} style={{ marginBottom: line ? 8 : 4, color: line.startsWith('**') ? 'var(--paper)' : undefined }}>
                  {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                </p>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
