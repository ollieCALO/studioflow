import React, { useState } from 'react';
import { PageHeader, SectionLabel, Card, Grid, Button, Spinner } from '../components/UI';

const TRENDS = [
  { title: 'Anti-Design & Brutalist Branding', category: 'Movement', badge: '🔥 Hot', desc: 'Brands leaning into raw, unpolished aesthetics. Deliberate rule-breaking is the new sophistication.', bg: '#0D0D0D', preview: <span style={{fontFamily:"'Fraunces',serif",fontSize:28,fontStyle:'italic',fontWeight:300,color:'#fff'}}>Anti<br/>Design</span> },
  { title: 'Maximalist Geometric Systems',     category: 'Visual Style', badge: 'Rising', desc: 'Complex grids and interlocking shapes replacing simple minimalism across tech and fashion.',   bg: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)', preview: <span style={{fontSize:52,color:'white'}}>⬡</span> },
  { title: 'Variable & Expressive Type',       category: 'Typography',  badge: 'Everywhere', desc: 'Fonts doing the heavy lifting. Full-bleed typographic layouts replacing imagery-led compositions.',  bg: '#FFF8E7', preview: <span style={{fontFamily:"'Fraunces',serif",fontSize:36,color:'#5C3D2E',fontStyle:'italic'}}>Type</span> },
  { title: 'Tactile & Analogue Aesthetics',    category: 'Texture',     badge: 'Growing', desc: 'Risograph, screenprint textures and grain filters. Brands chasing the warmth of physical media.',  bg: '#F0EBE0', preview: <span style={{fontSize:48}}>◎</span> },
  { title: 'Quiet Luxury Visual Language',     category: 'Brand',       badge: 'Dominant', desc: 'Muted palettes, generous white space, and understated logotypes. Status through restraint.',   bg: '#E8E4DC', preview: <span style={{fontFamily:"'Fraunces',serif",fontSize:32,color:'#555',fontStyle:'italic',fontWeight:300}}>Quiet</span> },
  { title: 'Data as Design Element',           category: 'UI / Digital', badge: 'Emerging', desc: 'Infographics and data visualisations moving from utility to centrepiece. Numbers as art.', bg: '#EAF3DE', preview: <span style={{fontFamily:"'DM Mono',monospace",fontSize:28,color:'#2d5a3d'}}>01 / 11</span> },
];

const ARTICLES = [
  { num: '01', source: "It's Nice That", title: 'How sustainable packaging is reshaping brand identity in 2025', time: '2 days ago', read: '6 min' },
  { num: '02', source: 'Eye Magazine',   title: 'The return of vernacular typography in contemporary design', time: '4 days ago', read: '12 min' },
  { num: '03', source: 'Dezeen',         title: 'Studio culture shift: designers embracing slower, intentional work', time: '1 week ago', read: '8 min' },
  { num: '04', source: 'Brand New',      title: "Rebrands of the year — what's working and what isn't", time: '1 week ago', read: '10 min' },
  { num: '05', source: 'Fonts In Use',   title: 'Variable fonts and the death of the static stylesheet', time: '2 weeks ago', read: '7 min' },
];

const PULSE = [
  { color: 'var(--accent)',  label: 'AWARD SEASON',  text: "D&AD Pencil submissions open through March 2026" },
  { color: 'var(--accent2)', label: 'TOOL UPDATE',   text: 'Figma launches AI component suggestions in beta' },
  { color: 'var(--accent3)', label: 'HIRING',        text: 'Senior brand roles spiking in Amsterdam & Lisbon' },
  { color: '#BA7517',        label: 'CONFERENCE',    text: 'OFFF Barcelona 2026 — early bird tickets now open' },
];

export default function TrendingPage() {
  const [loading, setLoading] = useState(false);
  const [liveInsights, setLiveInsights] = useState('');

  const fetchLiveTrends = async () => {
    setLoading(true);
    setLiveInsights('');
    try {
      const res = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: 'You are a well-connected creative director and design industry insider. Share concise, opinionated takes on what is trending right now in graphic design, branding, and visual culture. Be specific and direct. No filler.',
          messages: [{ role: 'user', content: 'What are the most important graphic design and visual branding trends right now in 2025-2026? Give me 4-5 specific, actionable trends with real examples where you can. Be direct and opinionated.' }],
        }),
      });
      const data = await res.json();
      setLiveInsights(data.content?.[0]?.text || 'No response.');
    } catch {
      setLiveInsights('Could not fetch. Check your VITE_ANTHROPIC_API_KEY.');
    }
    setLoading(false);
  };

  return (
    <div className="fade-up">
      <PageHeader title="Trending" sub="// what's moving in design right now" />

      <SectionLabel>Hot Right Now</SectionLabel>
      <Grid cols={3} gap={14} style={{ marginBottom: 32 }}>
        {TRENDS.map((t, i) => (
          <div key={i} style={{ borderRadius: 14, overflow: 'hidden', border: '0.5px solid var(--border)', background: 'var(--card)' }}>
            <div style={{
              height: 180,
              background: t.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
              {t.preview}
              <span style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'var(--ink)',
                color: 'var(--paper)',
                fontSize: 10,
                padding: '4px 10px',
                borderRadius: 20,
                fontFamily: 'var(--font-mono)',
              }}>
                {t.badge}
              </span>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6 }}>
                {t.category}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.35, marginBottom: 6 }}>{t.title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.55 }}>{t.desc}</div>
            </div>
          </div>
        ))}
      </Grid>

      <Grid cols={2} gap={20} style={{ marginBottom: 28 }}>
        {/* Articles */}
        <div>
          <SectionLabel>Articles & Reads</SectionLabel>
          <Card style={{ padding: 0 }}>
            {ARTICLES.map((a, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                  padding: '14px 18px',
                  borderBottom: i < ARTICLES.length - 1 ? '0.5px solid var(--border)' : 'none',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: 'rgba(0,0,0,0.07)', fontWeight: 500, lineHeight: 1, marginTop: 2, minWidth: 28 }}>
                  {a.num}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--accent2)', letterSpacing: '1px', marginBottom: 4 }}>{a.source}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.4, marginBottom: 4 }}>{a.title}</div>
                  <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>{a.read} read · {a.time}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Industry pulse */}
        <div>
          <SectionLabel>Industry Pulse</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PULSE.map((p, i) => (
              <div key={i} style={{ padding: '14px 16px', background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 12, borderLeft: `3px solid ${p.color}` }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: p.color, marginBottom: 5, letterSpacing: '1px' }}>{p.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{p.text}</div>
              </div>
            ))}
          </div>
        </div>
      </Grid>

      {/* AI Live Insights */}
      <SectionLabel>AI Creative Director</SectionLabel>
      <Card style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.6 }}>
          Get a sharp, opinionated brief on what matters most in design right now — straight from an AI creative director.
        </p>
        <Button variant="accent" onClick={fetchLiveTrends} disabled={loading}>
          {loading ? <><Spinner />Scanning the scene...</> : 'Get Live Design Insights'}
        </Button>
      </Card>
      {liveInsights && (
        <div style={{ background: 'var(--ink)', borderRadius: 14, padding: 24, color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.8 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', marginBottom: 14, textTransform: 'uppercase' }}>
            // AI Creative Director
          </div>
          {liveInsights.split('\n').map((line, i) => (
            <p key={i} style={{ marginBottom: 6 }}>{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
          ))}
        </div>
      )}
    </div>
  );
}
