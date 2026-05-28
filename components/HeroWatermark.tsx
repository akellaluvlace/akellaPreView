'use client';
import React from 'react';
import { WATERMARK_PATH_D, WATERMARK_VIEWBOX } from './HeroWatermark.path';

// Sketched watermark: same silhouette + placement + tone as the
// previous inverted PNG (white-ish at ~30% opacity, sized large
// behind the left column so it bleeds slightly off the column box
// like a paper watermark). The only addition is the diagonal mask-
// wipe reveal — a stroked outline sketches in first, then the
// solid fill wipes in behind and the outline fades out.
//
// Anchor uses the SAME absolute-position + translate trick the
// original <img> used (left:50% / top:40% / translate(-50%,-50%),
// then shifted to left:28% / top:50% on lg+). Scale animation lives
// on the inner SVG so it doesn't fight the anchor's translate.
const WM_STYLE = `
@keyframes wmWipe    { from { -webkit-mask-position: 108% 108%; mask-position: 108% 108%; } to { -webkit-mask-position: 0% 0%; mask-position: 0% 0%; } }
@keyframes wmLineOut { from { opacity: 1; } to { opacity: 0; } }
@keyframes wmScale   { from { transform: scale(1); } to { transform: scale(1.03); } }

/* Sized to match the visual footprint of the previous inverted
   PNG watermark. The new SVG is taller than the PNG was (viewBox
   1600x1827 ≈ 0.88 aspect), so the % widths are tuned down — same
   visual height as before, not a 1:1 % copy of the old img sizing. */
.hero-wm-anchor {
  position: absolute;
  pointer-events: none;
  z-index: -10;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 380px;
  opacity: 0.3;
}
@media (min-width: 1024px) {
  .hero-wm-anchor {
    left: 32%;
    top: 50%;
    width: 78%;
    max-width: 700px;
  }
}
.hero-wm-svg {
  display: block;
  width: 100%;
  height: auto;
  transform-origin: center;
  animation: wmScale 2.6s cubic-bezier(0.25, 0.1, 0.25, 1) 1.8s both;
}
.wm-line, .wm-fill {
  -webkit-mask-image: linear-gradient(125deg, #000 0%, #000 34%, rgba(0,0,0,0) 62%);
          mask-image: linear-gradient(125deg, #000 0%, #000 34%, rgba(0,0,0,0) 62%);
  -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
  -webkit-mask-size: 240% 240%;
          mask-size: 240% 240%;
  -webkit-mask-position: 108% 108%;
          mask-position: 108% 108%;
}
.wm-line {
  fill: none;
  stroke: #ffffff;
  stroke-width: 4;
  vector-effect: non-scaling-stroke;
  animation:
    wmWipe 2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both,
    wmLineOut 1s ease-in-out 2.7s both;
}
.wm-fill {
  fill: #ffffff;
  fill-rule: evenodd;
  animation: wmWipe 2.4s cubic-bezier(0.4, 0, 0.2, 1) 1s both;
}
@media (prefers-reduced-motion: reduce) {
  .hero-wm-svg { animation: none; }
  .wm-line { display: none; }
  .wm-fill { animation: none; -webkit-mask-image: none; mask-image: none; }
}
`;

export default function HeroWatermark() {
  return (
    <div className="hero-wm-anchor" aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: WM_STYLE }} />
      <svg
        className="hero-wm-svg"
        viewBox={WATERMARK_VIEWBOX}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        <path className="wm-line" d={WATERMARK_PATH_D} />
        <path className="wm-fill" d={WATERMARK_PATH_D} />
      </svg>
    </div>
  );
}
