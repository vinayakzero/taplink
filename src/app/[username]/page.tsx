import React from "react";
import { Metadata } from "next";
import { getCustomerByUsername } from "@/lib/data-service";
import ProfileView from "@/components/ProfileView";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const customer = await getCustomerByUsername(username);

  if (!customer || !customer.isActive) {
    return {
      title: `Profile Not Found — TapLink`,
      description: "The requested TapLink profile is not available.",
    };
  }

  const title = customer.businessName
    ? `${customer.name} (${customer.businessName}) — TapLink`
    : `${customer.name} — TapLink`;

  return {
    title,
    description: customer.bio || `Connect with ${customer.name} on TapLink NFC & QR Profile.`,
    openGraph: {
      title,
      description: customer.bio || `Connect with ${customer.name} on TapLink.`,
      url: `https://taplink.in/${customer.username}`,
      images: customer.profileImage ? [{ url: customer.profileImage }] : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description: customer.bio || `Connect with ${customer.name} on TapLink.`,
      images: customer.profileImage ? [customer.profileImage] : undefined,
    },
  };
}

export default async function CustomerProfilePage({ params }: Props) {
  const { username } = await params;
  const customer = await getCustomerByUsername(username);

  if (!customer) {
    return (
      <div className="min-h-screen bg-[#070a13] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-[#0d1424] border border-slate-800 p-8 rounded-3xl space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Profile Not Found</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The TapLink profile for <span className="text-blue-400 font-mono">@{username}</span> does not exist or may have been moved.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to TapLink</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!customer.isActive) {
    return (
      <div className="min-h-screen bg-[#070a13] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-[#0d1424] border border-slate-800 p-8 rounded-3xl space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Profile Inactive</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            This profile is currently paused or inactive by the owner. Please check back later.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to TapLink</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <ProfileView customer={customer} />;
}
