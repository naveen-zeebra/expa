"use client";

import { ArrowRight } from "lucide-react";
import { ExpaDotsLogo } from "./ExpaLogo";
import {
  footerCompanies,
  footerAboutLinks,
  footerSocials,
} from "@/data/companies";

export default function Footer() {
  return (
    <footer className="relative bg-black text-white font-dots uppercase z-10 footer-gradient">
      <div className="px-8 py-6 max-md:px-3 max-md:py-6">
        <div className="flex flex-wrap justify-between max-md:flex-col">
          {/* Expa Logo */}
          <a
            href="/"
            className="block pb-6 pt-2 group"
          >
            <span className="sr-only">Expa</span>
            <ExpaDotsLogo className="h-[17px] w-[80px] transition-colors duration-500 group-hover:text-accent" />
          </a>

          {/* Sections */}
          <div className="max-w-[1288px] w-full">
            {/* Companies Section */}
            <div className="flex justify-between flex-wrap">
              {/* Section title */}
              <div className="dotted-border-top flex items-center h-10 w-[calc(100%-848px-32px)] max-md:w-full max-md:opacity-50">
                <span className="text-[12px] tracking-[0.05em]">
                  Companies
                </span>
              </div>

              {/* Companies grid */}
              <div className="dotted-border-bottom flex flex-col flex-wrap h-[320px] justify-between w-[848px] max-md:h-auto max-md:w-full max-md:flex-nowrap">
                {footerCompanies.map((company) => (
                  <div
                    key={company.name}
                    className="dotted-border-top w-[calc(50%-16px)] max-md:w-full"
                  >
                    <a
                      href={company.href}
                      className="flex items-center h-10 max-md:h-8"
                    >
                      <span className="text-[12px] tracking-[0.05em] transition-colors duration-500 hover:text-accent">
                        {company.name}
                      </span>
                    </a>
                  </div>
                ))}
              </div>

              {/* View all companies button */}
              <div className="w-[848px] ml-auto mt-8 max-md:w-full max-md:mt-8">
                <a
                  href="/portfolio/"
                  className="flex items-center justify-between h-14 px-5 bg-surface rounded-2xl w-full transition-colors duration-500 hover:bg-surface-hover normal-case"
                >
                  <span className="text-[16px] font-body normal-case">
                    View all companies
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* About Section */}
            <div className="flex justify-between flex-wrap mt-16 max-md:flex-col max-md:mt-10">
              <div className="dotted-border-top flex items-center h-10 w-[calc(100%-848px-32px)] max-md:w-full max-md:opacity-50">
                <span className="text-[12px] tracking-[0.05em]">About</span>
              </div>
              <div className="dotted-border-bottom flex flex-col flex-wrap h-[192px] justify-between w-[848px] max-md:h-auto max-md:w-full max-md:flex-nowrap">
                {footerAboutLinks.map((link) => (
                  <div
                    key={link.name}
                    className="dotted-border-top w-[calc(50%-16px)] max-md:w-full"
                  >
                    <a
                      href={link.href}
                      className="flex items-center h-10 max-md:h-8"
                    >
                      <span className="text-[12px] tracking-[0.05em] transition-colors duration-500 hover:text-accent">
                        {link.name}
                      </span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Connect Section */}
            <div className="flex justify-between flex-wrap mt-16 max-md:flex-col max-md:mt-10">
              <div className="dotted-border-top flex items-center h-10 w-[calc(100%-848px-32px)] max-md:w-full max-md:opacity-50">
                <span className="text-[12px] tracking-[0.05em]">Connect</span>
              </div>
              <div className="flex gap-3 w-[848px] max-md:w-full max-md:flex-col max-md:gap-3">
                {footerSocials.map((social) => (
                  <a
                    key={social.text}
                    href={social.href}
                    className="flex-1 bg-surface rounded-2xl flex flex-col justify-between h-[168px] p-5 transition-colors duration-500 hover:bg-surface-hover normal-case max-md:flex-row max-md:items-center max-md:h-14 max-md:px-5 max-md:gap-4 max-md:rounded-xl"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={social.iconUrl}
                      alt=""
                      className="w-5 h-5 object-contain"
                      loading="lazy"
                    />
                    <span className="text-[16px] font-body normal-case leading-snug whitespace-pre-line">
                      {social.text}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="flex justify-between flex-wrap mt-16 max-md:flex-col max-md:mt-10">
              <div className="dotted-border-top flex items-center h-10 w-[calc(100%-848px-32px)] max-md:hidden">
                <span className="text-[12px] tracking-[0.05em]">
                  Newsletter
                </span>
              </div>
              <div className="w-[848px] max-md:w-full">
                <div className="dotted-border-top flex items-center h-10 max-md:opacity-50">
                  <span className="text-[12px] tracking-[0.05em]">
                    Subscribe to our newsletter
                  </span>
                </div>
                <div className="mt-2 relative max-md:mt-0">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full h-14 bg-surface rounded-xl px-5 text-[16px] font-body normal-case outline-none focus:ring-1 focus:ring-accent/30 max-md:rounded-xl"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center transition-opacity duration-500 hover:opacity-50"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Legal Section */}
            <div className="flex justify-between flex-wrap mt-16 max-md:flex-col max-md:mt-10">
              <div className="dotted-border-top flex items-center h-10 w-[calc(100%-848px-32px)] max-md:w-full max-md:opacity-50">
                <span className="text-[12px] tracking-[0.05em]">Legal</span>
              </div>
              <div className="dotted-border-bottom flex flex-col flex-wrap h-[64px] justify-between w-[848px] max-md:h-auto max-md:w-full max-md:flex-nowrap">
                <div className="dotted-border-top w-[calc(50%-16px)] max-md:w-full">
                  <a
                    href="/privacy/"
                    className="flex items-center h-10 max-md:h-8"
                  >
                    <span className="text-[12px] tracking-[0.05em] transition-colors duration-500 hover:text-accent">
                      Privacy Policy
                    </span>
                  </a>
                </div>
                <div className="dotted-border-top w-[calc(50%-16px)] max-md:w-full">
                  <a
                    href="/terms/"
                    className="flex items-center h-10 max-md:h-8"
                  >
                    <span className="text-[12px] tracking-[0.05em] transition-colors duration-500 hover:text-accent">
                      Terms of Use
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-10 text-[12px] tracking-[0.05em] opacity-50 font-dots">
          ©2026 Expa. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
