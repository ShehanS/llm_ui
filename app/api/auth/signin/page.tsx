"use client";

import { signIn } from "next-auth/react";
import React from "react";

export default function SignInPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
            <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-800 p-10 text-center">
                <h1 className="text-3xl font-bold">LLM Dashboard</h1>
                <p className="text-gray-400">Please sign in to access the flow editor</p>

                <button
                    onClick={() => signIn("keycloak", { callbackUrl: "/" })}
                    className="w-full rounded-md bg-white py-3 font-semibold text-black hover:bg-gray-200 transition-colors"
                >
                    Sign in with Keycloak
                </button>
            </div>
        </div>
    );
}
