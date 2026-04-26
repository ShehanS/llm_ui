import NextAuth, { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions: NextAuthOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_ID!,
            clientSecret: process.env.KEYCLOAK_SECRET!,
            issuer: process.env.KEYCLOAK_ISSUER,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/api/auth/signin",
    },
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expiresAt = account.expires_at;
            }

            if (Date.now() < (token.expiresAt as number) * 1000 - 30_000) {
                return token;
            }

            try {
                const res = await fetch(
                    `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: new URLSearchParams({
                            grant_type: "refresh_token",
                            client_id: process.env.KEYCLOAK_ID!,
                            client_secret: process.env.KEYCLOAK_SECRET!,
                            refresh_token: token.refreshToken as string,
                        }),
                    }
                );

                const refreshed = await res.json();

                if (!res.ok) throw refreshed;

                return {
                    ...token,
                    accessToken: refreshed.access_token,
                    refreshToken: refreshed.refresh_token ?? token.refreshToken,
                    expiresAt: Math.floor(Date.now() / 1000) + refreshed.expires_in,
                    error: undefined,
                };
            } catch (e) {
                console.error("Keycloak token refresh failed:", e);
                return { ...token, error: "RefreshAccessTokenError" };
            }
        },

        async session({ session, token }) {
            (session as any).accessToken = token.accessToken;
            (session as any).error = token.error;
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
