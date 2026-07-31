"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface CompanyData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  founders: string;
  website: string;
  twitter: string;
}

const mockCompanies: CompanyData[] = [
  {
    id: "knock",
    name: "Knock",
    tagline: "Notification infrastructure\nfor developers.",
    description:
      "Knock is a flexible, reliable notifications infrastructure that's built to scale with you. Knock uses APIs to engage users, power cross-channel workflows, and manage notification preferences. The company is based in New York City and was founded by Sam Seely and Chris Bell.",
    founders: "Sam Seely, Chris Bell",
    website: "knock.app",
    twitter: "@knocklabs",
  },
  {
    id: "genie",
    name: "Genie",
    tagline: "Build data science\napps with no-code.",
    description:
      "Genie is on a mission to help organizations unlock the power of their data. Our low/no-code tools help data scientists and researchers quickly turn machine learning models and simulations into interactive web applications that enable data exploration and simplify decision-making. Genie is founded by Adrian Salceanu and Cirota Palumbo and based in Barcelona, Spain.",
    founders: "Adrian Salceanu, Cirota Palumbo",
    website: "genieframework.com",
    twitter: "",
  },
  {
    id: "radar",
    name: "Radar",
    tagline: "Location infrastructure for every product.",
    description:
      "Radar provides industry-leading geofencing, trip tracking, and geocoding capabilities. Developers use Radar to build location-based experiences that drive engagement and revenue.",
    founders: "Nick Patrick, Coby Berman",
    website: "radar.com",
    twitter: "@radarlabs",
  },
  {
    id: "mix",
    name: "Mix",
    tagline: "The best content from the open web, personalized.",
    description:
      "Mix is a new platform to discover, collect, and share the best content from the web. We are building a personalized discovery engine for the open web.",
    founders: "Garrett Camp",
    website: "mix.com",
    twitter: "@mix",
  },
  {
    id: "current",
    name: "Current",
    tagline: "The bank for modern life.",
    description: "Current is a leading U.S. financial technology company serving the needs of Americans who are working to create a better future for themselves. Our mission is to inspire everyday people to build the lives they want.",
    founders: "Stuart Sopp",
    website: "current.com",
    twitter: "@current",
  },
  {
    id: "aero",
    name: "Aero",
    tagline: "Redefining air travel.",
    description: "Aero is a premium aviation company that provides seamless, direct flights to the world's most coveted destinations using custom-designed jets.",
    founders: "Garrett Camp",
    website: "aero.com",
    twitter: "@aero",
  },
  {
    id: "metabase",
    name: "Metabase",
    tagline: "The best way to share data.",
    description: "Metabase is the easy, open source way for everyone in your company to ask questions and learn from data. We believe data tools should be accessible to everyone.",
    founders: "Sameer Al-Sakran",
    website: "metabase.com",
    twitter: "@metabase",
  },
  {
    id: "layer",
    name: "Layer",
    tagline: "New Art World.",
    description: "Layer provides digital infrastructure and tools for the new art world, helping artists and collectors navigate the digital landscape.",
    founders: "Unknown",
    website: "layer.com",
    twitter: "",
  },
];

class Dot {
  x: number;
  y: number;
  radius: number;
  hasRing: boolean;
  company?: CompanyData;
  hovered: boolean = false;
  
  // To keep them responsive to resize
  rx: number; 
  ry: number;

  // Variables for shaking/floating effect
  phaseX: number;
  phaseY: number;
  speed: number;

  constructor(rx: number, ry: number, radius: number, hasRing: boolean, company?: CompanyData) {
    this.rx = rx;
    this.ry = ry;
    this.x = 0;
    this.y = 0;
    this.radius = radius;
    this.hasRing = hasRing;
    this.company = company;
    
    // Initialize random phase and speed for natural organic movement
    this.phaseX = Math.random() * Math.PI * 2;
    this.phaseY = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 0.001 + 0.0005; // Very slow
  }

  update(width: number, height: number, time: number) {
    const baseX = this.rx * width;
    const baseY = this.ry * height;
    
    // Add a gentle floating/shaking effect using sine waves
    const driftX = Math.sin(time * this.speed + this.phaseX) * 4;
    const driftY = Math.cos(time * this.speed + this.phaseY) * 4;
    
    this.x = baseX + driftX;
    this.y = baseY + driftY;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.hovered && this.company ? "#f0ba26" : "#fff";
    ctx.fill();

    if (this.hasRing || (this.hovered && this.company)) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.hovered && this.company ? this.radius * 4 : this.radius * 6, 0, Math.PI * 2);
      ctx.strokeStyle = this.hovered && this.company ? "rgba(240, 186, 38, 0.4)" : "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    if (this.hovered && this.company) {
      ctx.font = "400 16px var(--font-body, 'Inter', sans-serif)";
      ctx.fillStyle = "#f0ba26";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(this.company.name, this.x + 12, this.y);
    }
  }
}

