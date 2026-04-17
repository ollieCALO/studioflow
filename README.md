# Studioflow

A designer's daily dashboard — colour palettes, typography pairings, inspo board, trending design content, and AI-powered design feedback.

Built with React + Vite. Powered by Claude.

## Features

- Colour Palettes — curated library, hover to reveal hex, click to copy
- Palette Generator — harmony modes (analogous, complementary, triadic, split, monochromatic), CSS + JSON export
- Typography — 6 font pairing specimens, interactive type scale, trending fonts, AI typographer
- Inspo Board — moodboard with save/filter
- Trending — design movement cards, article feed, AI creative director
- Get Feedback — upload any image, get sharp AI critique

## Setup

1. Install dependencies
   npm install

2. Add your API key
   cp .env.example .env
   # Edit .env — add your key from console.anthropic.com

3. Run dev server
   npm run dev
   # Open http://localhost:5173

## How the AI works

The Vite dev server proxies /api/anthropic/* to Anthropic, injecting your API key server-side.
Used for: typography advice, trend briefings, and vision-based design critique.

## Project structure

src/
  components/   Sidebar, shared UI components
  pages/        One file per section
  utils/        colours.js, typography.js

## Extending

- Add palettes in src/utils/colours.js → CURATED_PALETTES
- Add font pairings in src/utils/typography.js → FONT_PAIRINGS
- Add a page: create in src/pages/, import in App.jsx, add to Sidebar NAV

## Build

npm run build

Note: For production, replace the Vite proxy with a server-side route to keep your API key secure.
