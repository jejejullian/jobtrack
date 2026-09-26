import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

// proxy jalan hnya untk request yang match  dengan path
export const config = {
  matcher: ["/api/jobs/:path*", "/api/users/:path*"],
};

export function proxy(request) {
  // ambil token dari cookie
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  // token ada tapi invalid/expired/palsu
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // token valid, sisipin identitas user biar route handler bisa pake
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", String(decoded.userId));

  // forward request ke route handler dengan header yang sdh dtmbahkn
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}
