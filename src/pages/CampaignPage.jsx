import React, { useState, useRef } from 'react';
import { PageHeader, SectionLabel, Card, Button, Spinner, Grid } from '../components/UI';
import { SaveShareButtons } from './AIPalettePage';
import { ITEM_TYPES } from '../utils/library';

const BRIEF_EXAMPLES = [
  'Nike — new running shoe launch targeting Gen Z athletes, bold and unapologetic',
  'Innocent Drinks — summer campaign, playful and sustainable, UK market',
  'Airbnb — campaign promoting unique stays, sense of adventure and belonging',
  'Oatly — provocative anti-dairy campaign, challenger brand energy',
  'Apple — iPhone launch, minimal and aspirational',
];

const CHANNELS = [
  { id: 'social',  label: 'Social Media',     icon: '◈' },
  { id: 'ooh',     label: 'OOH / Outdoor',    icon: '◉' },
  { id: 'print',   label: 'Print / Press',    icon: '▣' },
  { id: 'tv',      label: 'TV / Video',       icon: '◆' },
  { id: 'digital', label: 'Digital / Display',icon: '⬡' },
  { id: 'email',   label: 'Email',            icon: '◎' },
];

export default function CampaignPage() {
  const [brief, setBrief] = useState('');
  const [selectedChannels, setSelectedChannels] = useState(['social', 'ooh', 'digital']);
  const [assets, setAssets] = useState([]);
  const [assetPreviews, setAssetPreviews] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('concept');
  const inputRef = useRef();

  const toggleChannel = (id) =>
    setSelectedChannels(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  const handleFiles = (files) => {
    const newAssets = [...assets, ...Array.from(files)].slice(0, 3);
    setAssets(newAssets);
    newAssets.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => setAssetPreviews(prev => {
        const filtered = prev.filter(p => p.name !== file.name);
        return [...filtered, { name: file.name, url: e.target.result }];
      });
      reader.readAsDataURL(file);
    });
  };

  const generate = async () => {
    if (!brief.trim()) return;
    setLoading(true); setError(''); setCampaign(null);
    try {
      const channels = CHANNELS.filter(c => selectedChannels.includes(c.id)).map(c => c.label).join(', ');
      const content = [];
      for (const asset of assets.slice(0, 2)) {
        await new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = e => {
            const base64 = e.target.result.split(',')[1];
            content.push({ type: 'image', source: { type: 'base64', media_type: asset.type || 'image/png', data: base64 } });
            resolve();
          };
          reader.readAsDataURL(asset);
        });
      }
      content.push({ type: 'text', text: `Create a full creative campaign for: ${brief}\nChannels: ${channels}\n${assets.length > 0 ? 'Brand assets uploaded above — use them to inform the visual direction.' : ''}` });

      const res = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 3000,
          system: `You are an award-winning creative director at a top global agency. Create iconic, culturally resonant campaigns. Be bold, specific, opinionated.
Respond ONLY with valid JSON — no markdown, no backticks.
Format:
{
  "campaignName": "string",
  "bigIdea": "string",
  "tagline": "string",
  "insight": "string",
  "concept": "string",
  "headlines": [{"headline":"string","context":"string"}],
  "copyDirections": [{"tone":"string","sample":"string"}],
  "visualDirection": {"artDirection":"string","moodWords":["string"],"references":["string"]},
  "channels": [{"channel":"string","idea":"string","format":"string","copy":"string"}],
  "campaignPillar1": {"name":"string","description":"string"},
  "campaignPillar2": {"name":"string","description":"string"},
  "campaignPillar3": {"name":"string","description":"string"},
  "doList": ["string"],
  "dontList": ["string"],
  "kpis": ["string"]
}`,
          messages: [{ role: 'user', content }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || '';
      if (!text) throw new Error(data?.error?.message || 'Empty response');
      setCampaign(JSON.parse(text.replace(/```json|```/g, '').trim()));
      setActiveTab('concept');
    } catch (e) { setError('Error: ' + (e.message || String(e))); }
    setLoading(false);
  };

  const tabs = ['concept', 'headlines', 'copy', 'visual', 'channels'];

  return (
    <div className="fade-up">
      <PageHeader title="Campaign Generator" sub="// brief in, full campaign out" />

      <SectionLabel>Campaign Brief</SectionLabel>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {BRIEF_EXAMPLES.map(ex => (
          <button key={ex} onClick={() => setBrief(ex)} style={{ padding: '6px 14px', borderRadius: 20, border: '0.5px solid var(--border)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-mono)', background: 'var(--warm)', color: 'var(--ink)' }}>
            {ex.split(' — ')[0]}
          </button>
        ))}
      </div>
      <textarea value={brief} onChange={e => setBrief(e.target.value)} placeholder="Brand, product, objective, audience, tone, market..." rows={3}
        style={{ width: '100%', padding: '14px 16px', border: '0.5px solid var(--border)', borderRadius: 10, fontFamily: 'var(--font-ui)', fontSize: 14, resize: 'vertical', outline: 'none', background: 'var(--warm)', color: 'var(--ink)', marginBottom: 16, lineHeight: 1.6 }} />

      <SectionLabel>Channels</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }} className="responsive-grid cols-3">
        {CHANNELS.map(ch => (
          <button key={ch.id} onClick={() => toggleChannel(ch.id)} style={{ padding: '10px 12px', borderRadius: 10, border: selectedChannels.includes(ch.id) ? '1.5px solid var(--accent)' : '0.5px solid var(--border)', background: selectedChannels.includes(ch.id) ? 'var(--accent)' : 'var(--card)', color: selectedChannels.includes(ch.id) ? '#fff' : 'var(--ink)', fontSize: 12, fontFamily: 'var(--font-ui)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{ch.icon}</span>{ch.label}
          </button>
        ))}
      </div>

      <SectionLabel>Brand Assets (optional)</SectionLabel>
      <div onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        onClick={() => assets.length < 3 && inputRef.current?.click()}
        style={{ border: '1.5px dashed rgba(0,0,0,0.15)', borderRadius: 12, padding: '24px', textAlign: 'center', cursor: assets.length >= 3 ? 'default' : 'pointer', background: 'var(--warm)', marginBottom: 12 }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>◈</div>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{assets.length >= 3 ? 'Max 3 assets uploaded' : 'Upload brand assets'}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>Logos, product shots, brand images — up to 3</div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />

      {assetPreviews.length > 0 && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {assetPreviews.map((p, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <img src={p.url} alt={p.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '0.5px solid var(--border)' }} />
              <button onClick={() => { setAssets(prev => prev.filter((_,j) => j !== i)); setAssetPreviews(prev => prev.filter((_,j) => j !== i)); }}
                style={{ position: 'absolute', top: -6, right: -6, background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, fontSize: 10, cursor: 'pointer' }}>✕</button>
            </div>
          ))}
        </div>
      )}

      <Button variant="accent" onClick={generate} disabled={loading || !brief.trim()} style={{ width: '100%', padding: 15, fontSize: 14, marginBottom: 24 }}>
        {loading ? <><Spinner />Building your campaign...</> : 'Generate Campaign →'}
      </Button>

      {error && <div style={{ padding: '12px 16px', background: '#fdf0ea', borderRadius: 10, color: 'var(--accent)', fontSize: 13, fontFamily: 'var(--font-mono)', marginBottom: 20 }}>{error}</div>}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[200,140,180,120].map((h,i) => <div key={i} style={{ height: h, borderRadius: 14, background: 'var(--warm)', animation: 'pulse 1.4s ease infinite', animationDelay: `${i*0.2}s` }} />)}
        </div>
      )}

      {campaign && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--ink)', borderRadius: 16, padding: '32px 28px', color: 'var(--paper)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', marginBottom: 16, textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>// Campaign</span>
              <SaveShareButtons item={{ type: ITEM_TYPES.MOODBOARD, data: campaign, brief }} label="Save Campaign" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontStyle: 'italic', fontWeight: 300, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 10 }}>{campaign.campaignName}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 20, fontStyle: 'italic' }}>"{campaign.tagline}"</div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 16px', flex: 1, minWidth: 200 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', marginBottom: 6, textTransform: 'uppercase' }}>Big Idea</div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>{campaign.bigIdea}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 16px', flex: 1, minWidth: 200 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', marginBottom: 6, textTransform: 'uppercase' }}>Insight</div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>{campaign.insight}</div>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,255,0.7)' }}>{campaign.concept}</p>
          </div>

          <div style={{ display: 'flex', gap: 4, background: 'var(--warm)', padding: 4, borderRadius: 10, overflowX: 'auto' }} className="tab-bar">
            {tabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)', background: activeTab === t ? 'var(--ink)' : 'transparent', color: activeTab === t ? 'var(--paper)' : 'var(--muted)', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'concept' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Grid cols={3} gap={12}>
                {[campaign.campaignPillar1, campaign.campaignPillar2, campaign.campaignPillar3].filter(Boolean).map((p,i) => (
                  <Card key={i} style={{ borderTop: '3px solid var(--accent)', borderRadius: '0 0 14px 14px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '1px', marginBottom: 6 }}>PILLAR {i+1}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{p.description}</div>
                  </Card>
                ))}
              </Grid>
              <Grid cols={2} gap={12}>
                <Card>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent2)', letterSpacing: '2px', marginBottom: 12, textTransform: 'uppercase' }}>✓ Creative Do's</div>
                  {campaign.doList?.map((d,i) => <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}><span style={{ color: 'var(--accent2)', fontWeight: 700 }}>→</span><span style={{ fontSize: 13 }}>{d}</span></div>)}
                </Card>
                <Card>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '2px', marginBottom: 12, textTransform: 'uppercase' }}>✕ Don'ts</div>
                  {campaign.dontList?.map((d,i) => <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}><span style={{ color: 'var(--accent)', fontWeight: 700 }}>×</span><span style={{ fontSize: 13 }}>{d}</span></div>)}
                </Card>
              </Grid>
              <Card>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: '2px', marginBottom: 12, textTransform: 'uppercase' }}>KPIs</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {campaign.kpis?.map((k,i) => <span key={i} style={{ padding: '5px 14px', background: 'var(--warm)', borderRadius: 20, fontSize: 12, fontFamily: 'var(--font-mono)' }}>{k}</span>)}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'headlines' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {campaign.headlines?.map((h,i) => (
                <div key={i} onClick={() => navigator.clipboard?.writeText(h.headline)} style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 16, cursor: 'pointer' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'rgba(0,0,0,0.08)', fontWeight: 500, minWidth: 28 }}>0{i+1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontStyle: 'italic', fontWeight: 300, letterSpacing: -0.5, marginBottom: 6, lineHeight: 1.2 }}>{h.headline}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>{h.context}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', flexShrink: 0 }}>click to copy</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'copy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {campaign.copyDirections?.map((c,i) => (
                <Card key={i}>
                  <span style={{ padding: '4px 12px', background: 'var(--ink)', color: 'var(--paper)', borderRadius: 20, fontSize: 11, fontWeight: 700, marginBottom: 10, display: 'inline-block' }}>{c.tone}</span>
                  <p style={{ fontSize: 14, lineHeight: 1.75, marginTop: 10 }}>{c.sample}</p>
                  <button onClick={() => navigator.clipboard?.writeText(c.sample)} style={{ marginTop: 10, padding: '6px 14px', borderRadius: 8, border: '0.5px solid var(--border)', fontSize: 11, fontFamily: 'var(--font-mono)', background: 'var(--warm)', cursor: 'pointer', color: 'var(--ink)' }}>Copy</button>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'visual' && campaign.visualDirection && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Card style={{ borderLeft: '3px solid var(--accent)', borderRadius: '0 14px 14px 0' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', marginBottom: 10, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Art Direction</div>
                <p style={{ fontSize: 14, lineHeight: 1.75 }}>{campaign.visualDirection.artDirection}</p>
              </Card>
              <Grid cols={2} gap={12}>
                <Card>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', marginBottom: 12, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Mood Words</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {campaign.visualDirection.moodWords?.map((w,i) => <span key={i} style={{ padding: '5px 14px', background: 'var(--ink)', color: 'var(--paper)', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{w}</span>)}
                  </div>
                </Card>
                <Card>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', marginBottom: 12, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Visual References</div>
                  {campaign.visualDirection.references?.map((r,i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                      <span style={{ color: 'var(--accent3)', fontWeight: 700, flexShrink: 0 }}>◈</span>
                      <span style={{ fontSize: 13, lineHeight: 1.5 }}>{r}</span>
                    </div>
                  ))}
                </Card>
              </Grid>
            </div>
          )}

          {activeTab === 'channels' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {campaign.channels?.map((ch,i) => (
                <Card key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 10, padding: '3px 12px', borderRadius: 20, fontFamily: 'var(--font-mono)', background: 'var(--ink)', color: 'var(--paper)', fontWeight: 700 }}>{ch.channel}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>{ch.format}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{ch.idea}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, fontStyle: 'italic' }}>"{ch.copy}"</div>
                </Card>
              ))}
            </div>
          )}

          <Button variant="ghost" onClick={generate} disabled={loading}>Regenerate ↺</Button>
        </div>
      )}
    </div>
  );
}