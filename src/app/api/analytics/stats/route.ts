import { NextResponse } from "next/server";
import { getAnalyticsStats, getAllCustomers } from "@/lib/data-service";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId") || undefined;

    const stats = await getAnalyticsStats(customerId);
    const customers = await getAllCustomers();

    return NextResponse.json({
      success: true,
      stats,
      totalCustomers: customers.length,
      activeCustomers: customers.filter((c) => c.isActive).length,
    });
  } catch (error: any) {
    console.error("Failed to fetch analytics stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
