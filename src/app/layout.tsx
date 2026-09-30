import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TapLink — One Tap. Everything Connected.",
  description: "TapLink is an NFC + QR digital business profile platform. Connect customers to WhatsApp, social media, Google Reviews, location, and payment through one tap.",
  keywords: ["TapLink", "NFC business card", "digital profile", "QR code", "WhatsApp link", "UPI payment", "digital business card"],
  authors: [{ name: "TapLink" }],
  openGraph: {
    title: "TapLink — One Tap. Everything Connected.",
    description: "Connect customers to WhatsApp, social media, Google Reviews, website, location, and payment with one tap.",
    url: "https://taplink.in",
    siteName: "TapLink",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TapLink — One Tap. Everything Connected.",
    description: "NFC + QR digital business profiles for modern professionals and businesses.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0b0f19",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0b0f19] text-gray-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
