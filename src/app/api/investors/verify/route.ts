import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    // Server-side password check - never exposed to client
    if (password !== process.env.INVESTOR_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("investor_access", "granted", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7200, // 2 hours
      sameSite: "strict",
      path: "/investors",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
