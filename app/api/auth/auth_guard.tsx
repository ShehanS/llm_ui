"use client";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const error = useSearchParams().get("error");

    useEffect(() => {
        if (status === "loading" || pathname === "/signin" || error) return;

        if (status === "unauthenticated" || (session as any)?.error === "RefreshAccessTokenError") {
            signIn("keycloak");
        }
    }, [status, pathname, session, error]);

    if (status === "loading") {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-black">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    return <>{children}</>;
}
