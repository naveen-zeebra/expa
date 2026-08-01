"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { featuredCompanies } from "@/data/companies";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CompanyCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  /* Split 10 companies into 2 rows of 5 */
  const row1 = featuredCompanies.slice(0, 5);
  const row2 = featuredCompanies.slice(5, 10);

  useEffect(() => {
    const section = sectionRef.current;
    const row1El = row1Ref.current;
    const row2El = row2Ref.current;
    if (!section || !row1El || !row2El) return;

    const ctx = gsap.context(() => {
      /* Row 1: slides from left → right (starts offset left) */
      gsap.fromTo(
        row1El,
        { x: "-5%" },
        {
          x: "20%",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      /* Row 2: slides from right → left (starts offset right) */
      gsap.fromTo(
        row2El,
        { x: "5%" },
        {
          x: "-25%",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="company-cards-section"
    >
      {/* Row 1 — scrolls left to right */}
      <div ref={row1Ref} className="company-row">
        {row1.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>

      {/* Row 2 — scrolls right to left */}
      <div ref={row2Ref} className="company-row">
        {row2.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>

      <style jsx>{`
        .company-cards-section {
          position: relative;
          padding: 60px 0;
          overflow: hidden;
          background: #000;
        }

        .company-row {
          display: flex;
          gap: 16px;
          padding: 8px 0;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}

/* ── Individual Card ── */
function CompanyCard({
  company,
}: {
  company: (typeof featuredCompanies)[0];
}) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (hovered && videoRef.current) {
      videoRef.current.play().catch(() => { });
    } else if (!hovered && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [hovered]);

  return (
    <div
      className="card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Poster image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={company.posterUrl}
        alt={company.name}
        className="card-media"
        style={{ opacity: hovered ? 0 : 1 }}
        loading="lazy"
      />

      {/* Video (shown on hover) */}
      <video
        ref={videoRef}
        src={company.videoUrl}
        className="card-media"
        style={{ opacity: hovered ? 1 : 0 }}
        loop
        muted
        playsInline
        preload="none"
      />

      {/* Dark gradient overlay */}
      <div className="card-gradient" />

      {/* Company name */}
      <h3 className="card-title" style={{ color: company.titleColor }}>
        {company.name}
      </h3>

      <style jsx>{`
        .card {
          flex-shrink: 0;
          position: relative;
          width: 300px;
          height: 380px;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
        }

        .card:hover .card-media {
          transform: scale(1.05);
        }

        .card-media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.5s ease, transform 0.6s ease;
        }

        .card-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(0, 0, 0, 0) 50%
          );
          pointer-events: none;
        }

        .card-title {
          position: absolute;
          bottom: 24px;
          left: 24px;
          font-family: var(--font-inter), sans-serif;
          font-weight: 500;
          font-size: 22px;
          z-index: 2;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
