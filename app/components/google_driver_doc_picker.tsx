"use client";

import React, { useState } from "react";

const SCOPES = "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly";

type GoogleDriveDocPickerProps = {
    node: any;
    onChange: (propName: string, value: any) => void;
};

export const GoogleDriveDocPicker: React.FC<GoogleDriveDocPickerProps> = ({ node, onChange }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [activeTab, setActiveTab] = useState<"folder" | "doc">("folder");

    const clientId = node?.data?.inputProps?.find((p: any) => p.name === "clientId")?.value;
    const apiKey = node?.data?.inputProps?.find((p: any) => p.name === "apiKey")?.value;

    const targetName = node?.data?.targetName;
    const targetUrl = node?.data?.targetUrl;
    const existingDocName = node?.data?.existingDocName;
    const existingDocUrl = node?.data?.existingDocUrl;

    const executeCreateFolder = async (accessToken: string) => {
        if (!newFolderName.trim()) return;
        try {
            const response = await fetch("https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newFolderName,
                    mimeType: "application/vnd.google-apps.folder",
                }),
            });
            const data = await response.json();
            if (data.id) {
                onChange("googleDriver", data.id);
                setIsCreating(false);
                setNewFolderName("");
            }
        } catch (err) {
            console.error("Creation failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAuth = (action: "browse" | "create" | "browseDoc") => {
        if (!clientId || !apiKey) {
            alert("Please configure Client ID and API Key.");
            return;
        }

        setIsLoading(true);
        const client = window.google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: SCOPES,
            callback: (response: any) => {
                if (response.access_token) {
                    if (action === "browse") {
                        window.gapi.load("picker", { callback: () => openFolderPicker(response.access_token) });
                    } else if (action === "browseDoc") {
                        window.gapi.load("picker", { callback: () => openDocPicker(response.access_token) });
                    } else {
                        executeCreateFolder(response.access_token);
                    }
                } else {
                    setIsLoading(false);
                }
            },
        });
        client.requestAccessToken();
    };

    const openFolderPicker = (accessToken: string) => {
        try {
            const docsView = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS)
                .setParent("root")
                .setIncludeFolders(true)
                .setSelectFolderEnabled(true);

            const picker = new window.google.picker.PickerBuilder()
                .addView(docsView)
                .setOAuthToken(accessToken)
                .setDeveloperKey(apiKey)
                .setSelectableMimeTypes("application/vnd.google-apps.folder")
                .enableFeature(window.google.picker.Feature.SUPPORT_DRIVES)
                .setCallback((data: any) => {
                    if (data.action === window.google.picker.Action.PICKED) {
                        const doc = data.docs[0];
                        onChange("googleDriver", doc.id);
                    }
                    if (data.action === "cancel" || data.action === "picked") {
                        setIsLoading(false);
                    }
                })
                .build();

            picker.setVisible(true);
        } catch (err) {
            console.error("Picker Error:", err);
            setIsLoading(false);
        }
    };

    const openDocPicker = (accessToken: string) => {
        try {
            const docsView = new window.google.picker.DocsView(window.google.picker.ViewId.DOCUMENTS)
                .setIncludeFolders(false)
                .setSelectFolderEnabled(false);

            const picker = new window.google.picker.PickerBuilder()
                .addView(docsView)
                .setOAuthToken(accessToken)
                .setDeveloperKey(apiKey)
                .setSelectableMimeTypes("application/vnd.google-apps.document")
                .enableFeature(window.google.picker.Feature.SUPPORT_DRIVES)
                .setCallback((data: any) => {
                    if (data.action === window.google.picker.Action.PICKED) {
                        const doc = data.docs[0];
                        onChange("existingDocId", doc.id);
                        onChange("existingDocName", doc.name);
                        onChange("existingDocUrl", doc.url);
                    }
                    if (data.action === "cancel" || data.action === "picked") {
                        setIsLoading(false);
                    }
                })
                .build();

            picker.setVisible(true);
        } catch (err) {
            console.error("Doc Picker Error:", err);
            setIsLoading(false);
        }
    };

    const handleClearDoc = () => {
        onChange("existingDocId", null);
        onChange("existingDocName", null);
        onChange("existingDocUrl", null);
    };

    return (
        <div className="flex flex-col gap-4 p-4 border border-gray-700 rounded-xl bg-gray-900/60 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">Drive Target</span>
                {targetUrl && (
                    <a href={targetUrl} target="_blank" rel="noreferrer" className="text-[9px] text-gray-500 hover:text-blue-400">
                        VIEW ↗
                    </a>
                )}
            </div>

            <div className="flex gap-1 p-1 bg-gray-800/60 rounded-lg">
                <button
                    onClick={() => setActiveTab("folder")}
                    className={`flex-1 text-[9px] font-black uppercase tracking-wider py-1.5 rounded-md transition-all ${
                        activeTab === "folder" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                    }`}
                >
                    📂 Folder
                </button>
                <button
                    onClick={() => setActiveTab("doc")}
                    className={`flex-1 text-[9px] font-black uppercase tracking-wider py-1.5 rounded-md transition-all ${
                        activeTab === "doc" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                    }`}
                >
                    📄 Existing Doc
                </button>
            </div>

            {activeTab === "folder" && (
                <>
                    {!isCreating ? (
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleAuth("browse")}
                                disabled={isLoading}
                                className="flex flex-col items-center gap-1 p-3 rounded-lg border border-gray-700 bg-gray-800/40 hover:border-blue-500/50 transition-all"
                            >
                                <span className="text-xl">📂</span>
                                <span className="text-[10px] uppercase font-bold text-gray-400 text-center">Select Folder</span>
                            </button>
                            <button
                                onClick={() => setIsCreating(true)}
                                disabled={isLoading}
                                className="flex flex-col items-center gap-1 p-3 rounded-lg border border-gray-700 bg-gray-800/40 hover:border-green-500/50 transition-all"
                            >
                                <span className="text-xl">➕</span>
                                <span className="text-[10px] uppercase font-bold text-gray-400 text-center">New Folder</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <input
                                autoFocus
                                className="w-full bg-gray-950 border border-gray-700 rounded px-2 py-2 text-xs text-white outline-none focus:border-blue-500"
                                placeholder="Folder name..."
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <button onClick={() => handleAuth("create")} className="flex-1 text-[10px] font-bold bg-green-600 py-2 rounded uppercase tracking-wider">Confirm</button>
                                <button onClick={() => setIsCreating(false)} className="flex-1 text-[10px] font-bold bg-gray-700 py-2 rounded uppercase tracking-wider">Cancel</button>
                            </div>
                        </div>
                    )}

                    {targetName && (
                        <div className="p-3 rounded-lg border border-blue-500/20 bg-blue-500/5 flex flex-col gap-1">
                            <span className="text-[8px] font-black text-blue-500 uppercase tracking-tighter">Target Folder</span>
                            <span className="text-xs text-gray-100 truncate font-medium">{targetName}</span>
                        </div>
                    )}
                </>
            )}

            {activeTab === "doc" && (
                <>
                    {existingDocName ? (
                        <div className="p-3 rounded-lg border border-green-500/20 bg-green-500/5 flex flex-col gap-2">
                            <span className="text-[8px] font-black text-green-500 uppercase tracking-tighter">Selected Document</span>
                            <span className="text-xs text-gray-100 truncate font-medium">{existingDocName}</span>
                            <div className="flex gap-2 mt-1">
                                {existingDocUrl && (
                                    <a href={existingDocUrl} target="_blank" rel="noreferrer" className="flex-1 text-center text-[9px] font-bold border border-gray-600 py-1.5 rounded uppercase tracking-wider text-gray-300 hover:border-blue-500/50">
                                        View ↗
                                    </a>
                                )}
                                <button
                                    onClick={handleClearDoc}
                                    className="flex-1 text-[9px] font-bold bg-red-600/20 border border-red-500/30 text-red-400 py-1.5 rounded uppercase tracking-wider hover:bg-red-600/30"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => handleAuth("browseDoc")}
                            disabled={isLoading}
                            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-dashed border-gray-600 bg-gray-800/20 hover:border-blue-500/50 transition-all"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-t-transparent border-blue-400 rounded-full animate-spin" />
                            ) : (
                                <span className="text-2xl">📄</span>
                            )}
                            <span className="text-[10px] uppercase font-bold text-gray-400">Select Existing Doc</span>
                            <span className="text-[8px] text-gray-600 text-center">Content will be replaced on each run</span>
                        </button>
                    )}
                </>
            )}
        </div>
    );
};
