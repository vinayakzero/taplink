"use client";

import React, { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Download,
  Copy,
  Check,
  ExternalLink,
  Layers,
} from "lucide-react";
import { CustomerData } from "@/lib/data-service";

export default function QrCodesStudioPage() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [fgColor, setFgColor] = useState("#0b0f19");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [copied, setCopied] = useState(false);

  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        if (data.customers && data.customers.length > 0) {
          setCustomers(data.customers);
          setSelectedCustomerId(data.customers[0].id);
        }
      })
      .catch(console.error);
  }, []);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const profileUrl = selectedCustomer
    ? `${typeof window !== "undefined" ? window.location.origin : "https://taplink.in"}/${selectedCustomer.username}`
    : "https://taplink.in";

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `taplink-qr-${selectedCustomer?.username || "profile"}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPng = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();

    const size = 1024; // High-res 1024x1024 print ready
    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);

        const pngUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `taplink-qr-${selectedCustomer?.username || "profile"}-highres.png`;
        a.click();
      }
    };

    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">QR Code Studio</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Generate, customize, and export ultra-high resolution vector QR codes for print stands, table tents, and cards.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* 1. Select Customer */}
          <div className="p-6 rounded-3xl bg-[#131d33] border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">
              1. Select Customer Profile
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Choose Profile</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.businessName ? `${c.businessName} - ` : ""}@{c.username})
                  </option>
                ))}
              </select>
            </div>

            {selectedCustomer && (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                <span className="font-mono text-indigo-400 truncate max-w-[240px]">{profileUrl}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    title="Copy URL"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={profileUrl}
                    target="_blank"
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    title="Open Live"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* 2. Style & Colors */}
          <div className="p-6 rounded-3xl bg-[#131d33] border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-purple-400">
              2. QR Style & Colors
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">QR Pattern Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-9 h-9 rounded-lg bg-transparent cursor-pointer border border-slate-700"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-9 h-9 rounded-lg bg-transparent cursor-pointer border border-slate-700"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Color Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Quick Presets</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setFgColor("#0b0f19");
                    setBgColor("#ffffff");
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Classic Black & White
                </button>
                <button
                  onClick={() => {
                    setFgColor("#4f46e5");
                    setBgColor("#ffffff");
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  TapLink Indigo
                </button>
                <button
                  onClick={() => {
                    setFgColor("#065f46");
                    setBgColor("#ffffff");
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Emerald Green
                </button>
                <button
                  onClick={() => {
                    setFgColor("#78350f");
                    setBgColor("#ffffff");
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Warm Amber
                </button>
              </div>
            </div>
          </div>

          {/* 3. Export Actions */}
          <div className="p-6 rounded-3xl bg-[#131d33] border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-emerald-400">
              3. Download & Print
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDownloadPng}
                className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG (1024px)</span>
              </button>

              <button
                onClick={handleDownloadSvg}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Download Vector SVG</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview & Printable Standee Card Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-8 rounded-3xl bg-[#131d33] border border-slate-800 flex flex-col items-center justify-center text-center space-y-6 shadow-2xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Printable Standee / Counter Display
            </span>

            {/* The Print Standee Frame */}
            <div
              className="p-8 rounded-3xl border-2 border-slate-700 shadow-2xl text-center space-y-4 max-w-sm w-full transition-all"
              style={{ backgroundColor: bgColor }}
            >
              {/* Header inside standee */}
              <div className="space-y-1">
                <div
                  className="font-black text-xl tracking-tight uppercase"
                  style={{ color: fgColor }}
                >
                  {selectedCustomer?.businessName || selectedCustomer?.name || "TapLink"}
                </div>
                <p className="text-xs font-medium opacity-75" style={{ color: fgColor }}>
                  Scan with Camera or Tap NFC to Connect
                </p>
              </div>

              {/* QR Render */}
              <div ref={qrRef} className="p-2 inline-block mx-auto rounded-2xl">
                <QRCodeSVG
                  value={profileUrl}
                  size={220}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level="H"
                  includeMargin={true}
                />
              </div>

              {/* Footer inside standee */}
              <div className="pt-2 border-t border-slate-300/40 space-y-1">
                <div
                  className="text-xs font-mono font-bold tracking-wide"
                  style={{ color: fgColor }}
                >
                  taplink.in/{selectedCustomer?.username || "username"}
                </div>
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold opacity-60 uppercase tracking-widest" style={{ color: fgColor }}>
                  <span>WhatsApp</span>
                  <span>&bull;</span>
                  <span>Reviews</span>
                  <span>&bull;</span>
                  <span>UPI Pay</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-xs">
              Place this standee at billing counters, salon mirrors, cafe tables, or trade show booths.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
