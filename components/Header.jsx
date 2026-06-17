"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 md:py-8 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" onClick={() => setMenuOpen(false)}>
          <img
            src="/ninefold-logo.svg"
            alt="Ninefold"
            width="120"
            height="17"
            style={{ height: '17px', width: 'auto' }}
          />
        </Link>

        {/* Hamburger Menu Button */}
        <label className="hamburger cursor-pointer z-50 relative">
          <input
            type="checkbox"
            checked={menuOpen}
            onChange={toggleMenu}
            className="hidden"
          />
          <svg
            viewBox="0 0 32 32"
            className="h-10 md:h-12 transition-transform duration-[600ms] cubic-bezier-[0.4,0,0.2,1]"
          >
            <path
              className="line line-top-bottom fill-none stroke-white stroke-[3] rounded-full transition-all duration-[600ms] cubic-bezier-[0.4,0,0.2,1]"
              style={{
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeDasharray: menuOpen ? "20 300" : "12 63",
                strokeDashoffset: menuOpen ? "-32.42" : "0",
              }}
              d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
            />
            <path
              className="line fill-none stroke-white stroke-[3] rounded-full transition-all duration-[600ms] cubic-bezier-[0.4,0,0.2,1]"
              style={{
                strokeLinecap: "round",
                strokeLinejoin: "round",
              }}
              d="M7 16 27 16"
            />
          </svg>
        </label>
      </header>

      {/* Full Screen Menu */}
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <style jsx>{`
        .hamburger input:checked + svg {
          transform: rotate(-45deg);
        }
      `}</style>
    </>
  );
}
