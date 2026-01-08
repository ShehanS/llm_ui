import {IResponseMessage, IWorkflow} from "../data/data";

const API_BASE = "http://localhost:8080/service/api/workflow";

export async function saveWorkflow(workflow: IWorkflow): Promise<any> {
    const res = await fetch(`${API_BASE}/save`, {
        method: "POST",
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(workflow),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to save workflow: ${err}`);
    }

    const json = await res.json();
    return json;
}


export async function openWorkflow(id: string): Promise<IWorkflow> {
    const res = await fetch(`${API_BASE}/open/${id}`, {
        method: "GET",
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
    }

    const json: IResponseMessage<IWorkflow> = await res.json();
    return json.data;
}

export async function openWorkflows(): Promise<IWorkflow[]> {
    const res = await fetch(`${API_BASE}/open/all`, {
        method: "GET",
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
    }

    const json: IResponseMessage<IWorkflow[]> = await res.json();
    return json.data;
}

