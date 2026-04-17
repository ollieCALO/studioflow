import React, { useState, useRef } from 'react';
import { PageHeader, SectionLabel, Card, Button, Grid, Spinner } from '../components/UI';

const FOCUS_OPTIONS = [
  { icon: '🎨', label: 'Colour & Contrast' },
  { icon: '⬛', label: 'Typography' },
  { icon: '◫',  label: 'Layout & Grid' },
  { icon: '◎',  label: 'Brand Fit' },
  { icon: '✦',  label: 'Visual Hierarchy' },
  { icon: '◈',  label: 'Originality' },
  { icon: '⬡',  label: 'Composition' },
  { icon: '◉',  label: 'Overall Polish' },
];

export default function FeedbackPage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setResult('');
    const reader = new FileReader();
    reader.onload = e => setPreviewUrl(e.target.result);
    reader.readAsDataURL(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const toggleFocus = (label) => {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(label) ? n.delete(label) : n.add(label);
      return n;
    });
  };

  const analyse = async () => {
    if (!file) return;
    setLoading(true);
    setResult('');

    const focus = selected.size > 0
      ? [...selected].join(', ')
      : 'overall design quality, visual hierarchy, colour, and typography';

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result.split(',')[1];
      const mime = file.type || 'image/png';

      try {
        const res = await fetch('/api/anthropic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1200,
            system: `You are a sharp, senior graphic designer and creative director with 20 years of experience across branding, editorial, and digital. 
Give honest, direct, constructive critique — no fluff. 
Structure your response as:
**What's Working** (2–3 specific strengths)
**What Needs Attention** (2–3 specific improvements with actionable fixes)
**One Bold Suggestion** (one idea that could take this to the next level)
Be specific. Reference actual design principles. Don't pad.`,
            messages: [{
              role: 'user',
              content: [
                { type: 'image', source: { type: 'base64', media_type: mime, data: base64 } },
                { type: 'text', text: `Please critique this design. Focus areas: ${focus}.` },
              ],
            }],
          }),
        });
        const data = await res.json();
        setResult(data.content?.[0]?.text || 'Could not generate feedback. Please try again.');
      } catch {
        setResult('Connection error. Make sure VITE_ANTHROPIC_API_KEY is set in your .env file.');
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult('');
    setSelected(new Set());
  };

  const formatResult = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={i} style={{ fontWeight: 700, color: 'var(--paper)', fontSize: 14, marginTop: i > 0 ? 18 : 0, marginBottom: 8 }}>{line.replace(/\*\*/g, '')}</div>;
      }
      if (line.match(/^\*\*(.*?)\*\*/)) {
        const formatted = line.replace(/\*\*(.*?)\*\*/g, (_, m) => `<strong style="color:var(--paper)">${m}</strong>`);
        return <p key={i} style={{ marginBottom: 6 }} dangerouslySetInnerHTML={{ __html: formatted }} />;
      }
      if (line.trim() === '') return <div key={i} style={{ height: 6 }} />;
      return <p key={i} style={{ marginBottom: 6, lineHeight: 1.7 }}>{line}</p>;
    });
  };

  return (
    <div className="fade-up">
      <PageHeader title="Get Feedback" sub="// upload your work, get sharp critique" />

      {/* Upload zone or preview */}
      {!previewUrl ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `1.5px dashed ${dragging ? 'var(--accent)' : 'rgba(0,0,0,0.15)'}`,
            borderRadius: 16,
            padding: '56px 32px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragging ? '#fdf0ea' : 'var(--warm)',
            transition: 'all 0.2s',
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 16 }}>⬆</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Drop your design here</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>PNG, JPG, GIF · Click or drag & drop</div>
        </div>
      ) : (
        <div style={{ borderRadius: 16, overflow: 'hidden', border: '0.5px solid var(--border)', marginBottom: 24 }}>
          <div style={{ padding: '12px 18px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--card)' }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{file?.name}</span>
            <button onClick={reset} style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}>✕ Remove</button>
          </div>
          <img src={previewUrl} alt="uploaded design" style={{ width: '100%', maxHeight: 360, objectFit: 'contain', background: '#f0f0f0', display: 'block' }} />
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />

      {/* Focus toggles */}
      <SectionLabel>Feedback Focus</SectionLabel>
      <Grid cols={4} gap={10} style={{ marginBottom: 20 }}>
        {FOCUS_OPTIONS.map(opt => (
          <button
            key={opt.label}
            onClick={() => toggleFocus(opt.label)}
            style={{
              padding: '12px 8px',
              border: selected.has(opt.label) ? '1.5px solid var(--accent)' : '0.5px solid var(--border)',
              borderRadius: 10,
              textAlign: 'center',
              cursor: 'pointer',
              background: selected.has(opt.label) ? '#d4501a' : 'var(--card)',
              color: selected.has(opt.label) ? 'white' : 'var(--ink)',
              transition: 'all 0.15s',
              fontFamily: 'var(--font-ui)',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 4 }}>{opt.icon}</div>
            {opt.label}
          </button>
        ))}
      </Grid>

      <button
        onClick={file ? analyse : () => inputRef.current?.click()}
        disabled={loading}
        style={{
          width: '100%',
          padding: 15,
          background: 'var(--accent)',
          color: 'white',
          border: 'none',
          borderRadius: 10,
          fontFamily: 'var(--font-ui)',
          fontSize: 14,
          fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          letterSpacing: '0.3px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {loading ? <><Spinner />Analysing your design...</> : file ? 'Analyse my design' : 'Upload a design first'}
      </button>

      {/* Feedback result */}
      {result && (
        <div style={{
          background: 'var(--ink)',
          borderRadius: 14,
          padding: 28,
          color: 'rgba(255,255,255,0.75)',
          fontSize: 14,
          lineHeight: 1.75,
          animation: 'fadeUp 0.3s ease both',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', marginBottom: 18, textTransform: 'uppercase' }}>
            // Creative Director Critique
          </div>
          {formatResult(result)}
        </div>
      )}

      {/* Tips */}
      {!file && !result && (
        <>
          <SectionLabel>What works best</SectionLabel>
          <Grid cols={2} gap={12}>
            {[
              { icon: '🖼', tip: 'Upload at full resolution for the best analysis' },
              { icon: '🎯', tip: 'Select 2–3 focus areas for more targeted feedback' },
              { icon: '📐', tip: 'Works great for logos, layouts, posters, brand assets' },
              { icon: '🔄', tip: 'Upload multiple versions to compare iterations' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 16px', background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 10 }}>
                <span style={{ fontSize: 20 }}>{t.icon}</span>
                <span style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{t.tip}</span>
              </div>
            ))}
          </Grid>
        </>
      )}
    </div>
  );
}
