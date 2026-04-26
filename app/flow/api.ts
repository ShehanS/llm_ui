import { getSession } from "next-auth/react";
import { IExecutionTrace, IResponseMessage, IWorkflow } from "../data/data";

const API_BASE = "http://localhost:9095/api/workflow";
const WS_BASE = "ws://localhost:9095/api/workflow/ws/trace";

async function getAuthHeaders(existingHeaders: Record<string, string> = {}): Promise<Record<string, string>> {
    const session = await getSession();
    const token = (session as any)?.accessToken;
    if (!token) throw new Error("No access token. Please sign in.");
    return { ...existingHeaders, "Authorization": `Bearer ${token}` };
}

export async function saveWorkflow(workflow: IWorkflow): Promise<any> {
    const res = await fetch(`${API_BASE}/save`, {
        method: "POST",
        cache: "no-store",
        headers: await getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(workflow),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function openWorkflow(id: string): Promise<IWorkflow> {
    const res = await fetch(`${API_BASE}/open/${id}`, {
        cache: "no-store",
        headers: await getAuthHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    const json: IResponseMessage<IWorkflow> = await res.json();
    return json.data;
}

export async function openWorkflows(): Promise<IWorkflow[]> {
    const res = await fetch(`${API_BASE}/open/all`, {
        cache: "no-store",
        headers: await getAuthHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    const json: IResponseMessage<IWorkflow[]> = await res.json();
    return json.data;
}

export async function openWorkflowTraceWS(
    runId: string,
    onMessage: (trace: IExecutionTrace) => void,
    onError?: (event: Event) => void,
    onClose?: (event: CloseEvent) => void
): Promise<{ socket: WebSocket; close: () => void }> {
    const session = await getSession();
    const token = (session as any)?.accessToken;

    const url = token
        ? `${WS_BASE}/${runId}?token=${encodeURIComponent(token)}`
        : `${WS_BASE}/${runId}`;

    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data && data.nodeId) {
                onMessage(data);
            }
        } catch (e) {
            console.error("Failed to parse WS message", e);
        }
    };

    ws.onerror = (event) => onError?.(event);
    ws.onclose = (event) => onClose?.(event);

    return {
        socket: ws,
        close: () => {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
        },
    };
}
