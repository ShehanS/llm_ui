"use client";

import React, { useState } from "react";
import Script from "next/script";

type GoogleAuthProps = {
    node: any;
    onChange: (propName: string, value: any) => void;
};

export const GoogleAuth: React.FC<GoogleAuthProps> = ({ node, onChange }) => {
    const [isLoading, setIsLoading] = useState(false);

    const clientId = node?.data?.inputProps?.find((p: any) => p.name === "clientId")?.value;
    const isConnected = node?.data?.authStatus === "CONNECTED";

    const SCOPES = "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email";

    const handleAuth = () => {
        if (!clientId) {
            alert("Missing Client ID in Node Settings");
            return;
        }

        setIsLoading(true);

        try {
            const client = window.google.accounts.oauth2.initCodeClient({
                client_id: clientId,
                scope: SCOPES,
                ux_mode: "popup",
                prompt: "consent",
                select_account: true,
                callback: (response: any) => {
                    if (response.code) {
                        onChange("googleAuthCode", response.code);
                        onChange("authStatus", "CONNECTED"); // mark as connected
                    } else {
                        console.error("No auth code received", response);
                    }
                    setIsLoading(false);
                },
                error_callback: (err: any) => {
                    console.error("Auth Error:", err);
                    setIsLoading(false);
                },
            });

            client.requestCode();
        } catch (error) {
            console.error("SDK Load Error:", error);
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        onChange("googleAuthCode", null);
        onChange("authStatus", "IDLE");
    };

    return (
        <div className="flex flex-col gap-3 p-4 border border-gray-700 rounded-xl bg-gray-900/60 backdrop-blur-md shadow-lg">
            <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />

            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-gray-600"}`} />
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Backend Access</span>
                </div>
                <div className="text-[9px] text-blue-500 font-mono">OAuth 2.0</div>
            </div>

            <button
                onClick={handleAuth}
                disabled={isLoading || !clientId || isConnected}
                className={`flex items-center justify-center gap-3 px-4 py-3 rounded-lg border transition-all active:scale-95
                    ${isConnected
                    ? "border-green-500/30 bg-green-500/10 text-green-400 cursor-not-allowed opacity-70"
                    : "border-gray-700 bg-gray-800 hover:border-blue-500/50 text-white"}`}
            >
                {isLoading ? (
                    <div className="w-4 h-4 border-2 border-t-transparent border-blue-400 rounded-full animate-spin" />
                ) : (
                    <span className="text-lg font-bold">G</span>
                )}
                <span className="text-[10px] font-black uppercase tracking-wider">
                    {isConnected ? "Backend Linked" : "Authorize Java Node"}
                </span>
            </button>

            {isConnected && (
                <div className="text-center">
                    <p className="text-[9px] text-gray-500 italic">
                        Refresh token stored on backend. Re-auth not needed.
                    </p>
                    <button
                        onClick={handleReset}
                        className="text-[8px] text-red-500 uppercase mt-1 hover:underline"
                    >
                        Reset Auth
                    </button>
                </div>
            )}
        </div>
    );
};
