import React, { useState } from 'react';
import { PageHeader, SectionLabel, Card, Button, Spinner } from '../components/UI';
import { getContrastColor } from '../utils/colours';

const BRIEF_EXAMPLES = [
  'A high-end florist in Paris — romantic, timeless, editorial',
  'A fintech startup disrupting banking — bold, trustworthy, modern',
  'An artisan gin distillery in rural Scotland — heritage, craft, dark',
  'A Gen Z streetwear brand from London — raw, urban, expressive',
  'A mindfulness app for busy professionals — calm, minimal, warm',
];

export default function MoodboardPage() {
  const [brief, setBrief] = useState('');
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async (text) => {
    const b = text || brief;
    if (!b.trim()) return;
    setLoading(true);
    setError('');
    setBoard(null);

    try {
      const res = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          system: `You are a creative director at a top branding agency. When given a brand brief, produce a rich creative direction document.
Respond ONLY with valid JSON — no markdown, no backticks, no explanation.
Format exactly:
{
  "brandName": "Suggested brand name",
  "tagline": "A short punchy tagline",
  "essence": "2-3 sentence brand essence / positioning",
  "personality": ["trait1", "trait2", "trait3", "trait4"],
  "palette": [
    { "hex": "#HEXCODE", "name": "Colour name", "use": "how to use it" },
    ...5 colours total...
  ],
  "typography": {
    "display": { "font": "Google Font name", "style": "how to use it" },
    "body": { "font": "Google Font name", "style": "how to use it" }
  },
  "moodWords": ["word1","word2","word3","word4","word5","word6"],
  "visualDirection": "2-3 sentences describing the visual style, photography direction, layout principles",
  "doList": ["do this", "do this", "do this"],
  "dontList": ["avoid this", "avoid this", "avoid this"],
  "competitors": ["Brand 1", "Brand 2", "Brand 3"],
  "targetAudience": "Who is this brand for — 2 sentences"
}
Make it genuinely creative and specific to the brief, not generic.`,
          messages: [{ role: 'user', content: `Create a brand moodboard for: ${b}` }],
        }),
      });

      const data = await res.json();
      const text = data.content?.[0]?.text || '';
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setBoard(parsed);
    } catch (e) {
      setError('Could not generate moodboard. Check your API key is configured in Vercel.');
    }
    setLoading(false);
  };

  return (
    <div className="fade-up">
      <PageHeader title="Brief to Moodboard" sub="// describe a brand, get a full creative direction" />

      <SectionLabel>Your Brief</SectionLabel>

      {/* Example chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {BRIEF_EXAMPLES.map(ex => (
          <button
            key={ex}
            onClick={() => { setBrief(ex); generate(ex); }}
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
            {ex.split(' — ')[0].substring(0, 30)}...
          </button>
        ))}
      </div>

      <textarea
        value={brief}
        onChange={e => setBrief(e.target.value)}
        placeholder="Describe your brand — industry, personality, audience, tone. The more detail, the better the output."
        rows={3}
        style={{
          width: '100%',
          padding: '14px 16px',
          border: '0.5px solid var(--border)',
          borderRadius: 10,
          fontFamily: 'var(--font-ui)',
          fontSize: 14,
          resize: 'vertical',
          outline: 'none',
          background: 'var(--warm)',
          color: 'var(--ink)',
          marginBottom: 12,
          lineHeight: 1.6,
        }}
      />
      <Button
        variant="accent"
        onClick={() => generate()}
        disabled={loading || !brief.trim()}
        style={{ marginBottom: 28 }}
      >
        {loading ? <><Spinner />Building moodboard...</> : 'Generate Moodboard →'}
      </Button>

      {error && (
        <div style={{ padding: '12px 16px', background: '#fdf0ea', borderRadius: 10, color: 'var(--accent)', fontSize: 13, fontFamily: 'var(--font-mono)', marginBottom: 20 }}>
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[180, 120, 160, 100].map((h, i) => (
            <div key={i} style={{ height: h, borderRadius: 14, background: 'var(--warm)', animation: 'pulse 1.4s ease infinite', animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      )}

      {/* Moodboard output */}
      {board && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Hero — brand name + tagline */}
          <div style={{ background: 'var(--ink)', borderRadius: 16, padding: '32px 28px', color: 'var(--paper)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '2px', color: 'rgba(255,255,255,0.35)', marginBottom: 12, textTransform: 'uppercase' }}>
              // Brand Identity
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontStyle: 'italic', fontWeight: 300, letterSpacing: -1, marginBottom: 8, lineHeight: 1.1 }}>
              {board.brandName}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 18 }}>
              "{board.tagline}"
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,255,0.75)', maxWidth: 600 }}>
              {board.essence}
            </p>
          </div>

          {/* Palette */}
          <Card>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '2px', color: 'var(--muted)', marginBottom: 14, textTransform: 'uppercase' }}>Colour Palette</div>
            <div style={{ display: 'flex', height: 70, borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
              {board.palette.map((c, i) => (
                <div key={i} style={{ flex: 1, background: c.hex }} title={c.hex} />
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }} className="colour-roles">
              {board.palette.map((c, i) => (
                <div
                  key={i}
                  onClick={() => navigator.clipboard?.writeText(c.hex)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, marginBottom: 2 }}>{c.hex}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 1 }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)', lineHeight: 1.4 }}>{c.use}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Typography + Personality side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="responsive-grid cols-2">
            <Card>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '2px', color: 'var(--muted)', marginBottom: 14, textTransform: 'uppercase' }}>Typography</div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--accent)', marginBottom: 4 }}>DISPLAY</div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{board.typography.display.font}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{board.typography.display.style}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--accent2)', marginBottom: 4 }}>BODY</div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{board.typography.body.font}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{board.typography.body.style}</div>
              </div>
            </Card>

            <Card>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '2px', color: 'var(--muted)', marginBottom: 14, textTransform: 'uppercase' }}>Brand Personality</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {board.personality.map((trait, i) => (
                  <span key={i} style={{
                    padding: '5px 12px',
                    background: 'var(--ink)',
                    color: 'var(--paper)',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                  }}>
                    {trait}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '2px', color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase' }}>Mood Words</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {board.moodWords.map((word, i) => (
                    <span key={i} style={{
                      padding: '4px 10px',
                      background: 'var(--warm)',
                      borderRadius: 20,
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--ink)',
                    }}>
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Visual direction */}
          <Card style={{ borderLeft: '3px solid var(--accent)', borderRadius: '0 14px 14px 0' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '2px', color: 'var(--accent)', marginBottom: 10, textTransform: 'uppercase' }}>Visual Direction</div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--ink)' }}>{board.visualDirection}</p>
          </Card>

          {/* Do / Don't */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="responsive-grid cols-2">
            <Card>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '2px', color: 'var(--accent2)', marginBottom: 12, textTransform: 'uppercase' }}>✓ Do</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {board.doList.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--accent2)', fontWeight: 700, flexShrink: 0 }}>→</span>
                    <span style={{ fontSize: 13, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '2px', color: 'var(--accent)', marginBottom: 12, textTransform: 'uppercase' }}>✕ Don't</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {board.dontList.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>×</span>
                    <span style={{ fontSize: 13, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Audience + competitors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="responsive-grid cols-2">
            <Card>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '2px', color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase' }}>Target Audience</div>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--ink)' }}>{board.targetAudience}</p>
            </Card>
            <Card>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '2px', color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase' }}>Competitor Landscape</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {board.competitors.map((c, i) => (
                  <div key={i} style={{ fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)' }}>0{i+1}</span>
                    {c}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Regenerate */}
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="ghost" onClick={() => generate()}>Regenerate ↺</Button>
            <Button variant="dark" onClick={() => { setBoard(null); setBrief(''); }}>New Brief</Button>
          </div>
        </div>
      )}
    </div>
  );
}
