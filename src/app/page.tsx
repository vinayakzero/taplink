"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  QrCode,
  MessageCircle,
  Star,
  CreditCard,
  CheckCircle2,
  ExternalLink,
  BarChart3,
  Globe,
  Radio,
  Lock,
  Layers,
} from "lucide-react";
import { INITIAL_CUSTOMERS } from "@/lib/data-service";
import { QRCodeSVG } from "qrcode.react";

// Card catalog for Gallery Showcase
const NFC_CARDS_CATALOG = [
  {
    id: "matte-black-metal",
    name: "Matte Black Stealth Metal",
    badge: "Most Popular",
    material: "Aerospace Stainless Steel",
    finish: "Matte Black with Precision Laser Engraving",
    chip: "NXP NTAG216 (888 Bytes)",
    durability: "Waterproof, Scratch-Resistant, 100k+ Taps",
    accentColor: "from-slate-900 via-neutral-900 to-zinc-950",
    borderColor: "border-slate-700",
    tagColor: "bg-slate-800 text-slate-200 border-slate-700",
    description: "Ultra-premium matte black metal card with a solid weighty feel and laser-etched branding.",
  },
  {
    id: "luxury-gold-metal",
    name: "24K Luxury Gold Metal",
    badge: "VIP Edition",
    material: "Mirror-Polished Brass Alloy",
    finish: "24K Gold Mirror Finish & Deep Engraving",
    chip: "NXP NTAG216 High-Power Antenna",
    durability: "Heavyweight 22g Solid Metal, Lifetime NFC",
    accentColor: "from-amber-950 via-yellow-950 to-amber-900",
    borderColor: "border-amber-500/40",
    tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    description: "Executive-grade 24K mirror gold card designed for high-profile founders, executives, and luxury brands.",
  },
  {
    id: "bamboo-wood",
    name: "Eco-Friendly Bamboo Wood",
    badge: "100% Sustainable",
    material: "Real Natural Bamboo Wood",
    finish: "Organic Grain with Fine Laser Etching",
    chip: "Embedded Contactless Smart NFC",
    durability: "Lightweight, Organic, Eco-Friendly",
    accentColor: "from-amber-950/80 via-stone-900 to-neutral-950",
    borderColor: "border-amber-800/40",
    tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    description: "Sustainable natural bamboo wood card with unique organic wood grain texture on every piece.",
  },
  {
    id: "frosted-acrylic",
    name: "Frosted Minimalist Acrylic",
    badge: "Modern Aesthetic",
    material: "Translucent Frosted Acrylic PVC",
    finish: "Soft Matte Frosted with Spot UV QR",
    chip: "Ultra-Thin High-Speed NFC Core",
    durability: "100% Waterproof, Flexible & Durable",
    accentColor: "from-indigo-950/60 via-slate-900 to-blue-950/60",
    borderColor: "border-indigo-500/30",
    tagColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    description: "Futuristic translucent frosted finish with smooth matte texture and vibrant QR print.",
  },
  {
    id: "custom-branded",
    name: "Custom Full-Color Branded",
    badge: "Custom Artwork",
    material: "Reinforced Composite Polymer",
    finish: "Full Bleed CMYK + Holographic Foil",
    chip: "Multi-Protocol Smart NFC Sensor",
    durability: "Waterproof, Fade-Resistant, Heavy Gauge",
    accentColor: "from-purple-950/60 via-slate-900 to-indigo-950/60",
    borderColor: "border-purple-500/30",
    tagColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    description: "Tailor-made with your exact company logo, custom branding colors, and optional holographic foil.",
  },
];

