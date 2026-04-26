"use client";

import { signIn, getSession } from "next-auth/react";


export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const session = await getSession();
    const accessToken = (session as any)?.accessToken;

    const headers = {
        ...options.headers,
        "Authorization": accessToken ? `Bearer ${accessToken}` : "",
        "Content-Type": "application/json",
    };

    const response = await fetch(url, { ...options, headers });


    if (response.status === 401 || (session as any)?.error === "RefreshAccessTokenError") {
        console.warn("Unauthorized request detected (401). Redirecting to login...");

        await signIn("keycloak", {callbackUrl: window.location.href});
        return new Promise(() => {});
    }

    return response;
};
