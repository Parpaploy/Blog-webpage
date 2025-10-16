import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);

  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      console.log("❌ No token found, redirecting to:", loginUrl.toString());
      return NextResponse.redirect(loginUrl);
    }

    const response = await fetch(
      `${process.env.STRAPI_INTERNAL_URL}/api/users/me?populate=*`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("🌐 Strapi response status:", response.status);

    if (!response.ok) {
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("token");
      res.cookies.delete("user");
      return res;
    }

    const user = await response.json();
    const res = NextResponse.next();

    res.cookies.set("user", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res;
  } catch (error) {
    console.log("💥 Middleware error:", error);

    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete("token");
    res.cookies.delete("user");
    return res;
  }
}

export const config = {
  matcher: ["/subscribe-blogs/:id", "/add-blog", "/add-blog/:path*"],
};