export default function HomePage() {
  const [activeDemoTab, setActiveDemoTab] = useState(0);
  const [selectedGalleryCard, setSelectedGalleryCard] = useState(0);
  const [activeNav, setActiveNav] = useState("features");

  const activeCustomer = INITIAL_CUSTOMERS[activeDemoTab];

  // Direct WhatsApp Order Handler pointing to 6306840513
  const handleOrderWhatsApp = (cardName?: string) => {
    const cardText = cardName ? ` for "${cardName}"` : "";
    const message = `Hello TapLink Team! I want to order a customized TapLink NFC Card${cardText}. Please share pricing, designs, and delivery details.`;
    const waUrl = `https://wa.me/916306840513?text=${encodeURIComponent(message)}`;
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }
  };

  const navLinks = [
    { id: "features", label: "Features" },
    { id: "gallery", label: "NFC Cards Gallery" },
    { id: "how-it-works", label: "How It Works" },
    { id: "demos", label: "Live Demos" },
    { id: "faq", label: "FAQ" },
  ];

  const scrollToSection = (id: string) => {
    setActiveNav(id);
    if (typeof document !== "undefined") {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#080c16] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080c16]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo (Full Bleed Square) */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-lg shadow-indigo-600/30 border border-indigo-500/40 group-hover:scale-105 transition-transform shrink-0">
              <Image src="/logo.png" alt="TapLink Logo" fill sizes="44px" className="object-cover" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
                TapLink<span className="text-indigo-400">.in</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                NFC &bull; QR &bull; DIGITAL
              </span>
            </div>
          </Link>

          {/* Interactive Navigation Links with Dynamic Active State */}
          <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
            {navLinks.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 shadow-sm shadow-indigo-500/10 font-bold"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Admin Login Link */}
            <Link
              href="/admin/login"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all border border-slate-700/80 flex items-center gap-1.5"
              title="Admin Portal Login"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Admin Login</span>
            </Link>

            {/* Direct WhatsApp Order Button */}
            <button
              onClick={() => handleOrderWhatsApp()}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Order on WhatsApp</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Background glow meshes */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-pink-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Smart NFC & QR Digital Business Profile</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                One Tap. <br />
                <span className="gradient-text">Everything Connected.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                TapLink lets businesses connect customers to WhatsApp, social media, Google Reviews, website,
                and instant UPI payments through one seamless NFC & QR profile.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => handleOrderWhatsApp()}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-base shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Order on WhatsApp (6306840513)</span>
                </button>

                <button
                  onClick={() => scrollToSection("gallery")}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-base transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>View Cards Gallery</span>
                  <Layers className="w-5 h-5 text-indigo-400" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
                <div className="space-y-1">
                  <div className="text-xl font-extrabold text-white">1-Tap</div>
                  <p className="text-xs text-slate-400">Zero apps required</p>
                </div>
                <div className="space-y-1">
                  <div className="text-xl font-extrabold text-white">100%</div>
                  <p className="text-xs text-slate-400">iOS & Android ready</p>
                </div>
                <div className="space-y-1">
                  <div className="text-xl font-extrabold text-white">0% Fee</div>
                  <p className="text-xs text-slate-400">Direct UPI payments</p>
                </div>
              </div>
            </div>

            {/* Right Interactive Preview */}
            <div className="lg:col-span-5 flex flex-col items-center">
              {/* Profile Selector Tabs */}
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#131d33] border border-slate-800 mb-6 shadow-xl">
                {INITIAL_CUSTOMERS.map((cust, idx) => (
                  <button
                    key={cust.username}
                    onClick={() => setActiveDemoTab(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeDemoTab === idx
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    /{cust.username}
                  </button>
                ))}
              </div>

              {/* Smartphone Mockup */}
              <div className="relative w-full max-w-[340px] rounded-[42px] p-3 bg-gradient-to-b from-slate-700 via-slate-900 to-slate-950 shadow-2xl border-4 border-slate-800">
                {/* Phone Speaker & Camera Notch */}
                <div className="w-28 h-4 bg-slate-950 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <div className="w-3 h-3 bg-slate-900 rounded-full border border-slate-800 mr-2" />
                  <div className="w-12 h-1 bg-slate-800 rounded-full" />
                </div>

                {/* Inner Phone Screen */}
                <div className="rounded-[32px] bg-[#0d1527] border border-slate-800/80 p-4 space-y-4 overflow-hidden relative">
                  {/* Avatar & Info */}
                  <div className="text-center space-y-2 pt-2">
                    <div className="w-20 h-20 mx-auto rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-pink-500">
                      <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-900">
                        {activeCustomer.profileImage && (
                          <Image
                            src={activeCustomer.profileImage}
                            alt={activeCustomer.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        )}
                      </div>
                    </div>
                    <div className="font-bold text-white text-base">{activeCustomer.name}</div>
                    {activeCustomer.businessName && (
                      <div className="text-xs text-indigo-400 font-semibold">{activeCustomer.businessName}</div>
                    )}
                    {activeCustomer.bio && (
                      <div className="text-[11px] text-slate-300 line-clamp-2 px-2 leading-relaxed">
                        {activeCustomer.bio}
                      </div>
                    )}
                  </div>

                  {/* Sample Action Buttons inside phone mockup */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-white text-xs font-semibold">
                      <div className="w-7 h-7 rounded-lg bg-[#25D366] flex items-center justify-center text-white shrink-0">
                        <MessageCircle className="w-4 h-4 fill-current" />
                      </div>
                      <span className="truncate">Chat on WhatsApp</span>
                    </div>

                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-white text-xs font-semibold">
                      <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 shrink-0">
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                      <span className="truncate">Google Review (5★)</span>
                    </div>

                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-white text-xs font-semibold">
                      <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white shrink-0">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <span className="truncate">Pay via UPI</span>
                    </div>
                  </div>

                  {/* Open Live Profile Link */}
                  <div className="pt-2">
                    <Link
                      href={`/${activeCustomer.username}`}
                      target="_blank"
                      className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md"
                    >
                      <span>Open Live Profile</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ANIMATED NFC CARDS GALLERY SHOWCASE */}
      <section id="gallery" className="py-24 bg-[#0b0f19] border-t border-b border-slate-800/80 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-600/10 blur-[160px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-extrabold flex items-center justify-center gap-1.5">
              <Radio className="w-4 h-4 text-indigo-400" />
              <span>Premium Hardware Collection</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              NFC Smart Business Cards Gallery
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Explore our lineup of custom-engraved metal, sustainable wood, and sleek frosted acrylic cards.
              Tap to any phone to share your TapLink profile in less than 0.1 seconds.
            </p>
          </div>

          {/* Gallery Category Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl bg-[#131d33] border border-slate-800 max-w-4xl mx-auto shadow-2xl">
            {NFC_CARDS_CATALOG.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => setSelectedGalleryCard(idx)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedGalleryCard === idx
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span>{card.name}</span>
                {card.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${card.tagColor}`}>
                    {card.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Featured Active Card Spotlight */}
          {(() => {
            const currentCard = NFC_CARDS_CATALOG[selectedGalleryCard];
            return (
              <div className="grid lg:grid-cols-12 gap-8 items-center bg-[#131d33]/80 border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl backdrop-blur-md">
                {/* 3D Animated Card Preview */}
                <div className="lg:col-span-6 flex justify-center items-center py-6">
                  <div className="w-full max-w-[420px] aspect-[1.586] rounded-3xl bg-gradient-to-tr from-slate-950 via-neutral-900 to-slate-900 border-2 border-slate-700/80 p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden group transform hover:scale-[1.03] hover:-rotate-1 transition-all duration-300">
                    {/* Metallic Glow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                    {/* Top of Card */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-indigo-500/40">
                          <Image src="/logo.png" alt="TapLink" fill sizes="32px" className="object-cover" />
                        </div>
                        <span className="font-extrabold tracking-widest text-white text-base">TAPLINK</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-mono text-indigo-400">
                        <Radio className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                        <span>NFC READY</span>
                      </div>
                    </div>

                    {/* Center NFC Sensor Design */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-10 rounded-lg bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-600 shadow-md flex items-center justify-center border border-amber-300/80">
                        <div className="w-8 h-6 border border-amber-800/50 rounded-sm" />
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-mono tracking-widest">NXP CHIPSET</div>
                        <div className="text-xs font-bold text-slate-200">{currentCard.chip}</div>
                      </div>
                    </div>

                    {/* Bottom of Card */}
                    <div className="flex items-end justify-between pt-4 border-t border-slate-800/80">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest">{currentCard.material}</div>
                        <div className="text-sm font-bold text-white tracking-wider">{currentCard.name}</div>
                      </div>
                      <div className="font-mono text-xs text-indigo-400 font-bold tracking-tight">
                        taplink.in
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Details & Ordering */}
                <div className="lg:col-span-6 space-y-6 text-left">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold tracking-wide" style={{ backgroundColor: "rgba(99, 102, 241, 0.1)", borderColor: "rgba(99, 102, 241, 0.3)" }}>
                    <span className="text-indigo-400">{currentCard.badge}</span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
                    {currentCard.name}
                  </h3>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {currentCard.description}
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>Material:</strong> {currentCard.material}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>Finish:</strong> {currentCard.finish}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>Technology:</strong> {currentCard.chip}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>Durability:</strong> {currentCard.durability}</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                    <button
                      onClick={() => handleOrderWhatsApp(currentCard.name)}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Order on WhatsApp (6306840513)</span>
                    </button>
                    <span className="text-xs text-slate-400">Custom branding & laser engraving included</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Grid View of all Available Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
            {NFC_CARDS_CATALOG.map((card, idx) => (
              <div
                key={card.id}
                onClick={() => setSelectedGalleryCard(idx)}
                className={`cursor-pointer rounded-3xl p-6 border transition-all space-y-4 ${
                  selectedGalleryCard === idx
                    ? "bg-[#162342] border-indigo-500 shadow-xl shadow-indigo-500/20"
                    : "bg-[#131d33]/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${card.tagColor}`}>
                    {card.badge}
                  </span>
                  <Radio className={`w-4 h-4 ${selectedGalleryCard === idx ? "text-indigo-400" : "text-slate-500"}`} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{card.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{card.material}</p>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{card.description}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOrderWhatsApp(card.name);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-emerald-500/30"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Order on WhatsApp</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-20 bg-[#080c16] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-extrabold">Everything in One Place</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">
              Turn every physical interaction into a lasting customer.
            </p>
            <p className="text-slate-400 text-base">
              Say goodbye to outdated paper cards. TapLink delivers every touchpoint your customer needs instantly.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-[#131d33]/60 border border-slate-800 hover:border-indigo-500/40 transition-all hover:-translate-y-1 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <MessageCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Instant WhatsApp Connect</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Connect directly with prospective leads and customers on WhatsApp with pre-filled inquiry messages.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-[#131d33]/60 border border-slate-800 hover:border-indigo-500/40 transition-all hover:-translate-y-1 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Star className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">5-Star Google Reviews</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Multiply your Google business reviews effortlessly. 1 tap takes clients straight to your review box.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-[#131d33]/60 border border-slate-800 hover:border-indigo-500/40 transition-all hover:-translate-y-1 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                <CreditCard className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Zero-Fee UPI Payments</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Collect payments instantly with GPay, PhonePe, and Paytm directly into your merchant bank account with direct QR scanning.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-3xl bg-[#131d33]/60 border border-slate-800 hover:border-indigo-500/40 transition-all hover:-translate-y-1 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                <QrCode className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Dynamic High-Res QR Codes</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Update your contact info or business details anytime without ever re-printing your physical QR codes.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-3xl bg-[#131d33]/60 border border-slate-800 hover:border-indigo-500/40 transition-all hover:-translate-y-1 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Socials & Website Hub</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Showcase Instagram, Facebook, YouTube channels, and official websites in one unified profile.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-3xl bg-[#131d33]/60 border border-slate-800 hover:border-indigo-500/40 transition-all hover:-translate-y-1 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Real-Time Click Analytics</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Track how many people viewed your card, clicked WhatsApp, saved contact, or scanned your QR.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-[#0b0f19] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-extrabold">Simplicity First</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How TapLink Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-[#131d33]/50 border border-slate-800 relative space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
                1
              </div>
              <h3 className="text-xl font-bold text-white">Choose Your NFC Card</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Select your favorite card material (Matte Black, Luxury Gold, Bamboo Wood) with custom engraving.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-[#131d33]/50 border border-slate-800 relative space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
                2
              </div>
              <h3 className="text-xl font-bold text-white">Tap NFC or Scan QR</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Hold your TapLink NFC smart card near any modern smartphone or display your high-res standee QR.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-[#131d33]/50 border border-slate-800 relative space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
                3
              </div>
              <h3 className="text-xl font-bold text-white">Instant Connection & Sales</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your customer instantly accesses WhatsApp, social media, and UPI payments with zero app installation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE DEMOS SHOWCASE */}
      <section id="demos" className="py-20 bg-[#080c16] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-extrabold">Explore Live Profiles</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Experience TapLink in Action</h2>
            <p className="text-slate-400 text-sm">
              Click any demo profile to see how it looks and works on live customer devices.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {INITIAL_CUSTOMERS.map((cust) => (
              <div
                key={cust.id}
                className="rounded-3xl bg-[#131d33] border border-slate-800 p-6 flex flex-col justify-between space-y-6 hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-800">
                      {cust.profileImage && (
                        <Image src={cust.profileImage} alt={cust.name} fill sizes="56px" className="object-cover" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors">
                        {cust.name}
                      </h4>
                      {cust.businessName && <p className="text-xs text-slate-400">{cust.businessName}</p>}
                    </div>
                  </div>

                  <div className="text-xs text-indigo-400 font-mono bg-slate-900/90 py-1.5 px-3 rounded-xl border border-slate-800/80">
                    https://taplink.in/{cust.username}
                  </div>

                  {cust.bio && <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{cust.bio}</p>}
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <QRCodeSVG value={`https://taplink.in/${cust.username}`} size={48} level="M" />
                  </div>

                  <Link
                    href={`/${cust.username}`}
                    target="_blank"
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-[#0b0f19] border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-extrabold">Got Questions?</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-[#131d33]/50 border border-slate-800 space-y-2">
              <h3 className="text-base font-bold text-white">Does the receiver need an app to open my profile?</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                No! TapLink profiles work natively in any mobile browser (Safari, Chrome, etc.) instantly when tapped via
                NFC or scanned via QR code.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#131d33]/50 border border-slate-800 space-y-2">
              <h3 className="text-base font-bold text-white">What happens if I update my profile details or links?</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your profile updates immediately in real-time from the admin dashboard. Your URL (
                <span className="text-indigo-400">taplink.in/yourname</span>), physical NFC cards, and printed QR codes
                never need to be changed!
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#131d33]/50 border border-slate-800 space-y-2">
              <h3 className="text-base font-bold text-white">How does UPI payment work?</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                When a customer taps &ldquo;Pay via UPI&rdquo;, their phone automatically launches their default UPI app (Google
                Pay, PhonePe, Paytm, BHIM) with your UPI ID and name pre-filled. Payments go straight into your bank
                account with 0% transaction commission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#060911] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-indigo-600/30 border border-indigo-500/30 shrink-0">
              <Image src="/logo.png" alt="TapLink Logo" fill sizes="36px" className="object-cover" />
            </div>
            <span className="font-black text-white text-lg tracking-tight">TapLink</span>
            <span className="text-xs text-slate-500">&copy; {new Date().getFullYear()} TapLink. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link href="/admin/login" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Admin Portal</span>
            </Link>
            <Link href="/rahul" className="hover:text-indigo-400 transition-colors">
              Demo Profile
            </Link>
            <span className="text-slate-600">&bull;</span>
            <span className="text-slate-400">Official WhatsApp: +91 6306840513</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
