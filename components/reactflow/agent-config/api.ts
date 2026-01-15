import {IAgent, IMainConfig, IResponseMessage, IRoutingConfig, ITool} from "@/app/data/data";

const API_BASE = "http://localhost:8080/service/api/config";


export async function getFullConfigByRouteName(routeName: string): Promise<IMainConfig> {
    const res = await fetch(`${API_BASE}/full/${routeName}`, {cache: "no-store"});
    if (!res.ok) throw new Error(await res.text());
    const json: IResponseMessage<IMainConfig> = await res.json();
    return json.data;
}


export async function getRoutingConfigs(): Promise<IRoutingConfig[]> {
    const res = await fetch(`${API_BASE}/routing-config/all`, {cache: "no-store"});
    if (!res.ok) throw new Error(await res.text());
    const json: IResponseMessage<IRoutingConfig[]> = await res.json();
    return json.data;
}

export async function getRoutingConfig(routeName: string): Promise<IRoutingConfig> {
    const res = await fetch(`${API_BASE}/routing-config/${routeName}`, {cache: "no-store"});
    if (!res.ok) throw new Error(await res.text());
    const json: IResponseMessage<IRoutingConfig> = await res.json();
    return json.data;
}

export async function saveRoutingConfig(config: Partial<IRoutingConfig>): Promise<IRoutingConfig> {
    const method = config.id ? "PUT" : "POST";
    const endpoint = config.id ? `${API_BASE}/routing-config` : `${API_BASE}/routing-config`;

    const res = await fetch(endpoint, {
        method: method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(config),
    });
    if (!res.ok) throw new Error(await res.text());
    const json: IResponseMessage<IRoutingConfig> = await res.json();
    return json.data;
}

export async function deleteRoutingConfig(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/routing-config/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete routing configuration");
}


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

export async function updateTool(id: number, tool: any): Promise<ITool> {
    const res = await fetch(`${API_BASE}/tools/${id}`, {
        method: "PUT",
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


export async function reloadAIService(): Promise<any> {
    const res = await fetch(`http://localhost:8500/api/v1/reload`, {
        method: "POST"
    });
    if (!res.ok) throw new Error("AI Service reload failed");
    return res.json();
}
