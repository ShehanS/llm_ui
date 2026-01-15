import {IAgent, IMainConfig, IResponseMessage, ITool} from "@/app/data/data";

const API_BASE = "http://localhost:8080/service/api/config";

// --- CONFIGURATION ---

export async function getFullConfig(): Promise<IMainConfig> {
    const res = await fetch(`${API_BASE}/full`, {cache: "no-store"});
    if (!res.ok) throw new Error(await res.text());
    const json: IResponseMessage<IMainConfig> = await res.json();
    return json.data;
}

// --- AGENT APIS ---

export async function getAllAgents(): Promise<IAgent[]> {
    const res = await fetch(`${API_BASE}/agents`, {cache: "no-store"});
    if (!res.ok) throw new Error(await res.text());
    const json: IResponseMessage<IAgent[]> = await res.json();
    return json.data;
}

export async function addAgent(agent: any): Promise<IAgent> {
    const res = await fetch(`${API_BASE}/agents`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(agent),
    });
    if (!res.ok) throw new Error(await res.text());
    const json: IResponseMessage<IAgent> = await res.json();
    return json.data;
}

export async function updateAgent(id: number, agent: any): Promise<IAgent> {
    const res = await fetch(`${API_BASE}/agents/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(agent),
    });
    if (!res.ok) throw new Error(await res.text());
    const json: IResponseMessage<IAgent> = await res.json();
    return json.data;
}

export async function deleteAgent(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/agents/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete agent");
}

// --- TOOL APIS ---

export async function getAllTools(): Promise<ITool[]> {
    const res = await fetch(`${API_BASE}/tools`, {cache: "no-store"});
    if (!res.ok) throw new Error(await res.text());
    const json: IResponseMessage<ITool[]> = await res.json();
    return json.data;
}

export async function addTool(tool: any): Promise<ITool> {
    const res = await fetch(`${API_BASE}/tools`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(tool),
    });
    if (!res.ok) throw new Error(await res.text());
    const json: IResponseMessage<ITool> = await res.json();
    return json.data;
}

export async function deleteTool(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/tools/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete tool");
}

// --- RELATIONSHIP (LINK/UNLINK) ---

export async function linkToolToAgent(agentId: number, toolId: number): Promise<void> {
    const res = await fetch(`${API_BASE}/link/${agentId}/${toolId}`, {
        method: "POST"
    });
    if (!res.ok) throw new Error("Linking failed");
}

export async function unlinkToolFromAgent(agentId: number, toolId: number): Promise<void> {
    const res = await fetch(`${API_BASE}/unlink/${agentId}/${toolId}`, {
        method: "DELETE"
    });
    if (!res.ok) throw new Error("Unlinking failed");
}

// --- SERVICE ORCHESTRATION ---

export async function reloadAIService(): Promise<any> {
    // Note: This calls the Node.js Agent Service directly
    const res = await fetch(`http://localhost:8500/api/v1/reload`, {
        method: "POST"
    });
    if (!res.ok) throw new Error("AI Service reload failed");
    return res.json();
}
