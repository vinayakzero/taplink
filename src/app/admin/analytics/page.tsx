"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  MousePointerClick,
  TrendingUp,
  MessageCircle,
  Phone,
  Instagram,
  Facebook,
  Youtube,
  Star,
  MapPin,
  Globe,
  CreditCard,
  UserPlus,
  Share2,
  Filter,
} from "lucide-react";
import { CustomerData } from "@/lib/data-service";

interface AnalyticsStats {
  totalEvents: number;
  profileViews: number;
  clicks: number;
  eventTypeBreakdown: Record<string, number>;
  recentEvents: Array<{
    id: string;
    customerId: string;
    eventType: string;
    createdAt: string;
    metadata?: unknown;
  }>;
}

export default function AnalyticsPage() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [stats, setStats] = useState<AnalyticsStats | null>(null);

  const fetchStats = (customerId?: string) => {
    const url = customerId ? `/api/analytics/stats?customerId=${customerId}` : "/api/analytics/stats";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) {
          setStats(data.stats);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        if (data.customers) {
          setCustomers(data.customers);
        }
      })
      .catch(console.error);

    fetchStats();
  }, []);

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCustomerId(val);
    fetchStats(val || undefined);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "whatsapp_click":
        return <MessageCircle className="w-4 h-4 text-emerald-400" />;
      case "call_click":
        return <Phone className="w-4 h-4 text-blue-400" />;
      case "google_review_click":
        return <Star className="w-4 h-4 text-amber-400" />;
      case "upi_click":
        return <CreditCard className="w-4 h-4 text-purple-400" />;
      case "location_click":
        return <MapPin className="w-4 h-4 text-rose-400" />;
      case "website_click":
        return <Globe className="w-4 h-4 text-cyan-400" />;
      case "instagram_click":
        return <Instagram className="w-4 h-4 text-pink-400" />;
      case "facebook_click":
        return <Facebook className="w-4 h-4 text-blue-500" />;
      case "youtube_click":
        return <Youtube className="w-4 h-4 text-red-500" />;
      case "vcard_download":
        return <UserPlus className="w-4 h-4 text-indigo-400" />;
      case "share_click":
        return <Share2 className="w-4 h-4 text-slate-300" />;
      default:
        return <Eye className="w-4 h-4 text-slate-400" />;
    }
  };

  const formatEventName = (type: string) => {
    return type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const profileViews = stats?.profileViews || 0;
  const clicks = stats?.clicks || 0;
  const convRate = profileViews > 0 ? ((clicks / profileViews) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-8">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Analytics & Events</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track engagement, button conversion metrics, and profile scan volumes.
          </p>
        </div>

        {/* Customer Filter Dropdown */}
        <div className="flex items-center gap-2 bg-[#0d1424] border border-slate-800 p-1.5 rounded-2xl">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          <select
            value={selectedCustomerId}
            onChange={handleCustomerChange}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border-none text-white text-xs font-semibold focus:outline-none"
          >
            <option value="">All Customers (Aggregate)</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} (@{c.username})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-[#0d1424] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Profile Views</span>
            <Eye className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white">{profileViews}</div>
          <p className="text-xs text-slate-500">Scanned via NFC / QR / Direct URL</p>
        </div>

        <div className="p-6 rounded-3xl bg-[#0d1424] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Action Clicks</span>
            <MousePointerClick className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white">{clicks}</div>
          <p className="text-xs text-slate-500">WhatsApp, Calls, Reviews, UPI, Links</p>
        </div>

        <div className="p-6 rounded-3xl bg-[#0d1424] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Conversion Rate</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{convRate}%</div>
          <p className="text-xs text-slate-500">Actions taken per profile view</p>
        </div>
      </div>

      {/* Breakdown and Live Stream Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Event Type Distribution */}
        <div className="lg:col-span-6 rounded-3xl bg-[#0d1424] border border-slate-800 p-6 space-y-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Action Breakdown by Type</h2>

          {stats?.eventTypeBreakdown && Object.keys(stats.eventTypeBreakdown).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.eventTypeBreakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => {
                  const pct = stats.totalEvents > 0 ? ((count / stats.totalEvents) * 100).toFixed(0) : "0";
                  return (
                    <div key={type} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 font-semibold text-slate-200">
                          {getEventIcon(type)}
                          <span>{formatEventName(type)}</span>
                        </div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{count}</span>
                          <span className="text-slate-500 text-[11px]">({pct}%)</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">No event data recorded yet.</div>
          )}
        </div>

        {/* Right: Recent Live Events Stream */}
        <div className="lg:col-span-6 rounded-3xl bg-[#0d1424] border border-slate-800 p-6 space-y-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recent Activity Stream</h2>

          {stats?.recentEvents && stats.recentEvents.length > 0 ? (
            <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
              {stats.recentEvents.map((event) => {
                const cust = customers.find((c) => c.id === event.customerId);
                return (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-800">{getEventIcon(event.eventType)}</div>
                      <div>
                        <div className="font-semibold text-slate-200">{formatEventName(event.eventType)}</div>
                        <div className="text-[11px] text-blue-400">
                          {cust ? `${cust.name} (/@${cust.username})` : "Customer Profile"}
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono">
                      {new Date(event.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">No recent events logged yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
