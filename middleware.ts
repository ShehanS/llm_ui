export { default } from "next-auth/middleware";

export const config = {
    matcher: ["/api/config/:path*", "/((?!api/auth|_next/static|_next/image|favicon.ico).*)"]
};
