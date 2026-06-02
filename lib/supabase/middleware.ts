// lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[middleware] Missing Supabase environment variables");
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  try {
    // This is the ONLY DB call middleware should ever make.
    // It's required to refresh the session cookie — cannot be skipped.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    const isPublicPath =
      pathname === "/" ||
      pathname === "/privacy" ||
      pathname === "/terms" ||
      pathname.startsWith("/auth") ||
      pathname.startsWith("/api");

    // Unauthenticated user trying to access protected routes
    if (!user && !isPublicPath) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    if (user) {
      // Read user_type from the JWT — zero extra DB queries.
      // The auth callback (/auth/callback/route.ts) stamps this onto
      // user_metadata after OAuth, so it's always present for valid accounts.
      const userType = user.user_metadata?.user_type as string | undefined;

      // ── STUDENT ────────────────────────────────────────────────────────
      if (userType === "student") {
        // Block students from lister routes
        if (pathname.startsWith("/lister")) {
          const url = request.nextUrl.clone();
          url.pathname = "/student/dashboard";
          return NextResponse.redirect(url);
        }

        // Redirect landing page → student app
        // Profile completion is checked in app/student/layout.tsx, not here
        if (pathname === "/") {
          const url = request.nextUrl.clone();
          url.pathname = "/student/dashboard";
          return NextResponse.redirect(url);
        }
      }

      // ── LISTER ─────────────────────────────────────────────────────────
      else if (userType === "lister") {
        // Block listers from student routes
        if (
          pathname.startsWith("/student") ||
          pathname.startsWith("/onboarding")
        ) {
          const url = request.nextUrl.clone();
          url.pathname = "/lister/dashboard";
          return NextResponse.redirect(url);
        }

        // Redirect landing page → lister app
        // Profile existence is checked in app/lister/layout.tsx, not here
        if (pathname === "/") {
          const url = request.nextUrl.clone();
          url.pathname = "/lister/dashboard";
          return NextResponse.redirect(url);
        }
      }

      // ── UNKNOWN USER TYPE ───────────────────────────────────────────────
      // Only reached if user_type was never stamped (shouldn't happen in
      // normal flow). Don't sign out on public paths — might be mid-OAuth.
      else if (!isPublicPath) {
        await supabase.auth.signOut();
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }

    return supabaseResponse;
  } catch (error) {
    console.error("[middleware] Error updating session:", error);
    return supabaseResponse;
  }
}