export default function InformationSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection observer for fade in
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let dots: Dot[] = [];

    // Initialize dots
    const initDots = () => {
      dots = [];
      // Generate 200 random background dots
      for (let i = 0; i < 200; i++) {
        const rx = Math.random();
        const ry = Math.random();
        // Increased dot sizes for better visibility
        const radius = Math.random() * 2.5 + 1.0;
        const hasRing = Math.random() > 0.85;
        dots.push(new Dot(rx, ry, radius, hasRing));
      }

      // Add company dots strategically placed (or random but spaced out)
      mockCompanies.forEach((company, i) => {
        // Place them vaguely in the center-right as in the video
        const rx = 0.2 + (Math.random() * 0.6); // Slightly wider spread
        const ry = 0.2 + (Math.random() * 0.6);
        dots.push(new Dot(rx, ry, 4.0, true, company)); // Increased company dot radius
      });
    };

    initDots();

    const mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      
      // Update hover state
      let foundHover = false;
      for (let i = dots.length - 1; i >= 0; i--) {
        const dot = dots[i];
        if (!dot.company) continue;
        
        const dx = mouse.x - dot.x;
        const dy = mouse.y - dot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 20) {
          dot.hovered = true;
          canvas.style.cursor = "pointer";
          foundHover = true;
        } else {
          dot.hovered = false;
        }
      }
      
      if (!foundHover) {
        canvas.style.cursor = "default";
      }
    };

    const handleClick = (e: MouseEvent) => {
      for (const dot of dots) {
        if (dot.hovered && dot.company) {
          setSelectedCompany(dot.company);
          break;
        }
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mouseleave", () => {
      mouse.x = -1000;
      mouse.y = -1000;
      dots.forEach(d => d.hovered = false);
    });

    const resize = () => {
      const width = canvas.parentElement?.clientWidth || window.innerWidth;
      const height = window.innerHeight;
      
      // Support high DPI displays
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.scale(dpr, dpr);
      
      // Initial update to place them immediately
      dots.forEach(dot => dot.update(width, height, 0));
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.parentElement?.clientWidth || window.innerWidth;
      const height = window.innerHeight;
      
      dots.forEach(dot => {
        dot.update(width, height, time);
        dot.draw(ctx);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`relative w-full h-screen bg-black overflow-hidden transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      
      {/* Drawer Overlay Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 z-10 transition-opacity duration-500 ${
          selectedCompany ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSelectedCompany(null)}
      />

      {/* Drawer */}
      <div 
        className={`absolute top-0 right-0 h-full w-[440px] max-w-full bg-[#111] border-l border-white/10 z-20 transition-transform duration-500 ease-out flex flex-col ${
          selectedCompany ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-6">
          <button 
            onClick={() => setSelectedCompany(null)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-10 pb-20 scrollbar-hide">
          {selectedCompany && (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Logo / Name Area */}
              <div>
                <h2 className="text-[32px] font-display font-medium text-white mb-4">
                  {selectedCompany.name}
                </h2>
                <p className="text-[24px] font-display text-white leading-tight whitespace-pre-line">
                  {selectedCompany.tagline}
                </p>
              </div>

              {/* Description */}
              <p className="text-[14px] text-muted leading-relaxed font-body">
                {selectedCompany.description}
              </p>

              {/* Details Meta */}
              <div className="flex flex-col gap-6 mt-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-dots tracking-widest text-muted uppercase">
                    Founder(s)
                  </span>
                  <span className="text-[14px] text-white">
                    {selectedCompany.founders}
                  </span>
                </div>
                
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-dots tracking-widest text-muted uppercase">
                    Website
                  </span>
                  <a href={`https://${selectedCompany.website}`} target="_blank" rel="noopener noreferrer" className="text-[14px] text-white hover:text-accent transition-colors">
                    {selectedCompany.website}
                  </a>
                </div>

                {selectedCompany.twitter && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-dots tracking-widest text-muted uppercase">
                      Twitter
                    </span>
                    <a href={`https://twitter.com/${selectedCompany.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-[14px] text-white hover:text-accent transition-colors">
                      {selectedCompany.twitter}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
