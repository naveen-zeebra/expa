"use client";

import { useState } from "react";
import IntroCanvas from "@/components/IntroCanvas";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CompanyCards from "@/components/CompanyCards";
import InformationSection from "@/components/InformationSection";
import NavigationPanel from "@/components/NavigationPanel";
import Footer from "@/components/Footer";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"companies" | "about">(
    "companies"
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const handleTabChange = (tab: "companies" | "about") => {
    setActiveTab(tab);
    if (!menuOpen) {
      setMenuOpen(true);
    }
  };

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* Intro Animation */}
      <IntroCanvas />

      {/* Fixed Header */}
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onMenuToggle={handleMenuToggle}
        menuOpen={menuOpen}
      />

      {/* Navigation Panel */}
      <NavigationPanel
        isOpen={menuOpen}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onClose={() => setMenuOpen(false)}
      />

      {/* Main Content */}
      <main>
        {/* Hero */}
        <Hero />

        {/* Company Cards */}
        <CompanyCards />

        {/* information section */}
        <InformationSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
