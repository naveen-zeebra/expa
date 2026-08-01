"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

const TEXT_LINES = ["Expa is a", "Company Studio"];

const SETTINGS = {
  color: "#ffffff",
  fontSize: 90,
  gap: 3,
  radius: 1.2,
};

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, radius: 80 });
  const introCompleteRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  /* ── Generate particles from text bitmap ── */
  const generateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tmp = document.createElement("canvas");
    const tmpCtx = tmp.getContext("2d");
    if (!tmpCtx) return;

    tmp.width = canvas.width;
    tmp.height = canvas.height;

    /* Responsive font size — scales with viewport width */
    const fontSize = Math.min(canvas.width * 0.07, SETTINGS.fontSize);
    const lineHeight = fontSize * 1.3;
    const totalTextHeight = lineHeight * TEXT_LINES.length;
    const startY = canvas.height / 2 - totalTextHeight / 2 + fontSize * 0.35;

    tmpCtx.textAlign = "center";
    tmpCtx.textBaseline = "middle";
    tmpCtx.strokeStyle = "#ffffff";
    tmpCtx.lineWidth = 2.5;
    tmpCtx.font = `300 ${fontSize}px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

    /* Draw each line as stroked outlines */
    TEXT_LINES.forEach((line, idx) => {
      tmpCtx.strokeText(line, tmp.width / 2, startY + idx * lineHeight);
    });

    const imgData = tmpCtx.getImageData(0, 0, tmp.width, tmp.height);
    const newParticles: Particle[] = [];

    for (let y = 0; y < tmp.height; y += SETTINGS.gap) {
      for (let x = 0; x < tmp.width; x += SETTINGS.gap) {
        const i = (y * tmp.width + x) * 4;
        if (imgData.data[i + 3] > 128) {
          newParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            tx: x,
            ty: y,
            vx: 0,
            vy: 0,
            radius: SETTINGS.radius,
            color: SETTINGS.color,
          });
        }
      }
    }

    particlesRef.current = newParticles;
  }, []);

  /* ── GSAP morph — particles fly in to text shape ── */
  const animateIntro = useCallback(() => {
    const particles = particlesRef.current;
    const hint = hintRef.current;

    gsap.to(particles, {
      duration: 3,
      x: (i: number) => particles[i].tx,
      y: (i: number) => particles[i].ty,
      ease: "power3.out",
      stagger: { amount: 2 },
      onComplete() {
        introCompleteRef.current = true;
        hint?.classList.add("show");
        particles.forEach((p) => {
          p.x = p.tx;
          p.y = p.ty;
        });
      },
    });
  }, []);

  /* ── Draw loop ── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const particles = particlesRef.current;
    const mouse = mouseRef.current;
    const introComplete = introCompleteRef.current;

    particles.forEach((p) => {
      if (introComplete) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * 6;
          p.vy += Math.sin(angle) * force * 6;
        }

        p.vx += (p.tx - p.x) * 0.08;
        p.vy += (p.ty - p.y) * 0.08;
        p.vx *= 0.78;
        p.vy *= 0.78;
        p.x += p.vx;
        p.y += p.vy;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const hue = (speed * 600) % 360;
        const sat = Math.min(speed * 18, 100);
        ctx.fillStyle = `hsl(${hue}, ${sat}%, ${80 + sat * 0.2}%)`;
      } else {
        ctx.fillStyle = p.color;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    rafIdRef.current = requestAnimationFrame(draw);
  }, []);

  /* ── Boot & cleanup ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const boot = () => {
      resizeCanvas();
      generateParticles();
      animateIntro();
      draw();
    };

    const handleResize = () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      introCompleteRef.current = false;
      hintRef.current?.classList.remove("show");
      boot();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - r.left;
      mouseRef.current.y = e.clientY - r.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      const t = e.touches[0];
      mouseRef.current.x = t.clientX - r.left;
      mouseRef.current.y = t.clientY - r.top;
    };

    const handleTouchEnd = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("resize", handleResize);

    document.fonts.ready.then(boot);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
    };
  }, [generateParticles, animateIntro, draw]);

  return (
    <section className="hero-particle-section">
      <canvas ref={canvasRef} className="hero-particle-canvas" />
      <div ref={hintRef} className="hero-particle-hint">
        Move your mouse over the text
      </div>

      <style jsx>{`
        .hero-particle-section {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #0f0f1a;
        }

        .hero-particle-canvas {
          display: block;
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .hero-particle-hint {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          font-family: "Outfit", sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.32);
          letter-spacing: 0.14em;
          pointer-events: none;
          opacity: 0;
          transition: opacity 1.2s ease;
          z-index: 10;
        }

        .hero-particle-hint.show {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
