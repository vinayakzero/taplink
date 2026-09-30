"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MessageCircle,
  Instagram,
  Facebook,
  Youtube,
  Phone,
  MapPin,
  Star,
  Globe,
  CreditCard,
  QrCode,
  Share2,
  UserPlus,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Send,
  X,
} from "lucide-react";
import { CustomerData } from "@/lib/data-service";
import { generateWhatsAppUrl, generateUpiPaymentUrl, normalizeUrl, formatInstagramUrl } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";

interface ProfileViewProps {
  customer: CustomerData;
}

export default function ProfileView({ customer }: ProfileViewProps) {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Track profile view on initial mount
  useEffect(() => {
    try {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer.id,
          username: customer.username,
          eventType: "profile_view",
        }),
      }).catch(() => {});
    } catch {}
  }, [customer.id, customer.username]);

  const trackClick = (eventType: string) => {
    try {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer.id,
          username: customer.username,
          eventType,
        }),
      }).catch(() => {});
    } catch {}
  };

  const profileUrl = typeof window !== "undefined" ? window.location.href : `https://taplink.in/${customer.username}`;
  const shareText = `Check out ${customer.name}'s TapLink digital profile: ${profileUrl}`;

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl);
      setCopiedLink(true);
      trackClick("share_click");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleShare = async () => {
    trackClick("share_click");
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${customer.name} — TapLink`,
          text: `Check out ${customer.name}'s digital profile:`,
          url: profileUrl,
        });
        return;
      } catch {
        // Fallback to custom share modal
      }
    }
    setShowShareModal(true);
  };

  const handleCopyUpi = () => {
    if (customer.upiId && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(customer.upiId);
      setCopiedUpi(true);
      trackClick("upi_click");
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const waUrl = customer.whatsapp ? generateWhatsAppUrl(customer.whatsapp, customer.whatsappMessage) : null;
  const instaUrl = formatInstagramUrl(customer.instagramUrl);
  const fbUrl = normalizeUrl(customer.facebookUrl);
  const ytUrl = normalizeUrl(customer.youtubeUrl);
  const webUrl = normalizeUrl(customer.websiteUrl);
  const reviewUrl = normalizeUrl(customer.googleReviewUrl);
  const upiPayUrl = customer.upiId ? generateUpiPaymentUrl(customer.upiId, customer.name || customer.businessName) : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b0f19] via-[#0d1527] to-[#0b0f19] py-6 px-4 flex flex-col items-center justify-between selection:bg-indigo-500 selection:text-white">
      {/* Profile Card Container */}
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Card Header & Avatar */}
        <div className="relative rounded-3xl bg-[#131d33]/80 border border-slate-800/80 p-6 pt-8 text-center backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Top Decorative Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-2xl pointer-events-none rounded-full" />

          {/* Quick Action Badges (Top Right) */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => setShowQrModal(true)}
              title="Show Profile QR Code"
              className="p-2 rounded-full bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60 shadow-sm"
              aria-label="View QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              title="Share Profile"
              className="p-2 rounded-full bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60 shadow-sm"
              aria-label="Share Profile"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Verified Badge (Top Left) */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>TapLink Verified</span>
          </div>

          {/* Profile Image with Ring */}
          <div className="relative inline-block mt-4 mb-4">
            <div className="w-28 h-28 mx-auto rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-indigo-500/20">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-900">
                {customer.profileImage ? (
                  <Image
                    src={customer.profileImage}
                    alt={customer.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-3xl font-bold">
                    {customer.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-[#131d33] rounded-full" title="Online" />
          </div>

          {/* Name & Title */}
          <h1 className="text-2xl font-bold text-white tracking-tight">{customer.name}</h1>

          {customer.businessName && (
            <p className="text-sm font-semibold text-indigo-400 mt-1">
              {customer.businessName}
            </p>
          )}

          {customer.bio && (
            <p className="text-sm text-slate-300 mt-3.5 leading-relaxed max-w-sm mx-auto font-normal">
              {customer.bio}
            </p>
          )}

          {/* Save Contact (vCard) & Share Actions */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-3">
            <a
              href={`/api/vcard/${customer.username}`}
              onClick={() => trackClick("vcard_download")}
              download={`${customer.username}.vcf`}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/25 active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Save Contact</span>
            </a>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 font-medium text-sm transition-all active:scale-95"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? "Link Copied!" : "Share"}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons List */}
        <div className="space-y-3">
          {/* 1. WhatsApp Button */}
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("whatsapp_click")}
              className="group flex items-center justify-between w-full p-4 rounded-2xl bg-gradient-to-r from-[#128C7E]/20 to-[#25D366]/20 hover:from-[#128C7E]/30 hover:to-[#25D366]/30 border border-[#25D366]/40 text-white transition-all transform hover:-translate-y-0.5 active:scale-[0.99] shadow-lg shadow-emerald-950/20"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-6 h-6 fill-current" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                    <span>Chat on WhatsApp</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Fast Reply
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Direct instant message</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </a>
          )}

          {/* 2. Direct Call Button */}
          {customer.phone && (
            <a
              href={`tel:${customer.phone.replace(/[^0-9+]/g, "")}`}
              onClick={() => trackClick("call_click")}
              className="group flex items-center justify-between w-full p-4 rounded-2xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-white transition-all transform hover:-translate-y-0.5 active:scale-[0.99] shadow-md shadow-indigo-950/20"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-100">Call Directly</div>
                  <p className="text-xs text-indigo-300/80 font-mono">{customer.phone}</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
            </a>
          )}

          {/* 3. Google Review Button */}
          {reviewUrl && (
            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("google_review_click")}
              className="group flex items-center justify-between w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/30 text-white transition-all transform hover:-translate-y-0.5 active:scale-[0.99] shadow-lg shadow-amber-950/20"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform">
                  <Star className="w-6 h-6 fill-current" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-100 flex items-center gap-1">
                    <span>Give us a Google Review</span>
                    <div className="flex text-amber-400 text-xs">★★★★★</div>
                  </div>
                  <p className="text-xs text-amber-300/80">Support our business with 5 stars</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
            </a>
          )}

          {/* 4. UPI / Payment Button with QR Scanner & Copy */}
          {customer.upiId && (
            <div className="rounded-2xl bg-gradient-to-r from-purple-500/15 to-indigo-500/15 border border-purple-500/30 p-4 shadow-lg shadow-purple-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-100 flex items-center gap-2">
                      <span>Pay via UPI</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        Zero Fee
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-300 truncate max-w-[180px]">{customer.upiId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowUpiModal(true)}
                    title="Show UPI QR Code"
                    className="p-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 hover:text-white transition-colors"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCopyUpi}
                    title="Copy UPI ID"
                    className="p-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 hover:text-white transition-colors"
                  >
                    {copiedUpi ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  {upiPayUrl && (
                    <a
                      href={upiPayUrl}
                      onClick={() => trackClick("upi_click")}
                      className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-md shadow-purple-600/30 transition-all flex items-center gap-1"
                    >
                      <span>Pay</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 5. Website Button */}
          {webUrl && (
            <a
              href={webUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("website_click")}
              className="group flex items-center justify-between w-full p-4 rounded-2xl bg-[#131d33]/80 hover:bg-[#18243e] border border-slate-800/80 hover:border-slate-700 text-white transition-all transform hover:-translate-y-0.5 active:scale-[0.99] shadow-md"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-md shadow-cyan-600/30 group-hover:scale-105 transition-transform">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-100">Visit Website</div>
                  <p className="text-xs text-slate-400 truncate max-w-[210px]">{webUrl.replace(/^https?:\/\//, "")}</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </a>
          )}

          {/* 6. Google Maps Location Button */}
          {customer.locationUrl && (
            <a
              href={normalizeUrl(customer.locationUrl) || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("location_click")}
              className="group flex items-center justify-between w-full p-4 rounded-2xl bg-teal-600/10 hover:bg-teal-600/20 border border-teal-500/30 text-white transition-all transform hover:-translate-y-0.5 active:scale-[0.99] shadow-md shadow-teal-950/20"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/30 group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-100">Store / Office Location</div>
                  <p className="text-xs text-teal-300/80">Get directions on Google Maps</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
            </a>
          )}

          {/* Social Links Row (Instagram, Facebook, YouTube) */}
          {(instaUrl || fbUrl || ytUrl) && (
            <div className="pt-2">
              <div className="grid grid-cols-3 gap-3">
                {instaUrl && (
                  <a
                    href={instaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick("instagram_click")}
                    className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-gradient-to-b from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#F77737]/10 hover:from-[#833AB4]/20 hover:to-[#F77737]/20 border border-pink-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 text-center group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4] text-white flex items-center justify-center mb-1.5 shadow-md shadow-pink-600/30 group-hover:scale-105 transition-transform">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">Instagram</span>
                  </a>
                )}

                {fbUrl && (
                  <a
                    href={fbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick("facebook_click")}
                    className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 text-center group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center mb-1.5 shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
                      <Facebook className="w-5 h-5 fill-current" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">Facebook</span>
                  </a>
                )}

                {ytUrl && (
                  <a
                    href={ytUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick("youtube_click")}
                    className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 text-center group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#FF0000] text-white flex items-center justify-center mb-1.5 shadow-md shadow-red-600/30 group-hover:scale-105 transition-transform">
                      <Youtube className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">YouTube</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Brand */}
        <div className="pt-6 pb-4 text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <div className="relative w-4 h-4 rounded-md overflow-hidden shrink-0">
              <Image src="/logo.png" alt="TapLink" fill sizes="16px" className="object-cover" />
            </div>
            <span>Powered by</span>
            <span className="font-bold text-white tracking-tight">TapLink.in</span>
          </Link>
          <p className="text-[11px] text-slate-500">
            Get your own NFC & QR Card at{" "}
            <Link href="/" className="text-indigo-400 underline hover:text-indigo-300">
              taplink.in
            </Link>
          </p>
        </div>
      </div>

      {/* 1. Profile QR Code Modal */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-[#131d33] border border-slate-700/80 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Scan Profile QR Code</h3>
              <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Scan with any camera or QR scanner to open {customer.name}&apos;s TapLink profile.
            </p>

            <div className="p-4 bg-white rounded-2xl inline-block mx-auto shadow-xl">
              <QRCodeSVG
                value={profileUrl}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="text-xs font-mono text-indigo-400 bg-slate-900/90 py-2 px-3 rounded-xl border border-slate-800 truncate">
              {profileUrl}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
              </button>
              <button
                onClick={() => setShowQrModal(false)}
                className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. UPI Scanner / Payment QR Modal */}
      {showUpiModal && customer.upiId && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowUpiModal(false)}
        >
          <div
            className="bg-[#131d33] border border-purple-500/40 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-400" />
                <h3 className="text-base font-bold text-white">Scan & Pay via UPI</h3>
              </div>
              <button onClick={() => setShowUpiModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Scan with <span className="font-semibold text-white">Google Pay, PhonePe, Paytm</span> or any UPI app.
            </p>

            {/* UPI QR Code */}
            <div className="p-4 bg-white rounded-2xl inline-block mx-auto shadow-xl">
              <QRCodeSVG
                value={generateUpiPaymentUrl(customer.upiId, customer.name || customer.businessName)}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="bg-slate-900/90 py-2.5 px-3 rounded-xl border border-slate-800 text-xs">
              <div className="text-[11px] text-slate-400">Payee UPI ID</div>
              <div className="font-mono font-bold text-purple-300">{customer.upiId}</div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleCopyUpi}
                className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/50 text-purple-200 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUpi ? "Copied UPI ID" : "Copy UPI ID"}</span>
              </button>
              {upiPayUrl && (
                <a
                  href={upiPayUrl}
                  onClick={() => trackClick("upi_click")}
                  className="py-2.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors"
                >
                  Pay Now
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Share Profile Modal (Desktop / WhatsApp / Socials Fallback) */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-[#131d33] border border-slate-700/80 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Share {customer.name}&apos;s Profile</h3>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">Share this digital NFC profile with your network:</p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick("share_click")}
                className="p-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(`Check out ${customer.name}'s profile on TapLink`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick("share_click")}
                className="p-3 rounded-2xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4 text-blue-400" />
                <span>Telegram</span>
              </a>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? "Link Copied to Clipboard!" : "Copy Profile Link"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
