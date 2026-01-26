import { IExecutionTrace, IResponseMessage, IWorkflow } from "../data/data";

const API_BASE = "http://localhost:8080/api/workflow";
const WS_BASE = "ws://localhost:8080/api/workflow/ws/trace";

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
        throw new Error(await res.text());
    }

    return res.json();
}

export async function openWorkflow(id: string): Promise<IWorkflow> {
    const res = await fetch(`${API_BASE}/open/${id}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    const json: IResponseMessage<IWorkflow> = await res.json();
    return json.data;
}

export async function openWorkflows(): Promise<IWorkflow[]> {
    const res = await fetch(`${API_BASE}/open/all`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    const json: IResponseMessage<IWorkflow[]> = await res.json();
    return json.data;
}

export function openWorkflowTraceWS(
    runId: string,
    onMessage: (trace: IExecutionTrace) => void,
    onError?: (event: Event) => void,
    onClose?: (event: CloseEvent) => void
) {
    const ws = new WebSocket(`${WS_BASE}/${runId}`);

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            // Ensure we only process actual trace objects
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
        }
    };
}
