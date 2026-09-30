import { NextResponse } from "next/server";
import { comparePassword, generateToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const defaultAdminEmail = (process.env.ADMIN_EMAIL || "admin@taplink.epsilon.org").toLowerCase().trim();
    const defaultAdminPassword = process.env.ADMIN_PASSWORD || "admin#1234";

    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
    } catch {
      // If DB is offline, continue to fallback check
    }

    let isValid = false;
    let userId = "user-admin-01";
    let role = "ADMIN";

    if (user) {
      isValid = await comparePassword(password, user.passwordHash);
      userId = user.id;
      role = user.role;
    } else if (cleanEmail === defaultAdminEmail && password === defaultAdminPassword) {
      isValid = true;
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = generateToken({
      userId,
      email: cleanEmail,
      role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: cleanEmail,
        role,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
