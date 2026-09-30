import { NextResponse } from "next/server";
import { getAllCustomers, createCustomer, getCustomerByUsername } from "@/lib/data-service";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const customers = await getAllCustomers();
    return NextResponse.json({ success: true, customers });
  } catch (error: any) {
    console.error("Failed to fetch customers:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      businessName,
      username,
      profileImage,
      bio,
      phone,
      whatsapp,
      whatsappMessage,
      instagramUrl,
      facebookUrl,
      youtubeUrl,
      websiteUrl,
      googleReviewUrl,
      locationUrl,
      upiId,
      isActive = true,
    } = body;

    if (!name || !username) {
      return NextResponse.json(
        { error: "Name and Username are required fields." },
        { status: 400 }
      );
    }

    // Clean username (alphanumeric and hyphens only)
    const cleanUsername = username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, "");
    if (!cleanUsername) {
      return NextResponse.json(
        { error: "Username contains invalid characters. Use letters, numbers, hyphens, and underscores." },
        { status: 400 }
      );
    }

    // Check if username is already taken
    const existing = await getCustomerByUsername(cleanUsername);
    if (existing) {
      return NextResponse.json(
        { error: `The username '${cleanUsername}' is already taken. Please choose another.` },
        { status: 409 }
      );
    }

    const created = await createCustomer({
      userId: session.userId,
      username: cleanUsername,
      name: name.trim(),
      businessName: businessName?.trim() || null,
      bio: bio?.trim() || null,
      profileImage: profileImage?.trim() || null,
      phone: phone?.trim() || null,
      whatsapp: whatsapp?.trim() || null,
      whatsappMessage: whatsappMessage?.trim() || null,
      instagramUrl: instagramUrl?.trim() || null,
      facebookUrl: facebookUrl?.trim() || null,
      youtubeUrl: youtubeUrl?.trim() || null,
      websiteUrl: websiteUrl?.trim() || null,
      googleReviewUrl: googleReviewUrl?.trim() || null,
      locationUrl: locationUrl?.trim() || null,
      upiId: upiId?.trim() || null,
      isActive: Boolean(isActive),
    });

    return NextResponse.json({ success: true, customer: created }, { status: 201 });
  } catch (error: any) {
    console.error("Create customer error:", error);
    return NextResponse.json({ error: error.message || "Failed to create customer" }, { status: 500 });
  }
}
