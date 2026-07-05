import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token as any;
    const isAdmin = token?.isAdmin;
    // Extra safety net in case the session callback hasn't hydrated isAdmin yet:
    const email = (token?.email || "").toLowerCase();
    const allowlist = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase());

    if (!isAdmin && !allowlist.includes(email)) {
      return NextResponse.redirect(new URL("/admin/login?denied=1", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // must at least be signed in
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

// Protect everything under /admin EXCEPT the login page itself.
// (Write APIs like POST/PUT/DELETE on /api/products check the
// session themselves so that public GET requests still work.)
export const config = {
  matcher: ["/admin/((?!login).*)"],
};
