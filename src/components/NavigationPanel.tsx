"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import {
  navCompanyItems,
  navAboutItems,
  type NavCompanyItem,
  type NavAboutItem,
} from "@/data/companies";

interface NavigationPanelProps {
  isOpen: boolean;
  activeTab: "companies" | "about";
  onTabChange: (tab: "companies" | "about") => void;
  onClose: () => void;
}

export default function NavigationPanel({
  isOpen,
  activeTab,
  onTabChange,
  onClose,
}: NavigationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-[370px] max-md:w-full z-40 flex flex-col transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Panel header: tab switcher + close button */}
          <div
            className="flex items-center gap-4 p-4 pt-4"
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.4s ease 0.175s, transform 0.4s ease 0.175s",
            }}
          >
            {/* Tab toggle pill */}
            <div className="relative flex-1 bg-surface rounded-full overflow-hidden">
              {/* Sliding highlight */}
              <div
                className="absolute top-0 left-0 h-full w-1/2 rounded-full bg-surface-hover transition-transform duration-500 ease-out"
                style={{
                  transform:
                    activeTab === "about"
                      ? "translateX(100%)"
                      : "translateX(0)",
                }}
              />
              <div className="flex relative z-[1]">
                <button
                  onClick={() => onTabChange("companies")}
                  className={`flex items-center justify-center h-12 w-1/2 text-[14px] font-display transition-colors duration-700 ${
                    activeTab === "companies" ? "text-warm" : "text-muted"
                  }`}
                >
                  Companies
                </button>
                <button
                  onClick={() => onTabChange("about")}
                  className={`flex items-center justify-center h-12 w-1/2 text-[14px] font-display transition-colors duration-700 ${
                    activeTab === "about" ? "text-warm" : "text-muted"
                  }`}
                >
                  About
                </button>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="flex items-center justify-center w-12 h-12 bg-surface rounded-[1.5rem] transition-colors duration-500 hover:bg-surface-hover max-md:flex"
            >
              <X className="w-[15px] h-[15px]" />
            </button>
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-auto relative">
            {/* Fade gradients */}
            <div className="sticky top-0 left-0 w-full h-4 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />

            <div className="flex flex-col gap-2 px-4 pb-4">
              {activeTab === "companies" ? (
                <>
                  {navCompanyItems.map((item, i) => (
                    <CompanyNavItem
                      key={item.title}
                      item={item}
                      index={i}
                      isOpen={isOpen}
                    />
                  ))}
                  {/* "Explore all companies" link */}
                  <a
                    href="/portfolio/"
                    className="flex items-center justify-between h-[94px] px-5 bg-surface rounded-2xl text-warm transition-colors duration-300 hover:bg-surface-hover"
                    style={{
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? "translateY(0)" : "translateY(30px)",
                      transition: `opacity 0.4s ease ${0.2 + 10 * 0.05}s, transform 0.4s ease ${0.2 + 10 * 0.05}s`,
                    }}
                  >
                    <div className="flex flex-col">
                      <strong className="text-[16px] font-display">
                        Companies
                      </strong>
                      <p className="text-[14px] text-muted mt-1">
                        Explore all companies.
                      </p>
                    </div>
                    <div className="w-16 h-16 flex items-center justify-center">
                      <svg
                        viewBox="0 0 64 65"
                        className="w-full h-full text-muted"
                        fill="currentColor"
                      >
                        <rect
                          x="8"
                          y="8"
                          width="20"
                          height="20"
                          rx="4"
                          opacity="0.6"
                        />
                        <rect
                          x="36"
                          y="8"
                          width="20"
                          height="20"
                          rx="4"
                          opacity="0.4"
                        />
                        <rect
                          x="8"
                          y="36"
                          width="20"
                          height="20"
                          rx="4"
                          opacity="0.4"
                        />
                        <rect
                          x="36"
                          y="36"
                          width="20"
                          height="20"
                          rx="4"
                          opacity="0.2"
                        />
                      </svg>
                    </div>
                  </a>
                </>
              ) : (
                navAboutItems.map((item, i) => (
                  <AboutNavItem
                    key={item.title}
                    item={item}
                    index={i}
                    isOpen={isOpen}
                  />
                ))
              )}
            </div>

            {/* Bottom fade gradient */}
            <div className="sticky bottom-0 left-0 w-full h-4 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
          </div>
        </div>
      </div>
    </>
  );
}

function CompanyNavItem({
  item,
  index,
  isOpen,
}: {
  item: NavCompanyItem;
  index: number;
  isOpen: boolean;
}) {
  return (
    <a
      href={item.href}
      className="flex items-center justify-between h-[94px] px-5 bg-surface rounded-2xl text-warm transition-colors duration-300 hover:bg-surface-hover"
      style={{
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.4s ease ${0.2 + index * 0.05}s, transform 0.4s ease ${0.2 + index * 0.05}s`,
      }}
    >
      <div className="flex flex-col">
        <strong className="text-[16px] font-display">{item.title}</strong>
        <p className="text-[14px] text-muted mt-1 max-w-[209px] text-balance">
          {item.description}
        </p>
      </div>
      <div className="w-16 h-16 flex items-center justify-center relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.iconUrl}
          alt=""
          className="w-10 h-10 object-contain"
          loading="lazy"
        />
      </div>
    </a>
  );
}

function AboutNavItem({
  item,
  index,
  isOpen,
}: {
  item: NavAboutItem;
  index: number;
  isOpen: boolean;
}) {
  return (
    <a
      href={item.href}
      className="flex items-center justify-between h-[94px] px-5 bg-surface rounded-2xl text-warm transition-colors duration-300 hover:bg-surface-hover"
      style={{
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.4s ease ${0.2 + index * 0.05}s, transform 0.4s ease ${0.2 + index * 0.05}s`,
      }}
    >
      <div className="flex flex-col">
        <strong className="text-[16px] font-display">{item.title}</strong>
        <p className="text-[14px] text-muted mt-1">{item.description}</p>
      </div>
      <div className="w-16 h-16 flex items-center justify-center">
        <svg
          viewBox="0 0 64 65"
          className="w-full h-full text-muted"
          fill="currentColor"
        >
          <circle cx="32" cy="32" r="24" opacity="0.3" />
          <circle cx="32" cy="32" r="12" opacity="0.5" />
        </svg>
      </div>
    </a>
  );
}
