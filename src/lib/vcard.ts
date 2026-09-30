export interface VCardOptions {
  name: string;
  businessName?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  websiteUrl?: string | null;
  bio?: string | null;
  profileUrl?: string | null;
}

export function generateVCard(options: VCardOptions): string {
  const parts = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${options.name}`,
  ];

  if (options.businessName) {
    parts.push(`ORG:${options.businessName}`);
  }

  if (options.phone) {
    const cleanPhone = options.phone.replace(/[^0-9+]/g, "");
    parts.push(`TEL;TYPE=CELL,VOICE:${cleanPhone}`);
  }

  if (options.whatsapp && options.whatsapp !== options.phone) {
    const cleanWa = options.whatsapp.replace(/[^0-9+]/g, "");
    parts.push(`TEL;TYPE=WORK,VOICE:${cleanWa}`);
  }

  if (options.email) {
    parts.push(`EMAIL;TYPE=INTERNET,HOME:${options.email}`);
  }

  if (options.websiteUrl) {
    parts.push(`URL;TYPE=WORK:${options.websiteUrl}`);
  }

  if (options.profileUrl) {
    parts.push(`URL;TYPE=TapLink Profile:${options.profileUrl}`);
  }

  if (options.bio) {
    parts.push(`NOTE:${options.bio.replace(/\n/g, "\\n")}`);
  }

  parts.push("END:VCARD");
  return parts.join("\r\n");
}
