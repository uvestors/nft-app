"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Globe,
  Shield,
  Activity,
  TrendingUp,
  Users,
  BookOpen,
  ArrowRight,
  Mail,
  MapPin,
  GraduationCap,
  Scale,
  Factory,
  Cpu,
  Landmark,
  Briefcase,
  Handshake,
} from "lucide-react";
import LocaleSwitcher from "@/components/localeSwitcher";
import Image from "next/image";

// --- Navbar Component (Internal Implementation) ---
const Navbar = ({ className }: { className?: string }) => {
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${className} border-b border-slate-100`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Image src="/logo.jpg" width={80} height={40} alt="logo" />

          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-sky-700 bg-sky-50 shadow-sm ring-1 ring-sky-100"
                      : "text-slate-600 hover:text-sky-600 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
            <LocaleSwitcher />
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
                <a
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
                </a>
              );
            })}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center mt-4 px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-lg font-bold shadow-md"
            >
              Partner With Us
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

// --- Particle Background Component ---
const ParticleNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 3 + 1;

        const colors = [
          "rgba(14, 165, 233, ", // Sky Blue
          "rgba(236, 72, 153, ", // Pink
          "rgba(99, 102, 241, ", // Indigo
          "rgba(203, 213, 225, ", // Slate (Base)
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + "0.4)";
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      const numberOfParticles = Math.min(window.innerWidth / 20, 60);
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(203, 213, 225, ${0.2 - distance / 1200})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", () => {
      resizeCanvas();
      init();
    });

    resizeCanvas();
    init();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
};

// --- Main App Component ---
export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const text = {
    hero: {
      instituteName: "Real Value Institute",
      // Updated Title 1: Moved "Asset" to the first line
      title1: "Advancing Real-World Asset",
      // Updated Title 2: "Tokenisation" starts the second line
      title2: "Tokenisation & Global Standards",
      // Updated Subtitle: Used JSX to force a line break on mobile only
      subtitle: (
        <>
          A neutral, non-profit institute <br className="block sm:hidden" />{" "}
          dedicated to shaping the future of RWA.
        </>
      ),
      desc1: "Building Trust, Standards & Collaboration for Real-World Assets",
      desc2: "Research • Standards • Ecosystem",
      btnLearn: "Our Mission",
      btnPartner: "Partner With Us",
    },
    mission: {
      title: "Our Mission",
      desc: "To build a trusted, compliant, and efficient bridge for the global real-world asset economy.",
      servesTitle: "We serve the industry by:",
      list: [
        "Advancing regulatory frameworks for RWA",
        "Developing technical and compliance standards",
        "Facilitating cross-border pilot programs",
        "Educating market participants and regulators",
      ],
      values: [
        { title: "Trust", desc: "Building the foundation of digital finance" },
        { title: "Clarity", desc: "Providing clear standards and research" },
        { title: "Impact", desc: "Unlocking real economic value" },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-sky-100 selection:text-sky-900">
      <Navbar
        className={
          scrolled
            ? "bg-white/95 backdrop-blur shadow-sm"
            : "bg-white/50 backdrop-blur-sm"
        }
      />

      {/* SECTION 01: HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-200/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-200/20 rounded-full blur-[100px] pointer-events-none"></div>

        <ParticleNetwork />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-sky-200 bg-sky-50 backdrop-blur-sm">
            <span className="text-sky-600 text-xs md:text-sm font-bold tracking-wider uppercase">
              {text.hero.instituteName}
            </span>
          </div>
          {/* UPDATED H1 Styles:
            - text-3xl (mobile) -> text-5xl (tablet) -> text-7xl (desktop)
            - This prevents the word breaking on mobile.
          */}
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight text-slate-900">
            {text.hero.title1}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-600 to-pink-500">
              {text.hero.title2}
            </span>
          </h1>
          <h2 className="text-base md:text-2xl font-medium text-slate-600 mb-4 tracking-wide">
            {text.hero.subtitle}
          </h2>
          <p className="text-xs md:text-base text-slate-500 mb-8 font-light max-w-2xl mx-auto leading-relaxed px-4">
            {text.hero.desc1}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#about"
              className="px-8 py-4 bg-gradient-to-r from-sky-400 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-sky-200 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              {text.hero.btnLearn} <ArrowRight size={18} />
            </a>
            <a
              href="#contact"
              className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 transition-all"
            >
              {text.hero.btnPartner}
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-slate-400 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* SECTION 02: ABOUT */}
      <section
        id="about"
        className="py-24 bg-white relative border-t border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                About RVI
              </h2>
              <h3 className="text-xl text-sky-600 font-medium mb-6">
                A Non-Profit Institute Dedicated to RWA Research & Ecosystem
                Development
              </h3>
              <div className="h-1.5 w-20 bg-gradient-to-r from-sky-400 to-pink-400 mb-8 rounded-full"></div>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                RVI is an Australia-based non-profit organisation focused on
                advancing the future of digital finance through rigorous
                research and global collaboration.
              </p>

              <div className="mt-8 p-6 bg-slate-50 border-l-4 border-sky-500 rounded-r-xl">
                <p className="text-slate-700 italic font-medium text-lg">
                  "We believe:{" "}
                  <span className="text-slate-900 font-bold">
                    Real value should be seen, trusted, and accessible globally.
                  </span>
                  "
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-sky-200 to-pink-200 rounded-2xl opacity-40 blur-xl transform translate-y-4"></div>
              <div className="relative bg-white p-8 rounded-2xl border border-slate-100 shadow-xl">
                <div className="grid grid-cols-1 gap-6">
                  {[
                    {
                      icon: BookOpen,
                      title: "Research",
                      desc: "Advancing research on Real-World Assets (RWA).",
                      color: "text-blue-600",
                      bg: "bg-blue-50",
                    },
                    {
                      icon: Globe,
                      title: "Standards",
                      desc: "Building cross-border industry standards.",
                      color: "text-pink-600",
                      bg: "bg-pink-50",
                    },
                    {
                      icon: Users,
                      title: "Ecosystem",
                      desc: "Coordinating an ecosystem of institutions and regulators.",
                      color: "text-sky-600",
                      bg: "bg-sky-50",
                    },
                    {
                      icon: Shield,
                      title: "Compliance",
                      desc: "Supporting compliant, transparent asset tokenization.",
                      color: "text-emerald-600",
                      bg: "bg-emerald-50",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 hover:bg-slate-50 p-2 rounded-lg transition-colors"
                    >
                      <div
                        className={`p-3 ${item.bg} ${item.color} rounded-lg mt-1 shadow-sm`}
                      >
                        <item.icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTIONS 03-05: THE WHY TRILOGY */}
      <section
        id="why-rwa"
        className="py-24 bg-slate-50 border-y border-slate-200 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
              The Strategic Rationale
            </h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-lg">
              Unlocking global value by connecting Australia's premium assets
              with Asia's dynamic capital through a trusted RWA framework.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {[
              {
                id: "rwa",
                icon: Shield,
                title: "Why RWA?",
                subtitle:
                  "The world is entering the era of “value-backed digital finance.”",
                bullets: [
                  "Global accessibility for high-quality assets",
                  "Transparent, auditable investment models",
                  "Cross-border capital efficiency",
                  "Lower risk and higher trust",
                ],
                footer:
                  "RWA is not a technology revolution — it is a trust revolution.",
                theme: "sky",
                accent: "text-sky-600",
                bg: "bg-sky-50",
              },
              {
                id: "aus",
                icon: MapPin,
                title: "Why Australia?",
                subtitle:
                  "Australia offers one of the world’s strongest environments for regulated RWA.",
                bullets: [
                  "Renewable energy (solar, wind)",
                  "Natural gas & Minerals",
                  "Grid & infrastructure",
                  "Real estate & Agriculture",
                ],
                footer:
                  "Stable, transparent, auditable, well-regulated — ideal for tokenisation.",
                theme: "pink",
                accent: "text-pink-600",
                bg: "bg-pink-50",
              },
              {
                id: "asia",
                icon: TrendingUp,
                title: "Why Asia?",
                subtitle:
                  "Asia is the fastest-growing capital region globally.",
                bullets: [
                  "Large scale, fast moving capital",
                  "Demand-driven markets",
                  "Hong Kong & Singapore RWA hubs",
                  "Global financial gateways",
                ],
                footer:
                  "Australia supplies assets. Asia supplies capital. RVI builds the bridge.",
                theme: "indigo",
                accent: "text-indigo-600",
                bg: "bg-indigo-50",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="flex flex-col h-full bg-white p-8 rounded-2xl border border-slate-200 hover:border-sky-300 transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group"
              >
                <div
                  className={`absolute top-0 right-0 w-32 h-32 ${card.bg} rounded-full blur-3xl -mr-10 -mt-10 transition-opacity opacity-60 group-hover:opacity-100`}
                ></div>

                <div
                  className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center mb-6 ${card.accent} flex-shrink-0 shadow-sm`}
                >
                  <card.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">
                  {card.title}
                </h3>
                <p className={`${card.accent} text-sm font-medium mb-6 italic`}>
                  {card.subtitle}
                </p>

                <div className="flex-grow space-y-4 mb-8">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Key Factors:
                  </p>
                  <ul className="space-y-3">
                    {card.bullets.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-slate-600 text-sm"
                      >
                        <span
                          className={`w-1.5 h-1.5 ${card.bg
                            .replace("bg-", "bg-")
                            .replace(
                              "50",
                              "400"
                            )} rounded-full mr-3 mt-1.5 flex-shrink-0`}
                        ></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100">
                  <p className="text-slate-700 font-medium text-sm">
                    {card.footer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 06: MISSION */}
      <section id="mission" className="py-20 relative overflow-hidden bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-sm font-bold tracking-widest text-sky-600 uppercase mb-4">
            {text.mission.title}
          </h2>
          <p className="text-3xl md:text-5xl font-bold leading-tight mb-12 text-slate-900">
            {text.mission.desc}
          </p>

          <div className="bg-white border border-slate-100 rounded-2xl p-8 md:p-12 shadow-2xl shadow-slate-100">
            <h3 className="text-xl font-semibold text-slate-800 mb-8">
              {text.mission.servesTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-left max-w-2xl mx-auto mb-10">
              {text.mission.list.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="mt-1 mr-3 flex-shrink-0 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-pink-500 font-bold">
                    ✓
                  </div>
                  <span className="text-slate-600 text-lg font-light">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* VALUES SUB-SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
              {text.mission.values.map((value, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-xl hover:bg-sky-50 transition-colors cursor-default group"
                >
                  <div className="text-sky-600 font-bold text-xl mb-1 group-hover:scale-105 transition-transform">
                    {value.title}
                  </div>
                  <div className="text-slate-500 text-sm">{value.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 07: WHAT WE DO */}
      <section
        id="services"
        className="py-24 bg-slate-50 relative overflow-hidden"
      >
        <div className="absolute left-0 top-1/4 w-64 h-64 bg-sky-100/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              What We Do
            </h2>
            <p className="mt-4 text-slate-500">
              Comprehensive services for the digital asset economy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                id: "01",
                title: "RWA Research & Standards",
                items: [
                  "Cross-border regulatory research",
                  "RWA classification frameworks",
                  "Standardisation of asset authenticity",
                  "White papers & policy discussions",
                ],
              },
              {
                id: "02",
                title: "Ecosystem Collaboration",
                items: [
                  "Partner with institutions across the value chain",
                  "Create the RWFF alliance",
                  "Connect regulated service providers & asset owners",
                ],
              },
              {
                id: "03",
                title: "Australia ↔ Asia Bridge",
                items: [
                  "Help Asian institutions understand Australian assets",
                  "Help Australian industry understand RWA compliance",
                  "Facilitate compliant issuance pilots",
                ],
              },
              {
                id: "04",
                title: "Education & Knowledge Hub",
                items: [
                  "Courses, workshops, industry panels",
                  "University collaboration",
                  "Research publications",
                ],
              },
            ].map((block, idx) => (
              <div
                key={idx}
                className="relative p-8 bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-300 group overflow-hidden hover:-translate-y-2 flex flex-col items-center text-center"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-400 to-blue-600"></div>

                <div className="absolute -right-6 -top-8 text-9xl font-serif font-bold text-slate-50 group-hover:text-sky-50 transition-colors leading-none select-none z-0">
                  {block.id}
                </div>

                <div className="relative z-10 pt-4 w-full">
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors mb-4">
                    {block.title}
                  </h3>

                  <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6 group-hover:bg-sky-400 transition-all duration-500 group-hover:w-20"></div>

                  <ul className="space-y-3">
                    {block.items.map((item, i) => (
                      <li
                        key={i}
                        className="text-slate-600 text-base group-hover:text-slate-800 transition-colors"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMBINED SECTION: GLOBAL ECOSYSTEM */}
      <section
        id="contact"
        className="py-24 bg-white relative border-t border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              Global Ecosystem & Partnerships
            </h2>
            <p className="text-slate-500 text-lg">
              Connecting the leaders of the real-world asset revolution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {[
              {
                icon: GraduationCap,
                title: "Academic & Research",
                text: "Universities & research bodies",
                color: "text-blue-500",
                bg: "bg-blue-50",
              },
              {
                icon: Scale,
                title: "Legal & Regulatory",
                text: "Legal & regulatory experts",
                color: "text-red-500",
                bg: "bg-red-50",
              },
              {
                icon: Factory,
                title: "Asset Owners",
                text: "Energy, infrastructure, agriculture",
                color: "text-amber-500",
                bg: "bg-amber-50",
              },
              {
                icon: Cpu,
                title: "Technology Partners",
                text: "Web3 & tokenisation tech",
                color: "text-purple-500",
                bg: "bg-purple-50",
              },
              {
                icon: Landmark,
                title: "Capital Partners",
                text: "Family offices & institutions",
                color: "text-emerald-500",
                bg: "bg-emerald-50",
              },
              {
                icon: Globe,
                title: "RWA Hubs",
                text: "Hong Kong / Singapore Hubs",
                color: "text-sky-500",
                bg: "bg-sky-50",
              },
            ].map((item, index) => (
              <div key={index} className="group relative">
                <div className="relative bg-white p-8 rounded-xl border border-slate-200 hover:border-sky-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col items-center text-center h-full">
                  <div
                    className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center ${item.color} mb-6 border border-slate-50 shadow-sm group-hover:scale-110 transition-transform duration-300`}
                  >
                    <item.icon size={32} />
                  </div>
                  <h4 className="text-slate-900 font-bold text-lg mb-2">
                    {item.title}
                  </h4>
                  <p className="text-slate-500 text-sm">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* PART 3: JOIN THE ECOSYSTEM */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
            <div>
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                  Who Should Join?
                </h3>
                <div className="h-1.5 w-20 bg-gradient-to-r from-sky-400 to-blue-500 mb-6 rounded-full"></div>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Whether you are building the future of finance or managing
                  world-class assets, RVI invites you to shape the future of
                  real-world asset tokenisation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Factory, text: "Asset Owner" },
                  { icon: Scale, text: "Regulator" },
                  { icon: Briefcase, text: "Lawyer or Auditor" },
                  { icon: Cpu, text: "Web3 Builder" },
                  { icon: TrendingUp, text: "Investor" },
                  { icon: GraduationCap, text: "University / Research" },
                  { icon: Landmark, text: "Financial Institution" },
                ].map((role, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-sky-300 transition-colors group"
                  >
                    <role.icon
                      className="text-sky-500 mr-3 group-hover:scale-110 transition-transform"
                      size={20}
                    />
                    <span className="text-slate-700 font-medium">
                      {role.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-2xl h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  Start the Conversation
                </h3>
                <p className="text-slate-500 mb-8">
                  Join our network of industry leaders and pioneers.
                </p>

                <form
                  className="space-y-4"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                      Organization Type
                    </label>
                    <div className="relative">
                      <select className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all appearance-none cursor-pointer">
                        <option>Select your role...</option>
                        <option>Asset Owner</option>
                        <option>Financial Institution</option>
                        <option>Technology Partner</option>
                        <option>Regulator</option>
                        <option>Other</option>
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-500">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-lg transition-all shadow-lg shadow-sky-200 mt-2 flex items-center justify-center gap-2 group">
                    Join the RWA Ecosystem{" "}
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-50 pt-12 pb-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-slate-900">
                Real Value Institute
              </h4>
              <div className="flex items-start gap-3 text-slate-500 text-sm">
                <MapPin className="text-pink-500 mt-0.5 shrink-0" size={16} />
                <span>
                  Level 23, Salesforce Tower
                  <br />
                  180 George Street, Sydney NSW 2000, Australia
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <Mail className="text-sky-500 flex-shrink-0" size={16} />
                <a
                  href="mailto:contact@rvi-australia.org"
                  className="hover:text-sky-600 transition-colors"
                >
                  contact@rvi-australia.org
                </a>
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <Globe className="text-indigo-500 flex-shrink-0" size={16} />
                <a
                  href="https://rvi-australia.org"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-sky-600 transition-colors"
                >
                  rvi-australia.org
                </a>
              </div>
            </div>

            <div className="flex flex-col md:items-end gap-6">
              <div className="flex gap-4">
                <a
                  href="#"
                  className="p-2 bg-slate-50 border border-slate-200 rounded-full hover:bg-sky-500 hover:border-sky-500 hover:text-white transition-all text-slate-500"
                  aria-label="LinkedIn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="p-2 bg-slate-50 border border-slate-200 rounded-full hover:bg-sky-500 hover:border-sky-500 hover:text-white transition-all text-slate-500"
                  aria-label="Twitter"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-12.7 12.5S.2 5.3 7.8 4.5c2.1-.1 3.2.4 3.2.4l-1.9 1.9c-3 3.8 2.5 8.5 6.2 6.1l2-2s1.5.5 1.5 2c1.5-1.5 2.5-3.5 2.5-3.5z" />
                  </svg>
                </a>
              </div>
              <div className="flex gap-6 text-slate-500 text-xs md:text-sm">
                <a href="#" className="hover:text-sky-600 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-sky-600 transition-colors">
                  Terms of Service
                </a>
              </div>
              <div className="text-slate-400 text-xs">
                © {new Date().getFullYear()} Real Value Institute. All rights
                reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
