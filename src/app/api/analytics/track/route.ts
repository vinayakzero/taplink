import { NextResponse } from "next/server";
import { trackAnalyticsEvent, getCustomerByUsername } from "@/lib/data-service";

const VALID_EVENT_TYPES = [
  "profile_view",
  "whatsapp_click",
  "call_click",
  "instagram_click",
  "facebook_click",
  "youtube_click",
  "google_review_click",
  "website_click",
  "location_click",
  "upi_click",
  "vcard_download",
  "share_click",
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerId, username, eventType, metadata } = body;

    if (!eventType || !VALID_EVENT_TYPES.includes(eventType)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    let targetCustomerId = customerId;

    if (!targetCustomerId && username) {
      const customer = await getCustomerByUsername(username);
      if (customer) {
        targetCustomerId = customer.id;
      }
    }

    if (!targetCustomerId) {
      return NextResponse.json({ error: "Customer not identified" }, { status: 400 });
    }

    await trackAnalyticsEvent(targetCustomerId, eventType, {
      ...metadata,
      userAgent: req.headers.get("user-agent")?.substring(0, 100),
      referer: req.headers.get("referer")?.substring(0, 100),
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
  }
}
