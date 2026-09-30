"use client";

import React, { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { CustomerData } from "@/lib/data-service";
import { QRCodeSVG } from "qrcode.react";

// Slider items for the hero section showcase (includes mainpage + all 6 gallery cards)
const HERO_SLIDER_ITEMS = [
  {
    id: "mainpage",
    title: "TapLink Social Smart NFC Card",
    image: "/cards/mainpage.png",
  },
  {
    id: "card-1",
    title: "Doctor & Medical Clinic Google Review NFC Card",
    image: "/cards/card-1.png",
  },
  {
    id: "card-2",
    title: "Google 5-Star Business Review Tap & Scan Card",
    image: "/cards/card-2.png",
  },
  {
    id: "card-3",
    title: "Instagram Follower Growth & Social Booster Card",
    image: "/cards/card-3.png",
  },
  {
    id: "card-4",
    title: "Facebook Page & Social Community Card",
    image: "/cards/card-4.png",
  },
  {
    id: "card-5",
    title: "Restaurant & Cafe Digital Menu NFC Standee",
    image: "/cards/card-5.png",
  },
  {
    id: "card-6",
    title: "LinkedIn Corporate & Executive Networking Card",
    image: "/cards/card-6.png",
  },
];

// Card catalog for Gallery Showcase with real card images and targeted SEO
const NFC_CARDS_CATALOG = [
  {
    id: "doctor-clinic-review",
    name: "Doctor & Medical Clinic Google Review NFC Card",
    image: "/cards/card-1.png",
    badge: "Medical & Clinics",
    category: "Healthcare & Wellness",
    material: "Medical-Grade Acrylic & Hard PVC",
    finish: "Anti-Glare Healthcare Print with Stethoscope Artwork",
    chip: "NXP High-Speed Contactless Sensor",
    durability: "100% Waterproof, Sanitizer-Safe, 100k+ Taps",
    tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    seoKeywords: "Doctor NFC Card, Dental Clinic Review Standee, Medical Clinic Google Review, Healthcare Tap Card",
    idealFor: "Doctors, Dentists, Hospitals, Diagnostic Labs & Physiotherapy Clinics",
    description:
      "Crafted specifically for healthcare practitioners. Place it on the clinic reception or consultation desk so satisfied patients can tap and post 5-star Google Reviews in 2 seconds.",
  },
  {
    id: "google-5star-review",
    name: "Google 5-Star Business Review Tap & Scan NFC Card",
    image: "/cards/card-2.png",
    badge: "Best Seller #1",
    category: "Retail & Local Business",
    material: "Reinforced Composite Polymer",
    finish: "Official Google Rating Visuals + High-Contrast Dynamic QR",
    chip: "NXP NTAG216 High-Power Antenna",
    durability: "Scratch-Resistant, Fade-Proof, Lifetime Chip",
    tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    seoKeywords: "Google Review NFC Card, Tap to Review Card, Google 5 Star Standee, Business Rating Booster",
    idealFor: "Retail Stores, Salons, Spas, Automobile Showrooms & Local Businesses",
    description:
      "Multiply your 5-star Google Reviews on autopilot. Customers simply tap their phone to launch your direct Google Maps review page with 5 stars pre-selected.",
  },
  {
    id: "instagram-booster",
    name: "Instagram Follower Growth & Social Booster NFC Card",
    image: "/cards/card-3.png",
    badge: "Creator & Influencer",
    category: "Social Media & Creators",
    material: "Hardened Ultra-Gloss Polymer",
    finish: "Iconic Instagram Sunset Gradient with Sharp QR Backup",
    chip: "Dual-Frequency Instant Tap NFC Core",
    durability: "Waterproof, Anti-Fingerprint Coating",
    tagColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    seoKeywords: "Instagram NFC Card, Instagram Follower Card, Social Media Growth NFC, Creator Smart Card",
    idealFor: "Influencers, Fashion Boutiques, Photographers, Cafes & Beauty Salons",
    description:
      "Turn physical store visitors and event attendees into loyal Instagram followers. 1 tap opens your profile, reels, and digital link hub without manual searching.",
  },
  {
    id: "facebook-community",
    name: "Facebook Page & Social Community NFC Card",
    image: "/cards/card-4.png",
    badge: "Social & Community",
    category: "Local Community & Brand",
    material: "Durable Cobalt Matte PVC",
    finish: "Signature Facebook Blue Theme with Direct Scan Code",
    chip: "Embedded Smart NFC Micro-Transponder",
    durability: "Weather-Resistant, Long-Life Antenna",
    tagColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    seoKeywords: "Facebook NFC Card, Facebook Page Like Card, Business Facebook Connect Card, Smart Social Card",
    idealFor: "Local Businesses, Community Clubs, Event Organizers & Real Estate Agencies",
    description:
      "Seamlessly connect walk-in customers to your official Facebook page, group, or review section with a single contactless tap.",
  },
  {
    id: "restaurant-cafe-menu",
    name: "Restaurant & Cafe Digital Menu NFC Card / Standee",
    image: "/cards/card-5.png",
    badge: "Hospitality Special",
    category: "Food & Dining",
    material: "Spill-Proof Heavy Acrylic PVC",
    finish: "High-Resolution Culinary Theme with Contactless Menu QR",
    chip: "High-Sensitivity Table-Top Contactless Sensor",
    durability: "100% Water & Oil Spill-Proof, Heavy Table Duty",
    tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    seoKeywords: "Restaurant NFC Menu, Cafe Contactless Menu Card, Digital Food Menu QR, Table Standee NFC",
    idealFor: "Restaurants, Cafes, Bars, Cloud Kitchens, Food Trucks & Hotels",
    description:
      "Delight diners with an instant contactless menu. Guests tap the table card to browse dishes, check daily specials, and pay bills via UPI without waiting for staff.",
  },
  {
    id: "linkedin-corporate",
    name: "LinkedIn Professional & Executive Networking Card",
    image: "/cards/card-6.png",
    badge: "Corporate & Executive",
    category: "Executive & Sales",
    material: "Matte Black Ingot & Carbon Polymer",
    finish: "Laser Precision Typography & High-Definition QR",
    chip: "High-Performance NTAG216 (888 Bytes)",
    durability: "Military-Grade Scratch Resistance, 100k+ Reads",
    tagColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    seoKeywords: "LinkedIn NFC Card, Smart Business Card, Digital vCard Networking, Executive NFC Profile",
    idealFor: "Founders, CXOs, Sales Teams, Consultants & Keynote Speakers",
    description:
      "Make an unforgettable impression at business summits and client meetings. Instantly exchange your LinkedIn profile, save vCard directly into the client's phonebook, and close deals faster.",
  },
];

export default function HomePage() {
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [selectedGalleryCard, setSelectedGalleryCard] = useState(0);
  const [activeNav, setActiveNav] = useState("features");
  const [liveCustomers, setLiveCustomers] = useState<CustomerData[]>([]);

  // Autoplay hero card slider
  useEffect(() => {
    if (isAutoPlayPaused) return;
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDER_ITEMS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isAutoPlayPaused]);

  // Fetch live active customer profiles dynamically from API
  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        if (data.customers && Array.isArray(data.customers)) {
          setLiveCustomers(data.customers.filter((c: CustomerData) => c.isActive));
        }
      })
      .catch(() => {});
  }, []);

  const handlePrevSlide = () => {
    setCurrentHeroSlide((prev) => (prev === 0 ? HERO_SLIDER_ITEMS.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDER_ITEMS.length);
  };

  // Mobile Touch Swipe Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;
    if (isLeftSwipe) {
      handleNextSlide();
    } else if (isRightSwipe) {
      handlePrevSlide();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

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
    ...(liveCustomers.length > 0 ? [{ id: "demos", label: "Live Demos" }] : []),
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
    <div className="min-h-screen bg-[#080c16] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080c16]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo (Full Bleed Square) */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden shadow-lg shadow-indigo-600/30 border border-indigo-500/40 group-hover:scale-105 transition-transform shrink-0">
              <Image src="/logo.png" alt="TapLink Logo" fill sizes="44px" className="object-cover" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
                TapLink<span className="text-indigo-400">.in</span>
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-400">
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

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin Login Link */}
            <Link
              href="/admin/login"
              className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all border border-slate-700/80 flex items-center gap-1.5"
              title="Admin Portal Login"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Admin Login</span>
              <span className="sm:hidden">Admin</span>
            </Link>

            {/* Direct WhatsApp Order Button */}
            <button
              onClick={() => handleOrderWhatsApp()}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Order on WhatsApp</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-8 pb-20 sm:pt-12 sm:pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Background glow meshes */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-pink-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Smart NFC & QR Digital Business Profile</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
                One Tap. <br />
                <span className="gradient-text">Everything Connected.</span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                TapLink lets businesses connect customers to WhatsApp, social media, Google Reviews, website,
                and instant UPI payments through one seamless NFC & QR profile.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <button
                  onClick={() => handleOrderWhatsApp()}
                  className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Order on WhatsApp</span>
                </button>

                <button
                  onClick={() => scrollToSection("gallery")}
                  className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>View Cards Gallery</span>
                  <Layers className="w-5 h-5 text-indigo-400" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto lg:mx-0 text-center sm:text-left">
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="text-lg sm:text-xl font-extrabold text-white">1-Tap</div>
                  <p className="text-[11px] sm:text-xs text-slate-400">Zero apps required</p>
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="text-lg sm:text-xl font-extrabold text-white">100%</div>
                  <p className="text-[11px] sm:text-xs text-slate-400">iOS & Android ready</p>
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="text-lg sm:text-xl font-extrabold text-white">0% Fee</div>
                  <p className="text-[11px] sm:text-xs text-slate-400">Direct UPI payments</p>
                </div>
              </div>
            </div>

            {/* Right Card Slider (Massive, Prominent & High-Impact Showcase) */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center w-full px-1 sm:px-0">
              <div
                className="relative w-full max-w-[580px] sm:max-w-[640px] lg:max-w-[720px] xl:max-w-[760px] mx-auto select-none group"
                onMouseEnter={() => setIsAutoPlayPaused(true)}
                onMouseLeave={() => setIsAutoPlayPaused(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Soft ambient backlight glow */}
                <div className="absolute -inset-6 bg-gradient-to-r from-amber-500/20 via-indigo-600/30 to-purple-600/20 rounded-3xl blur-3xl opacity-80 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Slider Image Canvas (Expanded aspect ratio with scaled card image for maximum prominence) */}
                <div className="relative w-full aspect-[4/3] sm:aspect-[1.25/1] flex items-center justify-center overflow-hidden rounded-3xl bg-[#0d1424]/40 border border-slate-800/60 backdrop-blur-sm">
                  {HERO_SLIDER_ITEMS.map((slide, idx) => {
                    const isActive = idx === currentHeroSlide;
                    return (
                      <div
                        key={slide.id}
                        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                          isActive
                            ? "opacity-100 scale-100 z-10 pointer-events-auto"
                            : "opacity-0 scale-95 pointer-events-none z-0"
                        }`}
                      >
                        <div className="relative w-full h-full p-1 sm:p-2 flex items-center justify-center overflow-hidden">
                          <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            priority={idx === 0}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 640px, 760px"
                            className="object-contain scale-115 sm:scale-120 md:scale-125 drop-shadow-2xl transition-transform duration-500 hover:scale-[1.30]"
                          />
                        </div>
                      </div>
                    );
                  })}

                  {/* Left Arrow Button */}
                  <button
                    onClick={handlePrevSlide}
                    aria-label="Previous card image"
                    className="absolute left-2 sm:left-3 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/85 hover:bg-indigo-600 text-white flex items-center justify-center backdrop-blur-md border border-slate-700/80 shadow-2xl transition-all hover:scale-110 active:scale-95 opacity-85 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  {/* Right Arrow Button */}
                  <button
                    onClick={handleNextSlide}
                    aria-label="Next card image"
                    className="absolute right-2 sm:right-3 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/85 hover:bg-indigo-600 text-white flex items-center justify-center backdrop-blur-md border border-slate-700/80 shadow-2xl transition-all hover:scale-110 active:scale-95 opacity-85 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                {/* Slider Pagination Indicators & Title Tag */}
                <div className="flex flex-col items-center justify-center gap-2 mt-3 sm:mt-4 z-20">
                  <div className="flex items-center justify-center gap-1.5">
                    {HERO_SLIDER_ITEMS.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentHeroSlide(idx)}
                        aria-label={`Slide ${idx + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === currentHeroSlide
                            ? "w-7 sm:w-9 bg-indigo-500 shadow-md shadow-indigo-500/50"
                            : "w-2 bg-slate-700 hover:bg-slate-500"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] sm:text-xs text-slate-400 font-medium tracking-wide">
                    {HERO_SLIDER_ITEMS[currentHeroSlide].title}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ANIMATED NFC CARDS GALLERY SHOWCASE */}
      <section id="gallery" className="py-16 sm:py-24 bg-[#0b0f19] border-t border-b border-slate-800/80 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-600/10 blur-[160px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-extrabold flex items-center justify-center gap-1.5">
              <Radio className="w-4 h-4 text-indigo-400" />
              <span>Real Hardware Showcase & Catalog</span>
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              NFC Smart Cards & Standees Gallery
            </h2>
            <p className="text-slate-400 text-xs sm:text-base leading-relaxed px-2">
              Engineered with contactless high-speed NFC microchips and high-definition dynamic QR backup.
              Explore specialized cards built for Clinics, Google Reviews, Instagram, Facebook, Dining Menus, and Corporate LinkedIn.
            </p>
          </div>

          {/* Gallery Category Selector */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-[#131d33] border border-slate-800 max-w-5xl mx-auto shadow-2xl">
            {NFC_CARDS_CATALOG.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => setSelectedGalleryCard(idx)}
                className={`px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 ${
                  selectedGalleryCard === idx
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span>{card.category}</span>
                {card.badge && (
                  <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full border ${card.tagColor}`}>
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
              <div className="grid lg:grid-cols-12 gap-8 items-center bg-[#131d33]/80 border border-slate-800 rounded-3xl p-5 sm:p-8 lg:p-12 shadow-2xl backdrop-blur-md">
                {/* Real Card Graphic Showcase */}
                <div className="lg:col-span-6 flex justify-center items-center">
                  <div className="w-full max-w-[520px] rounded-3xl bg-gradient-to-tr from-slate-950 via-neutral-900 to-slate-900 border border-slate-700/70 p-3 sm:p-5 shadow-2xl relative overflow-hidden group transform hover:scale-[1.02] transition-all duration-300">
                    {/* Metallic Glow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                    {/* Card Image Display */}
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center p-1 sm:p-2">
                      <Image
                        src={currentCard.image}
                        alt={currentCard.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 520px"
                        className="object-contain scale-115 sm:scale-120 drop-shadow-2xl transition-transform duration-500 hover:scale-[1.25]"
                        priority
                      />
                    </div>

                    {/* Card Status Indicator */}
                    <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 border-t border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span className="text-xs font-mono text-slate-300 font-semibold">Instant NFC Sensor</span>
                      </div>
                      <span className="text-xs font-mono text-indigo-400 font-bold">taplink.in</span>
                    </div>
                  </div>
                </div>

                {/* Card Details & Ordering with SEO Highlights */}
                <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full border font-bold ${currentCard.tagColor}`}>
                      {currentCard.badge}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-semibold">
                      {currentCard.category}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                    {currentCard.name}
                  </h3>

                  <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
                    {currentCard.description}
                  </p>

                  {/* Bullet Specs */}
                  <div className="space-y-2 pt-1 sm:pt-2">
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Ideal For:</strong> {currentCard.idealFor}</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Material & Finish:</strong> {currentCard.material} ({currentCard.finish})</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>NFC Technology:</strong> {currentCard.chip}</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Durability:</strong> {currentCard.durability}</span>
                    </div>
                  </div>

                  {/* SEO Keyword Badges */}
                  <div className="pt-1 sm:pt-2">
                    <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">
                      Optimized For:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentCard.seoKeywords.split(",").map((kw, i) => (
                        <span
                          key={i}
                          className="text-[10px] sm:text-[11px] px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300"
                        >
                          {kw.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Order Button (Clean label without number) */}
                  <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                    <button
                      onClick={() => handleOrderWhatsApp(currentCard.name)}
                      className="w-full sm:w-auto px-7 sm:px-8 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Order on WhatsApp</span>
                    </button>
                    <span className="text-[11px] sm:text-xs text-slate-400 text-center sm:text-left">
                      Custom branding & dynamic QR printed
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Grid View of all 6 Available Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-4 sm:pt-6">
            {NFC_CARDS_CATALOG.map((card, idx) => (
              <div
                key={card.id}
                onClick={() => setSelectedGalleryCard(idx)}
                className={`cursor-pointer rounded-3xl p-4 sm:p-5 border transition-all space-y-4 flex flex-col justify-between ${
                  selectedGalleryCard === idx
                    ? "bg-[#162342] border-indigo-500 shadow-xl shadow-indigo-500/20"
                    : "bg-[#131d33]/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="space-y-3 sm:space-y-4">
                  {/* Card Thumbnail */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-slate-800/80 p-1">
                    <Image
                      src={card.image}
                      alt={card.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                      className="object-contain scale-110 hover:scale-115 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${card.tagColor}`}>
                      {card.badge}
                    </span>
                    <Radio className={`w-4 h-4 ${selectedGalleryCard === idx ? "text-indigo-400" : "text-slate-500"}`} />
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base leading-snug">{card.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">{card.idealFor}</p>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{card.description}</p>
                </div>

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
      <section id="features" className="py-16 sm:py-20 bg-[#080c16] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3 sm:space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-extrabold">Everything in One Place</h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-white">
              Turn every physical interaction into a lasting customer.
            </p>
            <p className="text-slate-400 text-xs sm:text-base">
              Say goodbye to outdated paper cards. TapLink delivers every touchpoint your customer needs instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#131d33]/60 border border-slate-800 hover:border-indigo-500/40 transition-all hover:-translate-y-1 space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Instant WhatsApp Connect</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Connect directly with prospective leads and customers on WhatsApp with pre-filled inquiry messages.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#131d33]/60 border border-slate-800 hover:border-indigo-500/40 transition-all hover:-translate-y-1 space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Star className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">5-Star Google Reviews</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Multiply your Google business reviews effortlessly. 1 tap takes clients straight to your review box.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#131d33]/60 border border-slate-800 hover:border-indigo-500/40 transition-all hover:-translate-y-1 space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                <CreditCard className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Zero-Fee UPI Payments</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Collect payments instantly with GPay, PhonePe, and Paytm directly into your merchant bank account with direct QR scanning.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#131d33]/60 border border-slate-800 hover:border-indigo-500/40 transition-all hover:-translate-y-1 space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                <QrCode className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Dynamic High-Res QR Codes</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Update your contact info or business details anytime without ever re-printing your physical QR codes.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#131d33]/60 border border-slate-800 hover:border-indigo-500/40 transition-all hover:-translate-y-1 space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <Globe className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Socials & Website Hub</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Showcase Instagram, Facebook, YouTube channels, and official websites in one unified profile.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#131d33]/60 border border-slate-800 hover:border-indigo-500/40 transition-all hover:-translate-y-1 space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Real-Time Click Analytics</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Track how many people viewed your card, clicked WhatsApp, saved contact, or scanned your QR.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-[#0b0f19] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2 sm:space-y-3">
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-extrabold">Simplicity First</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">How TapLink Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
            {/* Step 1 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#131d33]/50 border border-slate-800 relative space-y-3 sm:space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Choose Your NFC Card</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Select your preferred smart card (Google Reviews, Instagram, Medical Clinic, Restaurant Menu, or LinkedIn).
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#131d33]/50 border border-slate-800 relative space-y-3 sm:space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Tap NFC or Scan QR</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Hold your TapLink NFC smart card near any modern smartphone or scan the high-definition printed QR code.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#131d33]/50 border border-slate-800 relative space-y-3 sm:space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Instant Connection & Sales</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Your customer instantly accesses WhatsApp, reviews, socials, and UPI payments with zero app installation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE DEMOS SHOWCASE (Only shown when active profiles exist) */}
      {liveCustomers.length > 0 && (
        <section id="demos" className="py-16 sm:py-20 bg-[#080c16] border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-2 sm:space-y-3">
              <span className="text-xs uppercase tracking-widest text-indigo-400 font-extrabold">Explore Live Profiles</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Experience TapLink in Action</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Click any demo profile to see how it looks and works on live customer devices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {liveCustomers.slice(0, 6).map((cust) => (
                <div
                  key={cust.id}
                  className="rounded-3xl bg-[#131d33] border border-slate-800 p-5 sm:p-6 flex flex-col justify-between space-y-5 sm:space-y-6 hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 group"
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-slate-800 shrink-0">
                        {cust.profileImage ? (
                          <Image src={cust.profileImage} alt={cust.name} fill sizes="56px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white font-bold text-lg">
                            {cust.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm sm:text-base group-hover:text-indigo-400 transition-colors">
                          {cust.name}
                        </h4>
                        {cust.businessName && <p className="text-xs text-slate-400">{cust.businessName}</p>}
                      </div>
                    </div>

                    <div className="text-xs text-indigo-400 font-mono bg-slate-900/90 py-1.5 px-3 rounded-xl border border-slate-800/80 truncate">
                      https://taplink.in/{cust.username}
                    </div>

                    {cust.bio && <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{cust.bio}</p>}
                  </div>

                  <div className="pt-3 sm:pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="p-1.5 sm:p-2 bg-white rounded-xl shadow-sm shrink-0">
                      <QRCodeSVG value={`https://taplink.in/${cust.username}`} size={42} level="M" />
                    </div>

                    <Link
                      href={`/${cust.username}`}
                      target="_blank"
                      className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
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
      )}

      {/* FAQ SECTION */}
      <section id="faq" className="py-16 sm:py-20 bg-[#0b0f19] border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          <div className="text-center space-y-2 sm:space-y-3">
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-extrabold">Got Questions?</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="p-5 sm:p-6 rounded-2xl bg-[#131d33]/50 border border-slate-800 space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-white">Does the receiver need an app to open my profile?</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                No! TapLink profiles work natively in any mobile browser (Safari, Chrome, etc.) instantly when tapped via
                NFC or scanned via QR code.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[#131d33]/50 border border-slate-800 space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-white">What happens if I update my profile details or links?</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Your profile updates immediately in real-time from the admin dashboard. Your URL (
                <span className="text-indigo-400">taplink.in/yourname</span>), physical NFC cards, and printed QR codes
                never need to be changed!
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[#131d33]/50 border border-slate-800 space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-white">How does UPI payment work?</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                When a customer taps &ldquo;Pay via UPI&rdquo;, their phone automatically launches their default UPI app (Google
                Pay, PhonePe, Paytm, BHIM) with your UPI ID and name pre-filled. Payments go straight into your bank
                account with 0% transaction commission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#060911] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shadow-md shadow-indigo-600/30 border border-indigo-500/30 shrink-0">
              <Image src="/logo.png" alt="TapLink Logo" fill sizes="36px" className="object-cover" />
            </div>
            <span className="font-black text-white text-base sm:text-lg tracking-tight">TapLink</span>
            <span className="text-[11px] sm:text-xs text-slate-500">&copy; {new Date().getFullYear()} TapLink. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs text-slate-400">
            <Link href="/admin/login" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Admin Portal</span>
            </Link>
            {liveCustomers.length > 0 && (
              <Link href={`/${liveCustomers[0].username}`} className="hover:text-indigo-400 transition-colors">
                Demo Profile
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
