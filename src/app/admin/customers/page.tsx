"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  UserPlus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  QrCode,
  Check,
  Copy,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface Customer {
  id: string;
  username: string;
  name: string;
  businessName?: string | null;
  bio?: string | null;
  profileImage?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  upiId?: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [selectedQrCustomer, setSelectedQrCustomer] = useState<Customer | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/customers");
      const data = await res.json();
      if (data.customers) {
        setCustomers(data.customers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: !currentStatus } : c))
        );
      }
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete customer "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCustomers((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const handleCopyLink = (username: string, id: string) => {
    const url = `${window.location.origin}/${username}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.businessName && c.businessName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter === "ACTIVE") return c.isActive;
    if (statusFilter === "INACTIVE") return !c.isActive;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Customer Profiles</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage customer NFC profiles, toggle activation, and preview QR codes.
          </p>
        </div>

        <Link
          href="/admin/customers/new"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Customer</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0d1424] border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, business, or username..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Status Segment Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 self-start sm:self-auto">
          {(["ALL", "ACTIVE", "INACTIVE"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === tab
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table / List */}
      <div className="rounded-3xl bg-[#0d1424] border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading customer profiles...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-semibold text-white">No customers found</p>
            <p className="text-xs text-slate-400">Try adjusting your search or add a new customer profile.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 bg-slate-900/60 border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">TapLink URL</th>
                  <th className="py-3.5 px-4 font-semibold">Contact Info</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Customer Name & Business */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                          {customer.profileImage ? (
                            <Image
                              src={customer.profileImage}
                              alt={customer.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-sm">
                              {customer.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-200 text-sm">{customer.name}</div>
                          <div className="text-slate-400 text-xs">{customer.businessName || "Personal"}</div>
                        </div>
                      </div>
                    </td>

                    {/* TapLink URL */}
                    <td className="py-4 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/${customer.username}`}
                          target="_blank"
                          className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>/{customer.username}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          onClick={() => handleCopyLink(customer.username, customer.id)}
                          className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                          title="Copy Link"
                        >
                          {copiedId === customer.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-4 px-4 text-slate-300">
                      <div>{customer.phone || customer.whatsapp || "No phone set"}</div>
                      {customer.upiId && <div className="text-[11px] font-mono text-blue-300">{customer.upiId}</div>}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStatus(customer.id, customer.isActive)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          customer.isActive
                            ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25"
                            : "bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700"
                        }`}
                        title="Click to toggle status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            customer.isActive ? "bg-emerald-400" : "bg-slate-500"
                          }`}
                        />
                        <span>{customer.isActive ? "Active" : "Inactive"}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedQrCustomer(customer)}
                          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="View QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/admin/customers/${customer.id}/edit`}
                          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Edit Customer"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(customer.id, customer.name)}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Code Quick Modal */}
      {selectedQrCustomer && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedQrCustomer(null)}
        >
          <div
            className="bg-[#0d1424] border border-slate-700 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">{selectedQrCustomer.name}</h3>
            <p className="text-xs text-slate-400">Scan to open TapLink profile</p>

            <div className="p-4 bg-white rounded-2xl inline-block mx-auto shadow-xl">
              <QRCodeSVG
                value={`${typeof window !== "undefined" ? window.location.origin : "https://taplink.in"}/${
                  selectedQrCustomer.username
                }`}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="text-xs font-mono text-blue-400 bg-slate-900 py-2 px-3 rounded-xl border border-slate-800 truncate">
              https://taplink.in/{selectedQrCustomer.username}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleCopyLink(selectedQrCustomer.username, selectedQrCustomer.id)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                {copiedId === selectedQrCustomer.id ? "Copied Link!" : "Copy Link"}
              </button>
              <button
                onClick={() => setSelectedQrCustomer(null)}
                className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
