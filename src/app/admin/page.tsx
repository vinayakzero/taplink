import React from "react";
import Link from "next/link";
import {
  Users,
  Eye,
  MousePointerClick,
  TrendingUp,
  UserPlus,
  QrCode,
  Radio,
  ExternalLink,
  ArrowRight,
  MessageCircle,
  Star,
  CreditCard,
  MapPin,
} from "lucide-react";
import { getAllCustomers, getAnalyticsStats, getAllNfcCards } from "@/lib/data-service";

export const revalidate = 0; // Fresh data on each request

export default async function AdminDashboardPage() {
  const customers = await getAllCustomers();
  const stats = await getAnalyticsStats();
  const nfcCards = await getAllNfcCards();

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.isActive).length;
  const profileViews = stats.profileViews || 0;
  const totalClicks = stats.clicks || 0;
  const conversionRate = profileViews > 0 ? ((totalClicks / profileViews) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time performance across all NFC cards, QR profiles, and customer engagements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/customers/new"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Customer</span>
          </Link>
          <Link
            href="/admin/qr-codes"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4" />
            <span>QR Studio</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-[#131d33] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Customers</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{totalCustomers}</span>
            <span className="text-xs text-emerald-400 font-semibold">{activeCustomers} active</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#131d33] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Views</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{profileViews}</span>
            <span className="text-xs text-slate-400">Total scans/taps</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#131d33] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Action Clicks</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <MousePointerClick className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{totalClicks}</span>
            <span className="text-xs text-indigo-400 font-semibold">Links & UPI</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#131d33] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Engagement Rate</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{conversionRate}%</span>
            <span className="text-xs text-slate-400">Clicks per view</span>
          </div>
        </div>
      </div>

      {/* Grid: Recent Customers & Event Breakdown */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Customer List Table */}
        <div className="lg:col-span-8 rounded-3xl bg-[#131d33] border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">Active Customer Profiles</h2>
              <p className="text-xs text-slate-400">Click any customer to manage or view live NFC profile.</p>
            </div>
            <Link
              href="/admin/customers"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800/80">
                <tr>
                  <th className="pb-3 font-semibold">Customer / Business</th>
                  <th className="pb-3 font-semibold">Profile URL</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {customers.slice(0, 5).map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5">
                      <div className="font-bold text-slate-200 text-sm">{cust.name}</div>
                      <div className="text-slate-400 text-xs">{cust.businessName || "Personal Profile"}</div>
                    </td>
                    <td className="py-3.5 font-mono text-indigo-400">
                      <a
                        href={`/${cust.username}`}
                        target="_blank"
                        className="hover:underline flex items-center gap-1"
                      >
                        <span>/{cust.username}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="py-3.5">
                      {cust.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-medium text-[11px]">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      <Link
                        href={`/admin/customers/${cust.id}/edit`}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/${cust.username}`}
                        target="_blank"
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white transition-colors"
                      >
                        Preview
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Insights & Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Action Breakdown Card */}
          <div className="rounded-3xl bg-[#131d33] border border-slate-800 p-6 space-y-5">
            <h3 className="text-base font-bold text-white">Top Engagement Channels</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-semibold text-slate-200">WhatsApp Clicks</span>
                </div>
                <span className="font-bold text-white">{stats.eventTypeBreakdown?.whatsapp_click || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2.5 text-amber-400">
                  <Star className="w-4 h-4" />
                  <span className="font-semibold text-slate-200">Google Reviews</span>
                </div>
                <span className="font-bold text-white">{stats.eventTypeBreakdown?.google_review_click || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2.5 text-purple-400">
                  <CreditCard className="w-4 h-4" />
                  <span className="font-semibold text-slate-200">UPI Payments</span>
                </div>
                <span className="font-bold text-white">{stats.eventTypeBreakdown?.upi_click || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2.5 text-rose-400">
                  <MapPin className="w-4 h-4" />
                  <span className="font-semibold text-slate-200">Location / Map</span>
                </div>
                <span className="font-bold text-white">{stats.eventTypeBreakdown?.location_click || 0}</span>
              </div>
            </div>
          </div>

          {/* NFC Hardware Status Card */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-950/40 to-[#131d33] border border-indigo-500/20 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">NFC Smart Cards</h4>
                <p className="text-xs text-slate-400">{nfcCards.length} Cards Programmed</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Assign card UIDs or write TapLink URLs to physical NTAG216 tags directly from browser.
            </p>
            <Link
              href="/admin/nfc-cards"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300"
            >
              <span>Manage NFC Cards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
