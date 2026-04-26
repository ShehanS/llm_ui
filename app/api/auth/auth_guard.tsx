"use client";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import React, { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated" || (session as any)?.error === "RefreshAccessTokenError") {
            signIn("keycloak");
        }
    }, [session, status]);

    if (status === "loading") {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-slate-950">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    return <>{children}</>;
}

