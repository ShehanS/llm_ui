"use client";

import {getSession} from "next-auth/react";
import {IAgent, IAgentTool, ICommonTool, IResponseMessage, ITool} from "../data/data";
import {authenticatedFetch} from "@/app/api/fetch/fetch_client";

const API_BASE = "http://localhost:9095/api/config";

async function getAuthHeaders(isFormData = false): Promise<Record<string, string>> {
    const session = await getSession();
    const token = (session as any)?.accessToken;
    if (!token) throw new Error("No access token. Please sign in.");

    const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
    };

    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
}

export async function uploadPlugin(file: File): Promise<ITool> {
    const headers = await getAuthHeaders(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await authenticatedFetch(`${API_BASE}/tool/install`, {
        method: "POST",
        body: formData,
        headers,
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to upload plugin");

    const json: IResponseMessage<ITool> = await res.json();
    return json.data;
}

export async function fetchPlugins(): Promise<ITool[]> {
    const headers = await getAuthHeaders();

    const res = await authenticatedFetch(`${API_BASE}/tool/all`, {
        headers,
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch tools");

    const json: IResponseMessage<ITool[]> = await res.json();
    return json.data;
}

export async function fetchCommonTools(): Promise<ICommonTool[]> {
    const headers = await getAuthHeaders();

    const res = await authenticatedFetch(`${API_BASE}/common-tools`, {
        headers,
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch tools");

    const json: IResponseMessage<ICommonTool[]> = await res.json();
    return json.data;
}

export async function fetchPlugin(id: string): Promise<ITool> {
    const headers = await getAuthHeaders();

    const res = await authenticatedFetch(`${API_BASE}/tool/${id}`, {
        headers,
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch tool");

    const json: IResponseMessage<ITool> = await res.json();
    return json.data;
}

export async function fetchAgents(): Promise<IAgent[]> {
    const headers = await getAuthHeaders();

    const res = await authenticatedFetch(`${API_BASE}/agents/all`, {
        headers,
        cache: "no-cache",
    });

    if (!res.ok) throw new Error("Failed to fetch agents");

    const json: IResponseMessage<IAgent[]> = await res.json();
    return json.data;
}

export async function toggleToolDanger(toolName: string, isDangerous: boolean): Promise<void> {
    const headers = await getAuthHeaders();
    const url = `${API_BASE}/tools/${toolName}/mark-dangerous?dangerous=${isDangerous}`;

    const res = await authenticatedFetch(url, {
        method: "POST",
        headers,
    });

    if (!res.ok) throw new Error("Failed to update tool danger status");
}

export async function copyComonTool(tool: IAgentTool): Promise<void> {
    const headers = await getAuthHeaders();
    const url = `${API_BASE}/tools/copy`;

    const res = await authenticatedFetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(tool),
    });

    if (!res.ok) {
        throw new Error(`Failed to copy tool: ${await res.text()}`);
    }
}
