"use client";
import { signIn } from "next-auth/react";
import React from "react";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
            <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-800 p-10 text-center">
                <h1 className="text-3xl font-bold">LLM Dashboard</h1>
                {error && (
                    <div className="bg-red-500/20 text-red-400 p-3 rounded border border-red-500/50 text-sm">
                        Authentication Failed: {error}. <br/>
                        Check if your Keycloak Realm name is correct.
                    </div>
                )}
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
