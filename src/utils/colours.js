export function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s));
  l = Math.max(5, Math.min(95, l));
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return '#' + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
}

export function generateHarmony(hex, type) {
  const [h, s, l] = hexToHsl(hex);
  const stops = {
    analogous:      [[h, s, l], [h - 30, s, l], [h + 30, s, l], [h - 60, s * 0.8, l + 10], [h + 60, s * 0.8, l - 10]],
    complementary:  [[h, s, l], [h + 180, s, l], [h, s * 0.6, l + 20], [h + 180, s * 0.6, l - 15], [h, s * 0.3, l + 30]],
    triadic:        [[h, s, l], [h + 120, s, l], [h + 240, s, l], [h, s * 0.5, l + 20], [h + 120, s * 0.5, l + 20]],
    split:          [[h, s, l], [h + 150, s, l], [h + 210, s, l], [h, s * 0.5, l + 20], [h + 180, s * 0.4, l - 10]],
    monochromatic:  [[h, s, l], [h, s, l - 20], [h, s, l + 20], [h, s * 0.5, l + 30], [h, s * 0.8, l - 35]],
  };
  return (stops[type] || stops.analogous).map(([hh, ss, ll]) => hslToHex(hh, ss, ll));
}

export function getContrastColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#0e0e0e' : '#ffffff';
}

export const CURATED_PALETTES = [
  { name: 'Typographic Fire', vibe: 'Bold · Editorial · Contrast', tags: ['Packaging', 'Branding', 'Print'], colours: ['#2C3E50', '#E74C3C', '#ECF0F1', '#F39C12', '#1ABC9C'] },
  { name: 'Aged Parchment',   vibe: 'Warm · Heritage · Craft',     tags: ['Publishing', 'Artisan'],         colours: ['#F8EDE3', '#DFB189', '#A0785A', '#5C3D2E', '#1A0A00'] },
  { name: 'Neon Noir',        vibe: 'Dark · Electric · Cyberpunk',  tags: ['Digital', 'Tech', 'Gaming'],     colours: ['#0D0D0D', '#1B1B2F', '#E94560', '#533483', '#FFFFFF'] },
  { name: 'Forest Walk',      vibe: 'Natural · Organic · Calm',     tags: ['Wellness', 'Eco', 'Food'],       colours: ['#F0F4C3', '#C5E1A5', '#66BB6A', '#2E7D32', '#1B4A1E'] },
  { name: 'Sunset Burn',      vibe: 'Vibrant · Energetic · Warm',   tags: ['Events', 'Food', 'Fashion'],     colours: ['#FFF8E7', '#FFE082', '#FFB300', '#E65100', '#BF360C'] },
  { name: 'Studio Violet',    vibe: 'Luxe · Mysterious · Bold',     tags: ['Luxury', 'Beauty', 'Art'],       colours: ['#F3E5F5', '#CE93D8', '#8E24AA', '#4A148C', '#12005E'] },
  { name: 'Bauhaus Revival',  vibe: 'Geometric · Modern · Clean',   tags: ['Architecture', 'Design', 'UI'],  colours: ['#E0F2F1', '#80CBC4', '#00897B', '#37474F', '#F9A825'] },
  { name: 'Risograph Print',  vibe: 'Playful · Tactile · Indie',    tags: ['Editorial', 'Poster', 'Zine'],   colours: ['#FEE9D6', '#F5A26A', '#E8456A', '#3D2B56', '#A8D8A8'] },
  { name: 'Coastal Mist',     vibe: 'Airy · Serene · Minimal',      tags: ['Interior', 'Lifestyle', 'SaaS'], colours: ['#F0F4F8', '#D9E8F0', '#8FBCCC', '#4A7C96', '#1C3A4A'] },
];
