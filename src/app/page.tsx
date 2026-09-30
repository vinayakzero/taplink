"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Smartphone,
  QrCode,
  Zap,
  MessageCircle,
  Star,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  BarChart3,
  Globe,
} from "lucide-react";
import { INITIAL_CUSTOMERS } from "@/lib/data-service";
import { QRCodeSVG } from "qrcode.react";

export default function HomePage() {
  const [activeDemoTab, setActiveDemoTab] = useState(0);
  const activeCustomer = INITIAL_CUSTOMERS[activeDemoTab];

  return (
    <div className="min-h-screen bg-[#080c16] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080c16]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-white fill-current" />
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

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#demos" className="hover:text-white transition-colors">
              Live Demos
            </a>
            <a href="#nfc-card" className="hover:text-white transition-colors">
              NFC Cards
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all border border-slate-800"
            >
              Admin Login
            </Link>
            <Link
              href="/admin/customers/new"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
            >
              <span>Create Your TapLink</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
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
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Next-Gen Smart Business Profile</span>
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
                <Link
                  href="/admin/customers/new"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Create Your TapLink</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href="#demos"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-base transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>See Demo</span>
                  <Smartphone className="w-5 h-5 text-indigo-400" />
                </a>
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

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-20 bg-[#0b0f19] border-t border-b border-slate-800/80 relative">
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
                Collect payments instantly with GPay, PhonePe, and Paytm directly into your merchant bank account.
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
                Track how many people viewed your card, clicked WhatsApp, downloaded contact, or made payments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-[#080c16]">
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
              <h3 className="text-xl font-bold text-white">Claim Your Profile URL</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Create your custom username at <span className="text-indigo-400 font-mono">taplink.in/yourname</span> and
                fill in your business buttons.
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
      <section id="demos" className="py-20 bg-[#0b0f19] border-t border-slate-800/80">
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

      {/* PHYSICAL NFC CARD SHOWCASE */}
      <section id="nfc-card" className="py-20 bg-[#080c16] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-slate-900 border border-indigo-500/20 p-8 lg:p-14">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="text-xs uppercase tracking-widest text-indigo-400 font-extrabold">
                  Hardware &bull; NFC Smart Cards
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                  Matte Black Luxury NFC Cards.
                </h2>
                <p className="text-slate-300 text-base leading-relaxed">
                  Engineered with premium NTAG216 high-frequency microchips. Just tap against any iPhone or Android phone
                  to instantly launch your TapLink profile without touching a screen.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>No battery or charging needed</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Waterproof & durable PVC / Metal</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Reprogrammable anytime</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Instant tap response (&lt;0.1s)</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/admin/customers/new"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    <span>Order Your NFC Card</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* NFC Card Visual Mockup */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-[360px] aspect-[1.586] rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 border border-slate-700 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-indigo-400 fill-current" />
                      <span className="font-extrabold tracking-wider text-white text-sm">TAPLINK</span>
                    </div>
                    <div className="w-6 h-6 text-slate-400">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                      </svg>
                    </div>
                  </div>

                  {/* Center NFC Chip graphic */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-8 rounded-md bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500 opacity-85 shadow-md flex items-center justify-center border border-amber-200">
                      <div className="w-6 h-5 border border-amber-700/40 rounded-sm" />
                    </div>
                    <span className="text-xs text-slate-400 font-mono tracking-widest">NFC CONTACTLESS</span>
                  </div>

                  {/* Bottom info */}
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-widest">DIGITAL PASS</div>
                      <div className="text-sm font-bold text-white tracking-wider">TAPLINK.IN</div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-800/90 border border-slate-700 flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-indigo-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-current" />
            </div>
            <span className="font-black text-white text-lg tracking-tight">TapLink</span>
            <span className="text-xs text-slate-500">&copy; {new Date().getFullYear()} TapLink. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link href="/admin/login" className="hover:text-indigo-400 transition-colors">
              Admin Portal
            </Link>
            <Link href="/rahul" className="hover:text-indigo-400 transition-colors">
              Demo Profile
            </Link>
            <span className="text-slate-600">&bull;</span>
            <span className="text-slate-400">Production: https://taplink.in</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
