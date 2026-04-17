import React, { useState, useRef } from 'react';
import { PageHeader, SectionLabel, Card, Button, Spinner } from '../components/UI';
import { getContrastColor } from '../utils/colours';

export default function ColourExtractorPage() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [colours, setColours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImage(file);
    setColours([]);
    setError('');
    const reader = new FileReader();
    reader.onload = e => setImageUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const extract = async () => {
    if (!image) return;
    setLoading(true);
    setError('');
    setColours([]);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result.split(',')[1];
      const mime = image.type;

      try {
        const res = await fetch('/api/anthropic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 800,
            system: `You are a colour expert. Analyse the image and extract the most visually dominant and distinct colours.
Respond ONLY with valid JSON — no markdown, no backticks, no extra text.
Format: { "colours": [ { "hex": "#HEXCODE", "name": "Colour Name", "role": "how it's used e.g. dominant background, accent, highlight" }, ... ] }
Extract 6-8 colours. Ensure all hex codes are valid 6-digit uppercase hex values. Be precise — sample actual colours from the image, not approximations.`,
            messages: [{
              role: 'user',
              content: [
                { type: 'image', source: { type: 'base64', media_type: mime, data: base64 } },
                { type: 'text', text: 'Extract the dominant colours from this image.' },
              ],
            }],
          }),
        });

        const data = await res.json();
        const text = data.content?.[0]?.text || '';
        const clean = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(clean);
        setColours(parsed.colours || []);
      } catch (e) {
        setError('Could not extract colours. Make sure your API key is configured.');
      }
      setLoading(false);
    };
    reader.readAsDataURL(image);
  };

  const copyHex = (hex, id) => {
    navigator.clipboard?.writeText(hex);
    setCopied(id);
    setTimeout(() => setCopied(null), 1400);
  };

  const copyAll = () => {
    const all = colours.map(c => c.hex).join(', ');
    navigator.clipboard?.writeText(all);
    setCopied('all');
    setTimeout(() => setCopied(null), 1800);
  };

  const copyCSS = () => {
    const css = `:root {\n${colours.map((c, i) => `  --color-${i + 1}: ${c.hex}; /* ${c.name} */`).join('\n')}\n}`;
    navigator.clipboard?.writeText(css);
    setCopied('css');
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="fade-up">
      <PageHeader title="Colour Extractor" sub="// upload any image, pull the exact palette" />

      {/* Upload zone */}
      {!imageUrl ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `1.5px dashed ${dragging ? 'var(--accent)' : 'rgba(0,0,0,0.15)'}`,
            borderRadius: 16,
            padding: '56px 32px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragging ? '#fdf0ea' : 'var(--warm)',
            transition: 'all 0.2s',
            marginBottom: 28,
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 14 }}>🎨</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Drop any image here</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>
            Photo, illustration, screenshot, brand asset — anything
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: 24 }}>
          <div style={{ borderRadius: 14, overflow: 'hidden', border: '0.5px solid var(--border)', marginBottom: 14 }}>
            <img
              src={imageUrl}
              alt="uploaded"
              style={{ width: '100%', maxHeight: 340, objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="accent" onClick={extract} disabled={loading} style={{ flex: 1 }}>
              {loading ? <><Spinner />Analysing colours...</> : 'Extract Colours →'}
            </Button>
            <Button variant="ghost" onClick={() => { setImage(null); setImageUrl(null); setColours([]); }}>
              Change image
            </Button>
          </div>
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />

      {error && (
        <div style={{ padding: '12px 16px', background: '#fdf0ea', borderRadius: 10, color: 'var(--accent)', fontSize: 13, fontFamily: 'var(--font-mono)', marginBottom: 20 }}>
          {error}
        </div>
      )}

      {/* Loading shimmer */}
      {loading && (
        <div>
          <SectionLabel>Analysing image...</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} style={{ height: 80, borderRadius: 10, background: 'var(--warm)', animation: 'pulse 1.4s ease infinite', animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {colours.length > 0 && (
        <>
          {/* Big colour strip */}
          <div style={{ display: 'flex', height: 64, borderRadius: 12, overflow: 'hidden', marginBottom: 20, border: '0.5px solid var(--border)' }}>
            {colours.map((c, i) => (
              <div
                key={i}
                style={{ flex: 1, background: c.hex, cursor: 'pointer' }}
                onClick={() => copyHex(c.hex, `strip-${i}`)}
                title={c.hex}
              />
            ))}
          </div>

          <SectionLabel>Extracted Colours</SectionLabel>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }} className="colour-roles">
            {colours.map((c, i) => (
              <div
                key={i}
                onClick={() => copyHex(c.hex, i)}
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '0.5px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'transform 0.15s',
                }}
              >
                <div style={{ height: 64, background: c.hex }} />
                <div style={{ padding: '8px 10px', background: 'var(--card)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, marginBottom: 2 }}>
                    {copied === i ? '✓ Copied' : c.hex}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 2 }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)', lineHeight: 1.4 }}>{c.role}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Export row */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Button variant="accent" onClick={copyAll}>
              {copied === 'all' ? '✓ Copied!' : 'Copy all hex values'}
            </Button>
            <Button variant="ghost" onClick={copyCSS}>
              {copied === 'css' ? '✓ Copied!' : 'Copy as CSS vars'}
            </Button>
            <Button variant="ghost" onClick={() => { setColours([]); extract(); }}>
              Re-extract ↺
            </Button>
          </div>
        </>
      )}

      {/* Tips when empty */}
      {!imageUrl && (
        <>
          <SectionLabel>Works great with</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {[
              { icon: '🖼', tip: 'Brand photography and campaign images' },
              { icon: '🎨', tip: 'Illustrations and artwork you want to reference' },
              { icon: '📸', tip: 'Screenshots of websites or apps you admire' },
              { icon: '🌿', tip: 'Nature photos, textures, or mood board imagery' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 14px', background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 10 }}>
                <span style={{ fontSize: 18 }}>{t.icon}</span>
                <span style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{t.tip}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
