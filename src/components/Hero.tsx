"use client";

import { useEffect, useRef } from "react";

class Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;

  constructor(x: number, y: number, color: string) {
    // Start exactly at the origin for perfectly crisp text at rest
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.vx = 0;
    this.vy = 0;
    this.size = 1.2;
    this.color = color;
  }

  update(mouseX: number, mouseY: number, mouseRadius: number) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouseRadius && distance > 0) {
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;

      // Calculate force: stronger closer to the mouse
      const force = (mouseRadius - distance) / mouseRadius;

      // Apply repulsion force
      const directionX = forceDirectionX * force * 20;
      const directionY = forceDirectionY * force * 20;

      this.vx -= directionX;
      this.vy -= directionY;
    }

    // Spring force to return to origin
    const dxOrigin = this.originX - this.x;
    const dyOrigin = this.originY - this.y;

    // Spring constant - controls how fast they snap back
    this.vx += dxOrigin * 0.08;
    this.vy += dyOrigin * 0.08;

    // Damping (friction) - lower value means more friction/less bouncing
    this.vx *= 0.82;
    this.vy *= 0.82;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 150, // Increased radius
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const init = () => {
      particles = [];
      const width = canvas.parentElement?.clientWidth || window.innerWidth;
      const height = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = width;
      canvas.height = height;

      // Draw text to read pixel data
      let fontSize = Math.min(width * 0.1, 88);
      if (window.innerWidth < 768) {
        fontSize = 40;
      }
      ctx.font = `400 ${fontSize}px "DM Sans", sans-serif`;
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const text1 = "Expa is a";
      const text2 = "Company Studio";

      const centerX = width / 2;
      const centerY = height / 2;

      // Use strokeText instead of fillText to get the outline effect
      ctx.strokeText(text1, centerX, centerY - fontSize * 0.6);
      ctx.strokeText(text2, centerX, centerY + fontSize * 0.6);

      const textCoordinates = ctx.getImageData(0, 0, width, height);
      ctx.clearRect(0, 0, width, height);

      const gap = 4; // Increased gap for distinct dots

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const index = (y * width + x) * 4;
          const alpha = textCoordinates.data[index + 3];
          // If the pixel is opaque, create a particle
          if (alpha > 64) {
            particles.push(new Particle(x, y, "rgba(255, 255, 255, 1)"));
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(mouse.x, mouse.y, mouse.radius);
        particles[i].draw(ctx);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    // Make sure font is loaded before initializing
    if (document.fonts) {
      document.fonts.ready.then(() => {
        init();
        animate();
      });
    } else {
      init();
      animate();
    }

    const handleResize = () => {
      init();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <header className="relative min-h-screen flex items-center justify-center">
      <div className="w-full h-full absolute inset-0">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />
        {/* Screen-reader only text for accessibility */}
        <h1 className="sr-only">
          Expa is a Company Studio
        </h1>
      </div>
    </header>
  );
}
