export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        /*
         * Match all paths except:
         * 1. /api/auth (NextAuth internal routes)
         * 2. /_next (Next.js internals like static files)
         * 3. /fonts, /images, favicon.ico (Public assets)
         */
        "/((?!api/auth|_next|fonts|images|favicon.ico).*)",
    ],
};
