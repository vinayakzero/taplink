"use client";

import React, { useState, useEffect } from "react";
import {
  Radio,
  Plus,
  ExternalLink,
  Sparkles,
  Zap,
} from "lucide-react";
import { CustomerData } from "@/lib/data-service";

interface NfcCard {
  id: string;
  customerId: string;
  cardUid: string;
  status: string;
  createdAt: string;
  customer?: CustomerData;
}

export default function NfcCardsPage() {
  const [cards, setCards] = useState<NfcCard[]>([]);
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);

  // New card modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [cardUid, setCardUid] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Web NFC State
  const [nfcMessage, setNfcMessage] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/nfc").then((res) => res.json()),
      fetch("/api/customers").then((res) => res.json()),
    ])
      .then(([nfcData, custData]) => {
        if (nfcData.cards) setCards(nfcData.cards);
        if (custData.customers) {
          setCustomers(custData.customers);
          if (custData.customers.length > 0) {
            setSelectedCustomerId(custData.customers[0].id);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedCustomerId || !cardUid.trim()) {
      setError("Please select a customer and enter a Card UID.");
      return;
    }

    setAdding(true);
    try {
      const res = await fetch("/api/nfc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: selectedCustomerId,
          cardUid: cardUid.trim(),
          status: "ACTIVE",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to link card");
      }

      setCards((prev) => [data.card, ...prev]);
      setShowAddModal(false);
      setCardUid("");
    } catch (err: any) {
      setError(err.message || "Failed to link card");
    } finally {
      setAdding(false);
    }
  };

  const handleWriteNfc = async (username: string) => {
    if (!("NDEFReader" in window)) {
      alert("Web NFC is only supported on Android Chrome or NFC-enabled browsers.");
      return;
    }

    try {
      setNfcMessage("Hold your NFC card near the back of your device...");
      // @ts-expect-error Web NFC API type support in browser
      const ndef = new window.NDEFReader();
      await ndef.write({
        records: [
          {
            recordType: "url",
            data: `https://taplink.in/${username}`,
          },
        ],
      });
      setNfcMessage(`✅ Successfully programmed NFC Card to https://taplink.in/${username}`);
      setTimeout(() => setNfcMessage(null), 5000);
    } catch (err: any) {
      setNfcMessage(`❌ NFC Write Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">NFC Smart Cards</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Program, pair, and track physical contactless business cards (NTAG213 / NTAG216).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Link New NFC Card</span>
        </button>
      </div>

      {/* NFC Status Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 to-[#0d1424] border border-blue-500/20 grid md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Radio className="w-4 h-4" />
            <span>NFC Hardware Standard</span>
          </div>
          <h3 className="text-lg font-bold text-white">How NFC Encoding Works</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every TapLink NFC card contains a high-speed NDEF URL record pointing to{" "}
            <span className="text-blue-400 font-mono">https://taplink.in/[username]</span>. When tapped against any
            iPhone (XR and newer) or Android device, the profile opens instantly with 0 apps required.
          </p>
        </div>

        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
          <div className="text-xs font-semibold text-slate-400">Total Cards Active</div>
          <div className="text-3xl font-black text-white">{cards.filter((c) => c.status === "ACTIVE").length}</div>
          <span className="text-[10px] text-emerald-400 font-bold">100% Operational</span>
        </div>
      </div>

      {nfcMessage && (
        <div className="p-4 rounded-2xl bg-blue-950/80 border border-blue-500 text-blue-200 text-xs font-semibold flex items-center gap-3">
          <Sparkles className="w-5 h-5 shrink-0 text-blue-400" />
          <span>{nfcMessage}</span>
        </div>
      )}

      {/* Cards Table */}
      <div className="rounded-3xl bg-[#0d1424] border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Registered NFC Cards</h2>
          <span className="text-xs text-slate-400">{cards.length} Total</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading NFC cards...</div>
        ) : cards.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Radio className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-semibold text-white">No NFC Cards Linked</p>
            <p className="text-xs text-slate-400">Click &ldquo;Link New NFC Card&rdquo; to assign a hardware UID to a customer.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 bg-slate-900/60 border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Card UID</th>
                  <th className="py-3.5 px-4 font-semibold">Assigned Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Target URL</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Direct Program</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {cards.map((card) => {
                  const customer = card.customer || customers.find((c) => c.id === card.customerId);
                  return (
                    <tr key={card.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6 font-mono text-slate-200 font-bold flex items-center gap-2">
                        <Radio className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{card.cardUid}</span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-white">
                        {customer ? (
                          <div>
                            <div>{customer.name}</div>
                            <div className="text-[11px] text-slate-400">{customer.businessName || `@${customer.username}`}</div>
                          </div>
                        ) : (
                          <span className="text-slate-500">Unassigned</span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-mono text-blue-400">
                        {customer ? (
                          <a
                            href={`/${customer.username}`}
                            target="_blank"
                            className="hover:underline flex items-center gap-1"
                          >
                            <span>taplink.in/{customer.username}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {card.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {customer && (
                          <button
                            onClick={() => handleWriteNfc(customer.username)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5 ml-auto"
                            title="Write this URL to physical tag"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>Write Tag</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Link New NFC Card */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-[#0d1424] border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">Link New NFC Card</h3>
            <p className="text-xs text-slate-400">
              Enter the unique hardware UID of your NFC chip (e.g. from NFC Tools or TagWriter app) and assign to a
              customer profile.
            </p>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateCard} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Assign to Customer Profile</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (@{c.username})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Card UID / Serial Number</label>
                <input
                  type="text"
                  required
                  value={cardUid}
                  onChange={(e) => setCardUid(e.target.value)}
                  placeholder="e.g. 04:A2:8B:1A:6F:5E:80"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold disabled:opacity-50"
                >
                  {adding ? "Linking..." : "Link NFC Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
