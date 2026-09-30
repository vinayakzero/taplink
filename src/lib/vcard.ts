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
  const nameParts = options.name.trim().split(/\s+/);
  const firstName = nameParts[0] || options.name;
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  // Standard vCard 3.0 specification for iOS & Android address books
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${lastName};${firstName};;;`,
    `FN:${options.name}`,
  ];

  if (options.businessName) {
    lines.push(`ORG:${options.businessName}`);
    lines.push(`TITLE:${options.businessName}`);
  }

  const primaryPhone = options.phone || options.whatsapp;
  if (primaryPhone) {
    const cleanPhone = primaryPhone.replace(/[^0-9+]/g, "");
    const formattedPhone = cleanPhone.startsWith("+")
      ? cleanPhone
      : cleanPhone.length === 10
      ? `+91${cleanPhone}`
      : `+${cleanPhone}`;

    lines.push(`TEL;TYPE=CELL,VOICE,PREF:${formattedPhone}`);
  }

  if (options.whatsapp && options.whatsapp !== options.phone) {
    const cleanWa = options.whatsapp.replace(/[^0-9+]/g, "");
    const formattedWa = cleanWa.startsWith("+")
      ? cleanWa
      : cleanWa.length === 10
      ? `+91${cleanWa}`
      : `+${cleanWa}`;

    lines.push(`TEL;TYPE=WORK,VOICE:${formattedWa}`);
  }

  if (options.email) {
    lines.push(`EMAIL;TYPE=INTERNET,HOME:${options.email.trim()}`);
  }

  if (options.profileUrl) {
    lines.push(`URL;TYPE=WORK:${options.profileUrl}`);
  } else if (options.websiteUrl) {
    lines.push(`URL;TYPE=WORK:${options.websiteUrl}`);
  }

  if (options.bio) {
    lines.push(`NOTE:${options.bio.replace(/\r?\n/g, " ")}`);
  }

  lines.push("END:VCARD");
  return lines.join("\r\n") + "\r\n";
}
