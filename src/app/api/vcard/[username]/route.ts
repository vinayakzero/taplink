import { NextResponse } from "next/server";
import { getCustomerByUsername, trackAnalyticsEvent } from "@/lib/data-service";
import { generateVCard } from "@/lib/vcard";

export async function GET(req: Request, context: { params: Promise<{ username: string }> }) {
  const { username } = await context.params;
  const customer = await getCustomerByUsername(username);

  if (!customer || !customer.isActive) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Track vCard download event
  await trackAnalyticsEvent(customer.id, "vcard_download");

  const vCardContent = generateVCard({
    name: customer.name,
    businessName: customer.businessName,
    phone: customer.phone,
    whatsapp: customer.whatsapp,
    websiteUrl: customer.websiteUrl,
    bio: customer.bio,
    profileUrl: `https://taplink.in/${customer.username}`,
  });

  const filename = `${customer.username}.vcf`;

  return new NextResponse(vCardContent, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-cache",
    },
  });
}
