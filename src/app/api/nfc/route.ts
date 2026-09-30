import { NextResponse } from "next/server";
import { getAllNfcCards, createNfcCard, getCustomerById } from "@/lib/data-service";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const cards = await getAllNfcCards();
    return NextResponse.json({ success: true, cards });
  } catch {
    return NextResponse.json({ error: "Failed to fetch NFC cards" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { customerId, cardUid, status } = await req.json();

    if (!customerId || !cardUid) {
      return NextResponse.json(
        { error: "Customer ID and Card UID are required" },
        { status: 400 }
      );
    }

    const customer = await getCustomerById(customerId);
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const card = await createNfcCard(customerId, cardUid.trim(), status || "ACTIVE");
    return NextResponse.json({ success: true, card }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to link NFC card" }, { status: 500 });
  }
}
