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
  Star,
  CreditCard,
  Upload,
  X,
  ImageIcon,
} from "lucide-react";

export default function AddCustomerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/customers"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Add New Customer</h1>
            <p className="text-xs text-slate-400">Create a new NFC & QR business profile on TapLink.</p>
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
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">
              1. Basic Profile Info
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
                  placeholder="e.g. Rahul"
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
                  placeholder="e.g. ABC Salon"
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
                Permanent NFC & QR link: <span className="text-indigo-400 font-mono">https://taplink.in/{formData.username || "username"}</span>
              </p>
            </div>

            {/* Profile Photo: Gallery Upload & URL */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Profile Photo (Upload from Gallery / Device)</span>
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
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 border-2 border-indigo-500/40 shrink-0 flex items-center justify-center">
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

                {/* Upload Buttons & Options */}
                <div className="space-y-2 flex-1 w-full text-left">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? "Uploading Photo..." : "Upload from Gallery / Files"}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Supports JPG, PNG, WEBP (Max 5MB). Photo is saved automatically.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Bio / Description (Optional)</label>
              <textarea
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Brief description of your offerings..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Section 2: Contact & Instant Messaging */}
          <div className="p-6 rounded-3xl bg-[#131d33] border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-emerald-400">
              2. Phonebook Contact & WhatsApp
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Contact Number (For Save Contact to Phone)</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">WhatsApp Number</label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="919876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">WhatsApp Pre-filled Inquiry Message</label>
              <input
                type="text"
                name="whatsappMessage"
                value={formData.whatsappMessage}
                onChange={handleChange}
                placeholder="e.g. Hi! I saw your TapLink profile and would like to connect."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Section 3: Social & Business Links */}
          <div className="p-6 rounded-3xl bg-[#131d33] border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-purple-400">
              3. Social, Payment & Reviews
            </h2>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">UPI ID for Direct Payments</label>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  placeholder="e.g. rahul@okhdfcbank or business@paytm"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-purple-300 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Google Review Direct URL</label>
                <input
                  type="url"
                  name="googleReviewUrl"
                  value={formData.googleReviewUrl}
                  onChange={handleChange}
                  placeholder="https://g.page/r/.../review"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Website URL</label>
                <input
                  type="url"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Instagram Handle / URL</label>
                  <input
                    type="text"
                    name="instagramUrl"
                    value={formData.instagramUrl}
                    onChange={handleChange}
                    placeholder="@username"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Facebook URL</label>
                  <input
                    type="text"
                    name="facebookUrl"
                    value={formData.facebookUrl}
                    onChange={handleChange}
                    placeholder="https://facebook.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">YouTube URL</label>
                  <input
                    type="text"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleChange}
                    placeholder="https://youtube.com/@..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Creating Profile..." : "Create TapLink Customer"}</span>
            </button>
            <Link
              href="/admin/customers"
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Right: Live Card Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-6">
            <div className="p-4 rounded-3xl bg-[#131d33] border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Live Preview</span>
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

                {/* Preview buttons */}
                <div className="space-y-2 pt-2 text-xs">
                  {formData.whatsapp && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </div>
                  )}

                  {formData.googleReviewUrl && (
                    <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      <span>Give us a Google Review (5★)</span>
                    </div>
                  )}

                  {formData.upiId && (
                    <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 font-semibold flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Pay via UPI ({formData.upiId})</span>
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
