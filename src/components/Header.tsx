"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ExpaLogoMark } from "./ExpaLogo";

interface HeaderProps {
  activeTab: "companies" | "about";
  onTabChange: (tab: "companies" | "about") => void;
  onMenuToggle: () => void;
  menuOpen: boolean;
}

export default function Header({
  activeTab,
  onTabChange,
  onMenuToggle,
  menuOpen,
}: HeaderProps) {
  return (
    <nav className="fixed top-0 left-0 w-full z-40 flex items-center justify-between p-[calc(0.8rem+5px)] pointer-events-none">
      {/* Left: Logo */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <Link
          href="/"
          className="flex items-center justify-center w-12 h-12 bg-surface rounded-[1.5rem] transition-colors duration-500 hover:bg-surface-hover"
          aria-label="Expa Home"
        >
          <ExpaLogoMark className="w-[17px] h-[17px]" />
        </Link>
      </div>

      {/* Center: Pill Nav */}
      <div className="relative bg-surface rounded-full pointer-events-auto transition-colors duration-500 hover:bg-surface-hover">
        {/* Sliding indicator */}
        <div
          className="absolute top-0 left-0 h-full w-1/2 rounded-full transition-transform duration-500 ease-out"
          style={{
            background: "rgba(255,255,255,0.08)",
            transform:
              activeTab === "about" ? "translateX(100%)" : "translateX(0)",
          }}
        />
        <div className="flex relative">
          <button
            // onClick={() => onTabChange("companies")}
            className={`flex items-center justify-center h-12 w-[140px] text-[14px] font-display font-normal transition-colors duration-700 relative z-[1] ${activeTab === "companies" ? "text-warm" : "text-muted"
              }`}
          >
            Companies
          </button>
          <button
            // onClick={() => onTabChange("about")}
            className={`flex items-center justify-center h-12 w-[140px] text-[14px] font-display font-normal transition-colors duration-700 relative z-[1] ${activeTab === "about" ? "text-warm" : "text-muted"
              }`}
          >
            About
          </button>
        </div>
      </div>

      {/* Right: Menu button */}
      <button
        // onClick={onMenuToggle}
        className="flex items-center justify-center w-12 h-12 bg-surface rounded-[1.5rem] pointer-events-auto transition-colors duration-500 hover:bg-surface-hover"
        aria-label="Toggle Menu"
      >
        {menuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>
    </nav>
  );
}
