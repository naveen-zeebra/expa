import React from "react";

/** Expa "X" logomark — extracted from the production SVG */
export function ExpaLogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M9 0C4.032 0 0 4.032 0 9s4.032 9 9 9 9-4.032 9-9-4.032-9-9-9zm3.528 12.528L9 9.99l-3.528 2.538L6.66 8.82 3.42 6.012h3.852L9 2.34l1.728 3.672h3.852L11.34 8.82l1.188 3.708z" />
    </svg>
  );
}

/** Expa "dots" wordmark — 5 dot letters spelling EXPA */
export function ExpaDotsLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 17"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      {/* E */}
      <circle cx="2" cy="2" r="1.5" />
      <circle cx="7" cy="2" r="1.5" />
      <circle cx="12" cy="2" r="1.5" />
      <circle cx="2" cy="8.5" r="1.5" />
      <circle cx="7" cy="8.5" r="1.5" />
      <circle cx="2" cy="15" r="1.5" />
      <circle cx="7" cy="15" r="1.5" />
      <circle cx="12" cy="15" r="1.5" />
      {/* X */}
      <circle cx="22" cy="2" r="1.5" />
      <circle cx="32" cy="2" r="1.5" />
      <circle cx="27" cy="8.5" r="1.5" />
      <circle cx="22" cy="15" r="1.5" />
      <circle cx="32" cy="15" r="1.5" />
      {/* P */}
      <circle cx="42" cy="2" r="1.5" />
      <circle cx="47" cy="2" r="1.5" />
      <circle cx="52" cy="2" r="1.5" />
      <circle cx="42" cy="8.5" r="1.5" />
      <circle cx="47" cy="8.5" r="1.5" />
      <circle cx="52" cy="8.5" r="1.5" />
      <circle cx="42" cy="15" r="1.5" />
      {/* A */}
      <circle cx="62" cy="2" r="1.5" />
      <circle cx="67" cy="2" r="1.5" />
      <circle cx="72" cy="2" r="1.5" />
      <circle cx="62" cy="8.5" r="1.5" />
      <circle cx="67" cy="8.5" r="1.5" />
      <circle cx="72" cy="8.5" r="1.5" />
      <circle cx="62" cy="15" r="1.5" />
      <circle cx="72" cy="15" r="1.5" />
    </svg>
  );
}
