"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default function Auth_provider({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}
