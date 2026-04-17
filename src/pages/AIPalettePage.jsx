import React, { useState } from 'react';
import { PageHeader, SectionLabel, Card, Button, Spinner } from '../components/UI';
import { getContrastColor } from '../utils/colours';

const PROMPTS = [
  'Scandinavian bakery — warm, minimal, hygge',
  'Cyberpunk nightclub — neon, dark, electric',
  'Luxury skincare — clean, premium, botanical',
  'Brooklyn coffee shop — industrial, earthy, indie',
  'Children\'s toy brand — playful, bright, joyful',
  'Architecture firm — concrete, minimal, refined',
  'Tropical beach resort — vibrant, fresh, coastal',
  'Dark academia library — moody, rich, literary',
];

const ROLES = ['Primary', 'Secondary', 'Accent', 'Background', 'Text'];

function hexIsValid(h) { return /^#[0-9A-Fa-f]{6}$/.test(h); }

export default function AIPalettePage() {
  const [prompt, setPrompt] = useState('');
  const [palettes, setPalettes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(null);

  const generate = async (text) => {
    const p = text || prompt;
    if (!p.trim()) return;
    setLoading(true);
    setError('');
    setPalettes([]);

    try {
      const res = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1000,
          system: `You are an expert brand designer and colour theorist. When given a brief, generate 3 distinct colour palettes. 
Each palette has exactly 5 hex colours and a short name.
Respond ONLY with valid JSON — no markdown, no backticks, no explanation.
Format: { "palettes": [ { "name": "Palette Name", "mood": "2-3 word vibe", "colours": ["#HEX1","#HEX2","#HEX3","#HEX4","#HEX5"] }, ... ] }
Make the palettes genuinely distinct from each other — different moods, temperatures, and contrast levels.
Ensure all hex codes are valid 6-digit hex values.`,
          messages: [{ role: 'user', content: `Generate 3 colour palettes for: ${p}` }],
        }),
      });

      const data = await res.json();
      const text = data.content?.[0]?.text || '';
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setPalettes(parsed.palettes || []);
    } catch (e) {
      setError('Could not generate palettes. Check your API key is set in Vercel.');
    }
    setLoading(false);
  };

  const copyHex = (hex, id) => {
    navigator.clipboard?.writeText(hex);
    setCopied(id);
    setTimeout(() => setCopied(null), 1400);
  };

  const copyCSS = (palette) => {
    const css = `:root {\n${palette.colours.map((c, i) => `  --color-${ROLES[i].toLowerCase()}: ${c};`).join('\n')}\n}`;
    navigator.clipboard?.writeText(css);
    setCopied('css-' + palette.name);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="fade-up">
      <PageHeader title="AI Palette Generator" sub="// describe a brand or mood, get a palette" />

      <SectionLabel>Your Brief</SectionLabel>

      {/* Prompt chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {PROMPTS.map(p => (
          <button
            key={p}
            onClick={() => { setPrompt(p); generate(p); }}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: '0.5px solid var(--border)',
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              background: 'var(--warm)',
              color: 'var(--ink)',
              transition: 'all 0.15s',
            }}
          >
            {p.split(' — ')[0]}
          </button>
        ))}
      </div>

      {/* Text input */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        <input
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generate()}
          placeholder="e.g. 'sustainable fashion brand — earthy and modern'"
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '0.5px solid var(--border)',
            borderRadius: 10,
            fontFamily: 'var(--font-ui)',
            fontSize: 14,
            background: 'var(--card)',
            outline: 'none',
            color: 'var(--ink)',
          }}
        />
        <Button variant="accent" onClick={() => generate()} disabled={loading || !prompt.trim()}>
          {loading ? <><Spinner />Generating...</> : 'Generate →'}
        </Button>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: '#fdf0ea', borderRadius: 10, color: 'var(--accent)', fontSize: 13, fontFamily: 'var(--font-mono)', marginBottom: 20 }}>
          {error}
        </div>
      )}

      {/* Loading shimmer */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ height: 120, borderRadius: 14, background: 'var(--warm)', animation: 'pulse 1.4s ease infinite', animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      )}

      {/* Results */}
      {palettes.length > 0 && (
        <>
          <SectionLabel>Generated Palettes</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {palettes.map((palette, pi) => (
              <div key={pi} style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>

                {/* Colour strip */}
                <div style={{ display: 'flex', height: 80 }}>
                  {palette.colours.filter(hexIsValid).map((c, ci) => (
                    <div
                      key={ci}
                      onClick={() => copyHex(c, `${pi}-${ci}`)}
                      title={`Copy ${c}`}
                      style={{
                        flex: 1,
                        background: c,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        paddingBottom: 6,
                        transition: 'flex 0.2s',
                      }}
                    >
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 9,
                        background: 'rgba(0,0,0,0.4)',
                        color: '#fff',
                        padding: '2px 6px',
                        borderRadius: 4,
                        opacity: copied === `${pi}-${ci}` ? 1 : 0,
                        transition: 'opacity 0.2s',
                      }}>
                        {copied === `${pi}-${ci}` ? '✓' : c}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Info row */}
                <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{palette.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{palette.mood}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => copyCSS(palette)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: 8,
                        border: '0.5px solid var(--border)',
                        fontSize: 11,
                        fontFamily: 'var(--font-mono)',
                        background: 'var(--warm)',
                        cursor: 'pointer',
                        color: 'var(--ink)',
                      }}
                    >
                      {copied === 'css-' + palette.name ? '✓ Copied!' : 'Copy CSS'}
                    </button>
                  </div>
                </div>

                {/* Hex values row */}
                <div style={{ display: 'flex', padding: '0 16px 14px', gap: 8, flexWrap: 'wrap' }}>
                  {palette.colours.filter(hexIsValid).map((c, ci) => (
                    <div
                      key={ci}
                      onClick={() => copyHex(c, `hex-${pi}-${ci}`)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 10px',
                        background: 'var(--warm)',
                        borderRadius: 20,
                        cursor: 'pointer',
                        fontSize: 11,
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: c, border: '0.5px solid rgba(0,0,0,0.1)', flexShrink: 0 }} />
                      {copied === `hex-${pi}-${ci}` ? '✓' : c}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Regenerate */}
          <div style={{ marginTop: 20 }}>
            <Button variant="ghost" onClick={() => generate()}>Regenerate ↺</Button>
          </div>
        </>
      )}
    </div>
  );
}
