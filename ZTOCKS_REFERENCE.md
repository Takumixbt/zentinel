# Ztocks reference notes

Extracted directly from `https://ztocks.vercel.app/`'s live bundle and computed
styles (not guessed) — for building the frontend layout in white + yellow.

## Typography

- Body/headings font: **Figtree** (Google Font)
- Buttons/labels/mono text font: **Geist Mono**
- `h1`: font-size `100.8px`, letter-spacing `-2.52px` (very tight), line-height
  `90.72px` (~0.9 ratio — tight)
- `p`: font-size `24px`, line-height `39px`
- body base: font-size `18px`, line-height `27px`

## Original color scheme (for reference — swap for white/yellow)

- Background: `oklch(0.985 0.002 90)` — near-white warm cream
- Body text: `oklch(0.12 0.01 60)` — near-black warm
- Muted text: `oklch(0.45 0.02 60)` — warm gray
- No accent color at all — pure black/white/gray minimalism. (The yellow accent
  is your own deliberate addition, not something Ztocks has.)

## Hero background: a rotating ASCII/block-glyph sphere

This is a `<canvas>`, absolutely positioned `right-0 top-1/3 -translate-y-1/2`,
sized `600px` (mobile) / `800px` (desktop), `opacity-40`, `pointer-events-none`.
It draws a **3D point-cloud sphere** using spherical coordinate sampling,
rotated on two axes, painter's-algorithm z-sorted, with depth-based glyph
shading. Full extracted logic (minified, deobfuscated variable names below for
clarity):

```js
const GLYPHS = "░▒▓█▀▄▌▐│─┤├┴┬╭╮╰╯"; // block-shading ramp, dark→light
let l = 0; // rotation phase, advances 0.02/frame

function draw(now) {
  if (!isIntersecting || now - lastFrame < 33) { raf = requestAnimationFrame(draw); return; }
  lastFrame = now;
  const { width, height } = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, width, height);
  const cx = width / 2, cy = height / 2;
  const radius = 0.525 * Math.min(width, height);
  ctx.font = "12px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const points = [];
  // Spiral-sample a sphere surface: theta (0..2π), phi (0..π)
  for (let theta = 0; theta < 2 * Math.PI; theta += 0.22) {
    for (let phi = 0; phi < Math.PI; phi += 0.22) {
      let x = Math.sin(phi) * Math.cos(theta + 0.5 * l);
      let y = Math.sin(phi) * Math.sin(theta + 0.5 * l);
      let z = Math.cos(phi);
      // rotate around one axis by 0.3*l
      const rz1 = 0.3 * l;
      let x2 = x * Math.cos(rz1) - z * Math.sin(rz1);
      let z2 = x * Math.sin(rz1) + z * Math.cos(rz1);
      // rotate around another axis by 0.2*l
      const rz2 = 0.2 * l;
      let y2 = y * Math.cos(rz2) - z2 * Math.sin(rz2);
      let z3 = y * Math.sin(rz2) + z2 * Math.cos(rz2);
      const glyphIdx = Math.floor((z3 + 1) / 2 * (GLYPHS.length - 1));
      points.push({ x: cx + x2 * radius, y: cy + y2 * radius, z: z3, char: GLYPHS[glyphIdx] });
    }
  }
  points.sort((a, b) => a.z - b.z); // painter's algorithm: back to front
  points.forEach((p) => {
    const opacity = 0.2 + (p.z + 1) * 0.4; // 0.2 .. 1.0, front-facing = more opaque
    ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`; // <-- swap to a yellow rgba for this theme
    ctx.fillText(p.char, p.x, p.y);
  });
  l += 0.02;
  raf = requestAnimationFrame(draw);
}
```

Throttled to ~30fps (`now - lastFrame < 33` skip), only runs while an
`IntersectionObserver` confirms the canvas is on-screen, resizes on
`devicePixelRatio`-aware `resize`.

## Full grid overlay (hero background texture)

Not just horizontal lines — a full grid, absolutely positioned over the hero,
`opacity-30` container:

```jsx
<div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
  {[...Array(8)].map((_, i) => (
    <div className="absolute h-px bg-foreground/10" style={{ top: `${12.5 * (i + 1)}%`, left: 0, right: 0 }} />
  ))}
  {[...Array(12)].map((_, i) => (
    <div className="absolute w-px bg-foreground/10" style={{ left: `${8.33 * (i + 1)}%`, top: 0, bottom: 0 }} />
  ))}
</div>
```

## Hero headline word-cycle

Word list: `["encrypt", "trade", "protect", "scale"]`, swapped every **2500ms**
via `setInterval` (not 2000ms — that was my earlier mistake).

## Footer ambient background: a flowing sine-noise glyph field

Separate, smaller canvas behind the footer (`absolute inset-0 h-64 opacity-20`).
Draws a **fixed 20px grid** of glyphs, colored by a 3-wave sine/cosine
interference field (a cheap Perlin-noise substitute):

```js
const GLYPHS = "·∘○◯◌●"; // sparse → dense
let l = 0; // time phase, advances 0.03/frame

function draw(now) {
  if (!isIntersecting || now - lastFrame < 50) { raf = requestAnimationFrame(draw); return; } // ~20fps
  lastFrame = now;
  const { width, height } = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, width, height);
  ctx.font = "14px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const cols = Math.floor(width / 20), rows = Math.floor(height / 20);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = (col + 0.5) * (width / cols);
      const y = (row + 0.5) * (height / rows);
      const noise = (
        Math.sin(0.2 * col + 2 * l) * Math.cos(0.15 * row + l) +
        Math.sin((col + row) * 0.1 + 1.5 * l) +
        Math.cos(0.1 * col - 0.1 * row + 0.8 * l)
      ) / 3;
      const n = (noise + 1) / 2; // normalize 0..1
      const glyphIdx = Math.floor(n * (GLYPHS.length - 1));
      const opacity = 0.15 + 0.5 * n;
      ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`; // <-- swap to yellow rgba
      ctx.fillText(GLYPHS[glyphIdx], x, y);
    }
  }
  l += 0.03;
  raf = requestAnimationFrame(draw);
}
```

## Stats section

2-column grid (`grid-cols-1 md:grid-cols-2`), cells separated by a 1px hairline
seam (`gap-px bg-foreground/10` on the grid container, `bg-background` on each
cell — the gap color shows through as thin dividers). Each number counts up
from 0 via `requestAnimationFrame` + cubic ease-out over 2000ms, triggered
once by an `IntersectionObserver` at `threshold: 0.5`:

```js
const progress = Math.min((now - start) / 2000, 1);
const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
setValue(Math.floor(eased * targetValue));
```

Header row: small label (`Market context` / eyebrow style) + `h2`, with a
live clock on the right (`● Live` pulsing dot + `new Date().toLocaleTimeString()`
updating every second via `setInterval`).

## Footer structure

6-column grid (`grid-cols-2 md:grid-cols-6`): first 2 columns = brand name +
tagline + social links; remaining 4 columns = link groups (their categories:
Protocol / Developers / Sepolia / Legal — use your own equivalents).

## What this means for Zentinel

- Recolor every `rgba(0,0,0,opacity)` fill in both canvases to a yellow rgba
  (e.g. `rgba(234, 179, 8, opacity)` for a Tailwind-amber-500-ish yellow) —
  the algorithms themselves don't need to change, just the fill color.
- Page background → white, ink → near-black, single accent → yellow (buttons,
  live indicators, hover states, focus rings).
- Everything above is a **technique description**, not literal copied source —
  written from scratch against Zentinel's own components in whatever color
  scheme you land on.
