"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
import {AuthGuard} from "@/app/api/auth/auth_guard";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return <SessionProvider><AuthGuard>{children}</AuthGuard></SessionProvider>;
}
