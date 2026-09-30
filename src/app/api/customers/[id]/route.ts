import { NextResponse } from "next/server";
import { getCustomerById, updateCustomer, setCustomerStatus, getCustomerByUsername, deleteCustomer } from "@/lib/data-service";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const customer = await getCustomerById(id);
  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, customer });
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();

    const existing = await getCustomerById(id);
    if (!existing) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // If username is being changed, verify uniqueness
    if (body.username && body.username.toLowerCase().trim() !== existing.username.toLowerCase().trim()) {
      const cleanUsername = body.username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, "");
      const duplicate = await getCustomerByUsername(cleanUsername);
      if (duplicate && duplicate.id !== id) {
        return NextResponse.json(
          { error: `Username '${cleanUsername}' is already taken.` },
          { status: 409 }
        );
      }
      body.username = cleanUsername;
    }

    const updated = await updateCustomer(id, body);
    return NextResponse.json({ success: true, customer: updated });
  } catch (error: any) {
    console.error("Update customer error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update customer" }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const { isActive } = await req.json();

    const success = await setCustomerStatus(id, Boolean(isActive));
    return NextResponse.json({ success });
  } catch {
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const deleted = await deleteCustomer(id);

    return NextResponse.json({ success: deleted, message: "Customer deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
