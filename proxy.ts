import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Define the protected route
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

// 2. Make the callback ASYNC
export default clerkMiddleware(async (auth, req) => {
  
  if (isAdminRoute(req)) {
    // 3. AWAIT the auth() call to resolve the Promise
    const { sessionClaims } = await auth();
    
    // Debug Log (Check your server terminal)
    console.log("Middleware checking role:", sessionClaims?.metadata);

    // 4. Safely check the role
    const metadata = sessionClaims?.metadata as { role?: string } | undefined;

    if (metadata?.role !== 'admin') {
      // Redirect to home if failed
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};