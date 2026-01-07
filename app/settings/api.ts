import {IAgent, IResponseMessage, ITool} from "../data/data";

const API_BASE = "http://localhost:8080/service/api/tools";

export async function uploadPlugin(file: File): Promise<ITool> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/tool/install`, {
        method: "POST",
        body: formData,
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to upload plugin");
    }

    const json: IResponseMessage<ITool> = await res.json();
    return json.data;
}

export async function fetchPlugins(): Promise<ITool[]> {
    const res = await fetch(`${API_BASE}/tool/all`, {
        cache: "no-store", // realtime
    });

    if (!res.ok) {
        throw new Error("Failed to fetch tools");
    }

    const json: IResponseMessage<ITool[]> = await res.json();
    return json.data;
}

export async function fetchPlugin(id: string): Promise<ITool> {
    const res = await fetch(`${API_BASE}/tool/${id}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch tool");
    }

    const json: IResponseMessage<ITool> = await res.json();
    return json.data;
}

export async function fetchAgents(): Promise<IAgent[]> {
    const res = await fetch(`${API_BASE}/agents/all`, {
        cache: "no-cache"
    });

    if (!res.ok) {
        throw new Error("Failed to fetch agents");
    }

    const json: IResponseMessage<IAgent[]> = await res.json();
    return json.data;
}
