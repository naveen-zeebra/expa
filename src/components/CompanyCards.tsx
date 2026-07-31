"use client";

import { useRef, useState, useEffect } from "react";
import { featuredCompanies } from "@/data/companies";

export default function CompanyCards() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative pb-8">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-4 pb-8 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {featuredCompanies.map((company, index) => (
          <CompanyCard
            key={company.id}
            company={company}
            index={index}
            visible={isVisible}
          />
        ))}
      </div>
    </section>
  );
}

function CompanyCard({
  company,
  index,
  visible,
}: {
  company: (typeof featuredCompanies)[0];
  index: number;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (hovered && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [hovered]);

  // Determine card dimensions
  const isWide = company.aspectRatio > 1;
  const cardWidth = isWide ? "min(600px, 80vw)" : "min(340px, 80vw)";
  const cardHeight = isWide ? "min(360px, 48vw)" : "min(425px, 106vw)";

  return (
    <div
      className="flex-shrink-0 snap-start relative rounded-[20px] overflow-hidden cursor-pointer group"
      style={{
        width: cardWidth,
        height: cardHeight,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Poster image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={company.posterUrl}
        alt={company.name}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: hovered ? 0 : 1 }}
        onLoad={() => setImgLoaded(true)}
        loading="lazy"
      />

      {/* Video (shown on hover) */}
      <video
        ref={videoRef}
        src={company.videoUrl}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: hovered ? 1 : 0 }}
        loop
        muted
        playsInline
        preload="none"
      />

      {/* Dark gradient overlay at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Company name */}
      <h3
        className="absolute bottom-6 left-6 font-display font-medium text-[24px] z-10"
        style={{ color: company.titleColor }}
      >
        {company.name}
      </h3>
    </div>
  );
}
