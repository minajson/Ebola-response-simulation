"use client";

import { useEffect, useRef } from "react";

const GOLDS = ["#C9A13B", "#E3C56E", "#B8902F", "#F1DE9C", "#A87B1F", "#FFFFFF"];

interface Piece {
  x: number;
  y: number;
  vy: number;
  vx: number;
  w: number;
  h: number;
  rot: number;
  vrot: number;
  flip: number;
  vflip: number;
  sway: number;
  color: string;
}

/**
 * Elegant one-shot gold confetti on a canvas. Falls once, then stops and clears.
 * Not rendered at all when Reduce Motion is on (handled by the caller).
 */
export default function Confetti({ durationMs = 5200, count = 140 }: { durationMs?: number; count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const pieces: Piece[] = Array.from({ length: count }, () => ({
      x: rand(0, W()),
      y: rand(-H() * 0.6, -12),
      vy: rand(1.4, 3.0),
      vx: rand(-0.35, 0.35),
      w: rand(5, 9),
      h: rand(9, 15),
      rot: rand(0, Math.PI * 2),
      vrot: rand(-0.06, 0.06),
      flip: rand(0, Math.PI * 2),
      vflip: rand(0.05, 0.12),
      sway: rand(0, Math.PI * 2),
      color: GOLDS[Math.floor(Math.random() * GOLDS.length)],
    }));

    const start = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const elapsed = now - start;
      const fade = elapsed > durationMs - 1200 ? Math.max(0, (durationMs - elapsed) / 1200) : 1;
      ctx.clearRect(0, 0, W(), H());
      for (const p of pieces) {
        p.sway += 0.03;
        p.x += p.vx + Math.sin(p.sway) * 0.55;
        p.y += p.vy;
        p.rot += p.vrot;
        p.flip += p.vflip;
        ctx.save();
        ctx.globalAlpha = fade * 0.95;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, Math.cos(p.flip));
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        if (p.color === "#FFFFFF") {
          ctx.strokeStyle = "#E6D3A1";
          ctx.lineWidth = 0.8;
          ctx.strokeRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }
      if (elapsed < durationMs) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, W(), H());
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [durationMs, count]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 h-full w-full" />;
}
