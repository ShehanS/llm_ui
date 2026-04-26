"use client";

import { getSession } from "next-auth/react";
import {IAgent, IAgentTool, IMainConfig, IResponseMessage, IRoutingConfig} from "@/app/data/data";

const API_BASE = "http://localhost:9095/api/config";

async function getAuthHeaders(existingHeaders: Record<string, string> = {}): Promise<Record<string, string>> {
    const session = await getSession();
    const token = (session as any)?.accessToken;
    if (!token) throw new Error("No access token. Please sign in.");
    return { ...existingHeaders, "Authorization": `Bearer ${token}` };
}

export async function getFullConfigByRouteName(routeName: string): Promise<IMainConfig> {
    const res = await fetch(`${API_BASE}/full/${routeName}`, { cache: "no-store", headers: await getAuthHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json() as IResponseMessage<IMainConfig>).data;
}

export async function getRoutingConfigs(): Promise<IRoutingConfig[]> {
    const res = await fetch(`${API_BASE}/routing-agents/all`, { cache: "no-store", headers: await getAuthHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json() as IResponseMessage<IRoutingConfig[]>).data;
}

export async function getRoutingConfig(routeName: string): Promise<IRoutingConfig> {
    const res = await fetch(`${API_BASE}/routing-agents/${routeName}`, { cache: "no-store", headers: await getAuthHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json() as IResponseMessage<IRoutingConfig>).data;
}

export async function saveRoutingConfig(config: Partial<IRoutingConfig>): Promise<IRoutingConfig> {
    const res = await fetch(`${API_BASE}/routing-agents`, {
        method: config.id ? "PUT" : "POST",
        headers: await getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(config),
    });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json() as IResponseMessage<IRoutingConfig>).data;
}

export async function deleteRoutingConfig(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/routing-agents/${id}`, { method: "DELETE", headers: await getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to delete routing configuration");
}

export async function getAllAgents(): Promise<IAgent[]> {
    const res = await fetch(`${API_BASE}/agents`, { cache: "no-store", headers: await getAuthHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json() as IResponseMessage<IAgent[]>).data;
}

export async function addAgent(agent: any): Promise<IAgent> {
    const res = await fetch(`${API_BASE}/agents`, {
        method: "POST",
        headers: await getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(agent),
    });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json() as IResponseMessage<IAgent>).data;
}

export async function updateAgent(id: number, agent: any): Promise<IAgent> {
    const res = await fetch(`${API_BASE}/agents/${id}`, {
        method: "PUT",
        headers: await getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(agent),
    });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json() as IResponseMessage<IAgent>).data;
}

export async function deleteAgent(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/agents/${id}`, { method: "DELETE", headers: await getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to delete agent");
}

export async function getAllTools(): Promise<IAgentTool[]> {
    const res = await fetch(`${API_BASE}/tools`, { cache: "no-store", headers: await getAuthHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json() as IResponseMessage<IAgentTool[]>).data;
}

export async function addTool(tool: any): Promise<IAgentTool> {
    const res = await fetch(`${API_BASE}/tools`, {
        method: "POST",
        headers: await getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(tool),
    });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json() as IResponseMessage<IAgentTool>).data;
}

export async function updateTool(id: number, tool: IAgentTool): Promise<IAgentTool> {
    const res = await fetch(`${API_BASE}/tools/${id}`, {
        method: "PUT",
        headers: await getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(tool),
    });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json() as IResponseMessage<IAgentTool>).data;
}

export async function deleteTool(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/tools/${id}`, { method: "DELETE", headers: await getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to delete tool");
}

export async function linkToolToAgent(agentId: number, toolName: string): Promise<void> {
    const res = await fetch(`${API_BASE}/link/${agentId}/${toolName}`, { method: "POST", headers: await getAuthHeaders() });
    if (!res.ok) throw new Error("Linking failed");
}

export async function unlinkToolFromAgent(agentId: number, toolName: string): Promise<void> {
    const res = await fetch(`${API_BASE}/unlink/${agentId}/${toolName}`, { method: "DELETE", headers: await getAuthHeaders() });
    if (!res.ok) throw new Error("Unlinking failed");
}

export async function linkAgentToRoute(routeId: number, agentId: number): Promise<void> {
    const res = await fetch(`${API_BASE}/routing-agents/${routeId}/link-agent/${agentId}`, { method: "POST", headers: await getAuthHeaders() });
    if (!res.ok) throw new Error("Agent linking failed");
}

export async function unlinkAgentFromRoute(routeId: number, agentId: number): Promise<void> {
    const res = await fetch(`${API_BASE}/routing-agents/${routeId}/unlink-agent/${agentId}`, { method: "DELETE", headers: await getAuthHeaders() });
    if (!res.ok) throw new Error("Agent unlinking failed");
}

export async function reloadAIService(): Promise<any> {
    const res = await fetch(`http://localhost:8500/api/v1/reload`, { method: "POST", headers: await getAuthHeaders() });
    if (!res.ok) throw new Error("AI Service reload failed");
    return res.json();
}
