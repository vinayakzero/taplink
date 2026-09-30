import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitize phone number to standard international format with digits only
 */
export function sanitizePhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // If Indian number without country code (10 digits), prepend 91
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

/**
 * Generate dynamic WhatsApp click-to-chat URL
 */
export function generateWhatsAppUrl(phone: string, message?: string | null): string {
  const cleanPhone = sanitizePhoneNumber(phone);
  let url = `https://wa.me/${cleanPhone}`;
  if (message && message.trim().length > 0) {
    url += `?text=${encodeURIComponent(message.trim())}`;
  }
  return url;
}

/**
 * Generate tel: URL for direct dialing
 */
export function generateTelUrl(phone: string): string {
  const cleanDigits = phone.replace(/[^0-9+]/g, "");
  if (!cleanDigits.startsWith("+") && cleanDigits.length === 10) {
    return `tel:+91${cleanDigits}`;
  }
  if (!cleanDigits.startsWith("+")) {
    return `tel:+${cleanDigits}`;
  }
  return `tel:${cleanDigits}`;
}

/**
 * Generate standard UPI payment link (UPI URI Scheme)
 */
export function generateUpiPaymentUrl(upiId: string, payeeName?: string | null, note?: string): string {
  const cleanUpi = upiId.trim();
  const name = payeeName?.trim() || "TapLink Merchant";
  const params = new URLSearchParams({
    pa: cleanUpi,
    pn: name,
    cu: "INR",
  });
  if (note) {
    params.append("tn", note);
  }
  return `upi://pay?${params.toString()}`;
}

/**
 * Ensure URL has proper https:// protocol
 */
export function normalizeUrl(url: string | null | undefined): string | null {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Format Instagram URL / handle
 */
export function formatInstagramUrl(input: string | null | undefined): string | null {
  if (!input || !input.trim()) return null;
  const clean = input.trim();
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }
  const handle = clean.replace(/^@/, "");
  return `https://instagram.com/${handle}`;
}

/**
 * Get base application URL
 */
export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "https://taplink.in";
}
