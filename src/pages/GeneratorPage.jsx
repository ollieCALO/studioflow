import React, { useState, useEffect } from 'react';
import { PageHeader, SectionLabel, Button } from '../components/UI';
import { generateHarmony, getContrastColor, hexToHsl, hslToHex } from '../utils/colours';

const HARMONIES = ['analogous', 'complementary', 'triadic', 'split', 'monochromatic'];
const ROLES = ['Primary', 'Secondary', 'Accent', 'Background', 'Text'];

export default function GeneratorPage() {
  const [baseHex, setBaseHex] = useState('#D4501A');
  const [inputVal, setInputVal] = useState('#D4501A');
  const [harmony, setHarmony] = useState('analogous');
  const [palette, setPalette] = useState([]);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (/^#[0-9A-Fa-f]{6}$/.test(baseHex)) {
      setPalette(generateHarmony(baseHex, harmony));
    }
  }, [baseHex, harmony]);

  const handleHexInput = (v) => {
    setInputVal(v);
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) setBaseHex(v.toUpperCase());
  };

  const handleCopy = (hex, i) => {
    navigator.clipboard?.writeText(hex);
    setCopied(i);
    setTimeout(() => setCopied(null), 1400);
  };

  const exportCSS = () => {
    const css = `/* Studioflow Palette — ${harmony} */\n:root {\n${palette.map((c, i) => `  --color-${ROLES[i].toLowerCase()}: ${c};`).join('\n')}\n}`;
    navigator.clipboard?.writeText(css);
    setCopied('css');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fade-up">
      <PageHeader title="Palette Generator" sub="// from a hex, build a world" />

      <SectionLabel>Base Colour</SectionLabel>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          type="color"
          value={baseHex}
          onChange={e => { setBaseHex(e.target.value.toUpperCase()); setInputVal(e.target.value.toUpperCase()); }}
          style={{ width: 48, height: 42, border: '0.5px solid var(--border)', borderRadius: 8, padding: 2, cursor: 'pointer', background: 'var(--card)' }}
        />
        <input
          type="text"
          value={inputVal}
          onChange={e => handleHexInput(e.target.value)}
          placeholder="#hex"
          style={{
            width: 130,
            padding: '10px 14px',
            border: '0.5px solid var(--border)',
            borderRadius: 8,
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            background: 'var(--card)',
            outline: 'none',
            color: 'var(--ink)',
          }}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {HARMONIES.map(h => (
            <button
              key={h}
              onClick={() => setHarmony(h)}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: '0.5px solid var(--border)',
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                background: harmony === h ? 'var(--ink)' : 'var(--card)',
                color: harmony === h ? 'var(--paper)' : 'var(--ink)',
                transition: 'all 0.15s',
              }}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Generated palette strip */}
      {palette.length > 0 && (
        <>
          <div style={{ display: 'flex', borderRadius: 14, overflow: 'hidden', height: 100, marginBottom: 8, border: '0.5px solid var(--border)' }}>
            {palette.map((c, i) => (
              <div
                key={i}
                onClick={() => handleCopy(c, i)}
                title={`Copy ${c}`}
                style={{
                  flex: 1,
                  background: c,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingBottom: 10,
                  transition: 'flex 0.25s',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  background: 'rgba(0,0,0,0.45)',
                  color: '#fff',
                  padding: '2px 7px',
                  borderRadius: 4,
                }}>
                  {copied === i ? '✓' : c}
                </span>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', marginBottom: 28 }}>
            {harmony} harmony · click any swatch to copy hex
          </p>

          <SectionLabel>Colour Roles</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 28 }} className="colour-roles">
            {palette.map((c, i) => (
              <div
                key={i}
                onClick={() => handleCopy(c, i)}
                style={{
                  background: 'var(--card)',
                  border: '0.5px solid var(--border)',
                  borderRadius: 12,
                  padding: '14px 12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <div style={{ width: 44, height: 44, background: c, borderRadius: 8, margin: '0 auto 10px', border: '0.5px solid rgba(0,0,0,0.08)' }} />
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: 4 }}>{ROLES[i]}</div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{copied === i ? '✓ Copied' : c}</div>
              </div>
            ))}
          </div>

          <SectionLabel>CSS Export</SectionLabel>
          <div style={{ background: 'var(--ink)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <pre style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.8,
              overflowX: 'auto',
            }}>
{`:root {\n${palette.map((c, i) => `  --color-${ROLES[i].toLowerCase()}: ${c};`).join('\n')}\n}`}
            </pre>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button onClick={exportCSS} variant="accent">
              {copied === 'css' ? '✓ Copied CSS vars!' : 'Copy CSS Variables'}
            </Button>
            <Button
              onClick={() => {
                const json = JSON.stringify(Object.fromEntries(palette.map((c, i) => [ROLES[i].toLowerCase(), c])), null, 2);
                navigator.clipboard?.writeText(json);
              }}
              variant="ghost"
            >
              Copy as JSON
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
