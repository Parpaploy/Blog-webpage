import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    console.log("🔑 Middleware token:", token);

    if (!token) {
      console.log("❌ No token found, redirecting...");
      return NextResponse.redirect(new URL("/", request.url));
    }

    const response = await fetch(
      `${process.env.STRAPI_INTERNAL_URL}/api/users/me?populate=*`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("🌐 Strapi response status:", response.status);

    if (!response.ok) {
      const res = NextResponse.redirect(new URL("/", request.url));
      res.cookies.delete("token");
      res.cookies.delete("user");
      return res;
    }
    const user = await response.json();
    console.log("✅ User from Strapi:", user);

    const res = NextResponse.next();

    res.cookies.set("user", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res;
  } catch (error) {
    console.log("💥 Middleware error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: "/subscribe-blogs/:path*",
};
