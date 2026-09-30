"use client";

import React, { useState } from "react";
import {
  Globe,
  Database,
  Shield,
  Save,
  CheckCircle2,
  Download,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [platformUrl, setPlatformUrl] = useState("https://taplink.in");
  const [supportEmail, setSupportEmail] = useState("support@taplink.in");
  const currency = "INR (₹)";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExportData = async () => {
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `taplink-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to export data");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Platform Settings</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure domain paths, database connections, and platform parameters.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Settings saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Domain & URL Configuration */}
        <div className="p-6 rounded-3xl bg-[#0d1424] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-blue-400 font-bold text-sm uppercase tracking-wider">
            <Globe className="w-4 h-4" />
            <span>Production Domain Configuration</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Platform Production Domain</label>
            <input
              type="url"
              value={platformUrl}
              onChange={(e) => setPlatformUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-400">
              Customer profiles are strictly generated as{" "}
              <span className="text-blue-400 font-mono">https://taplink.in/[username]</span>.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Default Currency</label>
              <input
                type="text"
                value={currency}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 text-xs cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Database & Infrastructure */}
        <div className="p-6 rounded-3xl bg-[#0d1424] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>PostgreSQL / Supabase Database</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Database Engine</span>
              <span className="font-mono text-emerald-400 font-bold">PostgreSQL (Prisma ORM)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Host Engine</span>
              <span className="text-slate-400">Vercel Serverless / Node.js</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-slate-400">Export full customers & analytics database payload</div>
            <button
              type="button"
              onClick={handleExportData}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>
          </div>
        </div>

        {/* Security Info */}
        <div className="p-6 rounded-3xl bg-[#0d1424] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-blue-400 font-bold text-sm uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Admin Authentication & Security</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Admin sessions are secured via cryptographic HTTP-only JWT cookies with bcrypt salted password verification.
            Update <code className="text-blue-300 font-mono">ADMIN_EMAIL</code> and{" "}
            <code className="text-blue-300 font-mono">ADMIN_PASSWORD</code> in your environment variables for production.
          </p>
        </div>

        <div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
