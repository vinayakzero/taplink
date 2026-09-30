"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Smartphone,
  MessageCircle,
  Phone,
  Star,
  CreditCard,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  MapPin,
  Upload,
  X,
  ImageIcon,
  CheckSquare,
  Square,
  Sparkles,
} from "lucide-react";

export default function AddCustomerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Enabled / Disabled Toggles for every profile feature
  const [enabledFeatures, setEnabledFeatures] = useState({
    whatsapp: true,
    phone: true,
    googleReview: true,
    upi: true,
    website: true,
    instagram: true,
    facebook: true,
    youtube: true,
    location: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    username: "",
    profileImage: "",
    bio: "",
    phone: "",
    whatsapp: "",
    whatsappMessage: "",
    instagramUrl: "",
    facebookUrl: "",
    youtubeUrl: "",
    websiteUrl: "",
    googleReviewUrl: "",
    locationUrl: "",
    upiId: "",
    isActive: true,
  });

  const toggleFeature = (key: keyof typeof enabledFeatures) => {
    setEnabledFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectAllFeatures = (enable: boolean) => {
    setEnabledFeatures({
      whatsapp: enable,
      phone: enable,
      googleReview: enable,
      upi: enable,
      website: enable,
      instagram: enable,
      facebook: enable,
      youtube: enable,
      location: enable,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "username") {
      const clean = value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
      setFormData((prev) => ({ ...prev, username: clean }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    setUploadingImage(true);
    setError(null);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const resData = await res.json();
      if (res.ok && resData.url) {
        setFormData((prev) => ({ ...prev, profileImage: resData.url }));
      } else {
        throw new Error(resData.error || "Failed to upload image");
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleNameBlur = () => {
    if (!formData.username && formData.name) {
      const slug = formData.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setFormData((prev) => ({ ...prev, username: slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.username.trim()) {
      setError("Name and Username are required fields.");
      return;
    }

    setLoading(true);
    try {
      // Prepare payload: only send values for checked/enabled features
      const payload = {
        ...formData,
        whatsapp: enabledFeatures.whatsapp ? formData.whatsapp : "",
        whatsappMessage: enabledFeatures.whatsapp ? formData.whatsappMessage : "",
        phone: enabledFeatures.phone ? formData.phone : "",
        googleReviewUrl: enabledFeatures.googleReview ? formData.googleReviewUrl : "",
        upiId: enabledFeatures.upi ? formData.upiId : "",
        websiteUrl: enabledFeatures.website ? formData.websiteUrl : "",
        instagramUrl: enabledFeatures.instagram ? formData.instagramUrl : "",
        facebookUrl: enabledFeatures.facebook ? formData.facebookUrl : "",
        youtubeUrl: enabledFeatures.youtube ? formData.youtubeUrl : "",
        locationUrl: enabledFeatures.location ? formData.locationUrl : "",
      };

      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create customer");
      }

      router.push("/admin/customers");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/customers"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Add New Customer</h1>
            <p className="text-xs text-slate-400">
              Create a custom NFC & QR profile. Choose exactly which buttons appear on the profile using the checkboxes below.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8">
        {/* Left: Input Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Basic Profile Info */}
          <div className="p-6 rounded-3xl bg-[#131d33] border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <span>1. Basic Profile Details</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleNameBlur}
                  placeholder="e.g. Rahul Verma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Business / Company Name (Optional)</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="e.g. Luxury Spa & Salon"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Username with Live URL Preview */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                TapLink Username (Profile URL) <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center">
                <span className="px-3.5 py-2.5 rounded-l-xl bg-slate-800 border border-r-0 border-slate-700 text-slate-400 text-xs font-mono">
                  taplink.in/
                </span>
                <input
                  type="text"
                  required
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="rahul"
                  className="w-full px-3.5 py-2.5 rounded-r-xl bg-slate-900 border border-slate-700 text-indigo-400 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Profile link: <span className="text-indigo-400 font-mono">https://taplink.in/{formData.username || "username"}</span>
              </p>
            </div>

            {/* Profile Photo: Gallery Upload */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Profile Photo (Upload from Gallery / Files)</span>
                {formData.profileImage && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, profileImage: "" }))}
                    className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </label>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80">
                {/* Photo Thumbnail */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-800 border-2 border-indigo-500/40 shrink-0 flex items-center justify-center">
                  {formData.profileImage ? (
                    <Image
                      src={formData.profileImage}
                      alt="Profile preview"
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-500" />
                  )}
                </div>

                {/* Upload Action */}
                <div className="space-y-1.5 flex-1 w-full text-left">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? "Uploading Photo..." : "Upload from Gallery"}</span>
                  </button>
                  <p className="text-[11px] text-slate-400">
                    Supports JPG, PNG, WEBP.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Bio / Tagline (Optional)</label>
              <textarea
                name="bio"
                rows={2}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Brief description or tagline..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Section 2: Choose Which Profile Buttons to Enable (Tick / Untick) */}
          <div className="p-6 rounded-3xl bg-[#131d33] border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>2. Profile Buttons & Features Selection</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tick the buttons you want to show on this customer&apos;s TapLink. Unticked buttons will be completely hidden.
                </p>
              </div>

              {/* Quick Select All / None */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectAllFeatures(true)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-semibold transition-colors border border-emerald-500/30"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectAllFeatures(false)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-[11px] font-semibold transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Feature 1: WhatsApp */}
            <div className={`p-4 rounded-2xl border transition-all ${enabledFeatures.whatsapp ? "bg-emerald-950/20 border-emerald-500/40" : "bg-slate-900/40 border-slate-800 opacity-70"}`}>
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFeature("whatsapp")}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${enabledFeatures.whatsapp ? "bg-[#25D366]" : "bg-slate-700"}`}>
                    <MessageCircle className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">WhatsApp Button</span>
                    <p className="text-[11px] text-slate-400">Direct instant messaging</p>
                  </div>
                </div>
                <div className="text-emerald-400">
                  {enabledFeatures.whatsapp ? <CheckSquare className="w-5 h-5 text-emerald-400" /> : <Square className="w-5 h-5 text-slate-500" />}
                </div>
              </div>

              {enabledFeatures.whatsapp && (
                <div className="grid sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-emerald-500/20">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">WhatsApp Number</label>
                    <input
                      type="text"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="e.g. 919876543210"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">Default Inquiry Message</label>
                    <input
                      type="text"
                      name="whatsappMessage"
                      value={formData.whatsappMessage}
                      onChange={handleChange}
                      placeholder="Hi! I want to connect."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Feature 2: Phone Call */}
            <div className={`p-4 rounded-2xl border transition-all ${enabledFeatures.phone ? "bg-indigo-950/20 border-indigo-500/40" : "bg-slate-900/40 border-slate-800 opacity-70"}`}>
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFeature("phone")}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${enabledFeatures.phone ? "bg-indigo-600" : "bg-slate-700"}`}>
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Call / Save Contact Button</span>
                    <p className="text-[11px] text-slate-400">Phone dialer & vCard download</p>
                  </div>
                </div>
                <div className="text-indigo-400">
                  {enabledFeatures.phone ? <CheckSquare className="w-5 h-5 text-indigo-400" /> : <Square className="w-5 h-5 text-slate-500" />}
                </div>
              </div>

              {enabledFeatures.phone && (
                <div className="mt-3 pt-3 border-t border-indigo-500/20 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Phone / Mobile Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}
            </div>

            {/* Feature 3: Google Reviews */}
            <div className={`p-4 rounded-2xl border transition-all ${enabledFeatures.googleReview ? "bg-amber-950/20 border-amber-500/40" : "bg-slate-900/40 border-slate-800 opacity-70"}`}>
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFeature("googleReview")}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-slate-950 ${enabledFeatures.googleReview ? "bg-amber-400" : "bg-slate-700 text-white"}`}>
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Google 5-Star Review Button</span>
                    <p className="text-[11px] text-slate-400">Direct Google Maps review link</p>
                  </div>
                </div>
                <div className="text-amber-400">
                  {enabledFeatures.googleReview ? <CheckSquare className="w-5 h-5 text-amber-400" /> : <Square className="w-5 h-5 text-slate-500" />}
                </div>
              </div>

              {enabledFeatures.googleReview && (
                <div className="mt-3 pt-3 border-t border-amber-500/20 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Google Review Direct URL</label>
                  <input
                    type="url"
                    name="googleReviewUrl"
                    value={formData.googleReviewUrl}
                    onChange={handleChange}
                    placeholder="https://g.page/r/.../review"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}
            </div>

            {/* Feature 4: UPI Payment */}
            <div className={`p-4 rounded-2xl border transition-all ${enabledFeatures.upi ? "bg-purple-950/20 border-purple-500/40" : "bg-slate-900/40 border-slate-800 opacity-70"}`}>
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFeature("upi")}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${enabledFeatures.upi ? "bg-purple-600" : "bg-slate-700"}`}>
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">UPI / Instant Payment Button</span>
                    <p className="text-[11px] text-slate-400">GPay, PhonePe, Paytm QR</p>
                  </div>
                </div>
                <div className="text-purple-400">
                  {enabledFeatures.upi ? <CheckSquare className="w-5 h-5 text-purple-400" /> : <Square className="w-5 h-5 text-slate-500" />}
                </div>
              </div>

              {enabledFeatures.upi && (
                <div className="mt-3 pt-3 border-t border-purple-500/20 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Merchant / Personal UPI ID</label>
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleChange}
                    placeholder="e.g. rahul@okhdfcbank"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-purple-300 font-mono text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              )}
            </div>

            {/* Feature 5: Website */}
            <div className={`p-4 rounded-2xl border transition-all ${enabledFeatures.website ? "bg-cyan-950/20 border-cyan-500/40" : "bg-slate-900/40 border-slate-800 opacity-70"}`}>
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFeature("website")}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${enabledFeatures.website ? "bg-cyan-600" : "bg-slate-700"}`}>
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Official Website Button</span>
                    <p className="text-[11px] text-slate-400">Direct website visit link</p>
                  </div>
                </div>
                <div className="text-cyan-400">
                  {enabledFeatures.website ? <CheckSquare className="w-5 h-5 text-cyan-400" /> : <Square className="w-5 h-5 text-slate-500" />}
                </div>
              </div>

              {enabledFeatures.website && (
                <div className="mt-3 pt-3 border-t border-cyan-500/20 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Website URL</label>
                  <input
                    type="url"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}
            </div>

            {/* Feature 6: Instagram */}
            <div className={`p-4 rounded-2xl border transition-all ${enabledFeatures.instagram ? "bg-pink-950/20 border-pink-500/40" : "bg-slate-900/40 border-slate-800 opacity-70"}`}>
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFeature("instagram")}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${enabledFeatures.instagram ? "bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4]" : "bg-slate-700"}`}>
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Instagram Profile Button</span>
                    <p className="text-[11px] text-slate-400">Instagram profile / handle</p>
                  </div>
                </div>
                <div className="text-pink-400">
                  {enabledFeatures.instagram ? <CheckSquare className="w-5 h-5 text-pink-400" /> : <Square className="w-5 h-5 text-slate-500" />}
                </div>
              </div>

              {enabledFeatures.instagram && (
                <div className="mt-3 pt-3 border-t border-pink-500/20 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Instagram Handle or Link</label>
                  <input
                    type="text"
                    name="instagramUrl"
                    value={formData.instagramUrl}
                    onChange={handleChange}
                    placeholder="@username or https://instagram.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
              )}
            </div>

            {/* Feature 7: Facebook */}
            <div className={`p-4 rounded-2xl border transition-all ${enabledFeatures.facebook ? "bg-blue-950/20 border-blue-500/40" : "bg-slate-900/40 border-slate-800 opacity-70"}`}>
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFeature("facebook")}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${enabledFeatures.facebook ? "bg-[#1877F2]" : "bg-slate-700"}`}>
                    <Facebook className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Facebook Page Button</span>
                    <p className="text-[11px] text-slate-400">Official Facebook page</p>
                  </div>
                </div>
                <div className="text-blue-400">
                  {enabledFeatures.facebook ? <CheckSquare className="w-5 h-5 text-blue-400" /> : <Square className="w-5 h-5 text-slate-500" />}
                </div>
              </div>

              {enabledFeatures.facebook && (
                <div className="mt-3 pt-3 border-t border-blue-500/20 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Facebook URL</label>
                  <input
                    type="text"
                    name="facebookUrl"
                    value={formData.facebookUrl}
                    onChange={handleChange}
                    placeholder="https://facebook.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Feature 8: YouTube */}
            <div className={`p-4 rounded-2xl border transition-all ${enabledFeatures.youtube ? "bg-red-950/20 border-red-500/40" : "bg-slate-900/40 border-slate-800 opacity-70"}`}>
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFeature("youtube")}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${enabledFeatures.youtube ? "bg-[#FF0000]" : "bg-slate-700"}`}>
                    <Youtube className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">YouTube Channel Button</span>
                    <p className="text-[11px] text-slate-400">Videos & channel link</p>
                  </div>
                </div>
                <div className="text-red-400">
                  {enabledFeatures.youtube ? <CheckSquare className="w-5 h-5 text-red-400" /> : <Square className="w-5 h-5 text-slate-500" />}
                </div>
              </div>

              {enabledFeatures.youtube && (
                <div className="mt-3 pt-3 border-t border-red-500/20 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">YouTube Channel URL</label>
                  <input
                    type="text"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleChange}
                    placeholder="https://youtube.com/@..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
              )}
            </div>

            {/* Feature 9: Google Map Location */}
            <div className={`p-4 rounded-2xl border transition-all ${enabledFeatures.location ? "bg-teal-950/20 border-teal-500/40" : "bg-slate-900/40 border-slate-800 opacity-70"}`}>
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFeature("location")}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${enabledFeatures.location ? "bg-teal-600" : "bg-slate-700"}`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Store / Office Map Location</span>
                    <p className="text-[11px] text-slate-400">Google Maps directions</p>
                  </div>
                </div>
                <div className="text-teal-400">
                  {enabledFeatures.location ? <CheckSquare className="w-5 h-5 text-teal-400" /> : <Square className="w-5 h-5 text-slate-500" />}
                </div>
              </div>

              {enabledFeatures.location && (
                <div className="mt-3 pt-3 border-t border-teal-500/20 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Google Maps Location Link</label>
                  <input
                    type="url"
                    name="locationUrl"
                    value={formData.locationUrl}
                    onChange={handleChange}
                    placeholder="https://maps.google.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Creating Profile..." : "Save TapLink Customer Profile"}</span>
            </button>
            <Link
              href="/admin/customers"
              className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Right: Real-time Live Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-6">
            <div className="p-4 rounded-3xl bg-[#131d33] border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Real-Time Profile Preview</span>
                </span>
                <span className="text-[11px] font-mono text-indigo-400">
                  /{formData.username || "username"}
                </span>
              </div>

              {/* Profile Card Preview Box */}
              <div className="rounded-2xl bg-[#0b0f19] border border-slate-800/80 p-5 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full p-0.5 bg-gradient-to-tr from-indigo-500 to-pink-500">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-900">
                    {formData.profileImage ? (
                      <Image
                        src={formData.profileImage}
                        alt="Preview"
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white font-bold">
                        {formData.name ? formData.name.charAt(0) : "?"}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base">{formData.name || "Customer Name"}</h3>
                  {formData.businessName && <p className="text-xs text-indigo-400 font-semibold">{formData.businessName}</p>}
                  {formData.bio && (
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3">
                      {formData.bio}
                    </p>
                  )}
                </div>

                {/* Enabled Preview buttons */}
                <div className="space-y-2 pt-2 text-xs text-left">
                  {enabledFeatures.whatsapp && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      <span>Chat on WhatsApp</span>
                    </div>
                  )}

                  {enabledFeatures.phone && (
                    <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-semibold flex items-center gap-2">
                      <Phone className="w-4 h-4 text-indigo-400" />
                      <span>Call & Save Contact</span>
                    </div>
                  )}

                  {enabledFeatures.googleReview && (
                    <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-400" />
                      <span>Google Review (5★)</span>
                    </div>
                  )}

                  {enabledFeatures.upi && (
                    <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 font-semibold flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-purple-400" />
                      <span>Pay via UPI</span>
                    </div>
                  )}

                  {enabledFeatures.website && (
                    <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span>Official Website</span>
                    </div>
                  )}

                  {enabledFeatures.location && (
                    <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-teal-400" />
                      <span>View Map Location</span>
                    </div>
                  )}

                  {/* Social row preview */}
                  {(enabledFeatures.instagram || enabledFeatures.facebook || enabledFeatures.youtube) && (
                    <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
                      {enabledFeatures.instagram && (
                        <div className="p-2 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-300 text-[11px] font-semibold flex flex-col items-center">
                          <Instagram className="w-3.5 h-3.5 mb-0.5" />
                          <span>Insta</span>
                        </div>
                      )}
                      {enabledFeatures.facebook && (
                        <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[11px] font-semibold flex flex-col items-center">
                          <Facebook className="w-3.5 h-3.5 mb-0.5" />
                          <span>FB</span>
                        </div>
                      )}
                      {enabledFeatures.youtube && (
                        <div className="p-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-[11px] font-semibold flex flex-col items-center">
                          <Youtube className="w-3.5 h-3.5 mb-0.5" />
                          <span>YT</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
