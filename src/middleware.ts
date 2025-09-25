import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("✅ Middleware triggered on:", request.nextUrl.pathname);

  try {
    const token = request.cookies.get("token");
    console.log("token:", token?.value);

    let response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/users/me`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Login Fail");
    }

    const responseJSON = await response.json();

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("users", JSON.stringify({ email: responseJSON.email }));

    console.log("responJSON:", responseJSON);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.log("error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: "/subscribe-blogs/:path*",
};
