"use client";

import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const MainNavbar = ({ className }: { className?: string }) => {
  const [scrolled, setScrolled] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Rationale", href: "#why-rwa" },
    { name: "Services", href: "#services" },
    { name: "Ecosystem", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks
        .map((link) => {
          const id = link.href.substring(1);
          const element = document.getElementById(id);
          if (element) {
            return {
              id: link.href,
              top: element.offsetTop - 150,
              bottom: element.offsetTop + element.offsetHeight - 150,
            };
          }
          return null;
        })
        .filter(Boolean);

      const scrollPosition = window.scrollY;

      const current = sections.find(
        (section) =>
          section &&
          scrollPosition >= section.top &&
          scrollPosition < section.bottom
      );

      if (current) {
        setActiveSection(current.id);
      } else if (window.scrollY < 100) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur shadow-sm"
          : "bg-white/50 backdrop-blur-sm"
      } border-b border-slate-100`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/">
            <Image src="/logo.jpg" width={80} height={40} alt="logo" />
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-sky-700 bg-sky-50 shadow-sm ring-1 ring-sky-100"
                      : "text-slate-600 hover:text-sky-600 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            {/* <LocaleSwitcher /> */}
            <Link href="/marketplace">
              <Button
                variant="ghost"
                className="hidden md:flex gap-2 text-slate-700 hover:text-cyan-600 hover:bg-cyan-50 font-bold transition-all"
              >
                <Zap className="w-4 h-4" />
                Launch App
              </Button>
            </Link>
            <div className="ml-4">
              <a
                href="#contact"
                className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-full font-semibold transition-all shadow-lg shadow-sky-200 hover:shadow-sky-300 transform hover:-translate-y-0.5 active:scale-95"
              >
                Partner With Us
              </a>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-sky-600 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-100 absolute w-full shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? "text-sky-700 bg-sky-50"
                      : "text-slate-600 hover:text-sky-600 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center mt-4 px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-lg font-bold shadow-md"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNavbar;
