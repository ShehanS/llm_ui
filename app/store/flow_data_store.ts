import { create } from "zustand";
import {
    openWorkflow,
    openWorkflows,
    saveWorkflow,
    openWorkflowTraceWS
} from "@/app/flow/api";
import { IExecutionTrace, IWorkflow } from "@/app/data/data";

interface WorkflowStore {
    loading: boolean;
    error: any | null;

    workflow: IWorkflow | null;
    workflows: IWorkflow[];
    savedWorkflow: any | null;

    traces: IExecutionTrace[];
    traceConnected: boolean;

    saveWorkflow: (workflow: IWorkflow) => Promise<void>;
    openWorkflow: (id: string) => Promise<void>;
    openWorkflows: () => Promise<void>;

    startLiveTrace: (runId: string) => void;
    stopLiveTrace: () => void;

    clear: () => void;
}

let traceController: { close: () => void } | null = null;

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
    loading: false,
    error: null,

    workflow: null,
    workflows: [],
    savedWorkflow: null,

    traces: [],
    traceConnected: false,

    saveWorkflow: async (workflow) => {
        if (get().loading) return;

        set({ loading: true, error: null });

        try {
            const data = await saveWorkflow(workflow);
            set({ savedWorkflow: data, loading: false });
        } catch (e: any) {
            set({
                loading: false,
                error: e?.message ?? "Failed to save workflow",
            });
        }
    },

    openWorkflow: async (id) => {
        if (get().loading) return;

        set({ loading: true, error: null });

        try {
            const data = await openWorkflow(id);
            set({ workflow: data, loading: false });
        } catch (e: any) {
            set({
                loading: false,
                error: e?.message ?? "Failed to open workflow",
            });
        }
    },

    openWorkflows: async () => {
        if (get().loading) return;

        set({ loading: true, error: null });

        try {
            const data = await openWorkflows();
            set({ workflows: data, loading: false });
        } catch (e: any) {
            set({
                loading: false,
                error: e?.message ?? "Failed to open workflows",
            });
        }
    },

    startLiveTrace: async (runId: string) => {
        if (traceController && typeof traceController.close === 'function') {
            try {
                traceController.close();
            } catch (e) {
                console.warn("Failed to close existing trace controller", e);
            }
            traceController = null;
        }

        set({traces: [], traceConnected: false});

        const controller = openWorkflowTraceWS(
            runId,
            (trace: IExecutionTrace) => {
                set((state) => ({
                    traces: [...state.traces, trace],
                    traceConnected: true
                }));
            },
            () => set({traceConnected: false}),
            () => set({traceConnected: false})
        );

        if (controller) {
            traceController = await controller;
        }
    },

    stopLiveTrace: () => {
        if (traceController && typeof traceController.close === 'function') {
            try {
                traceController.close();
            } catch (e) {
                console.warn("Failed to close trace controller", e);
            }
            traceController = null;
        }
        set({ traceConnected: false });
    },

    clear: () => {
        if (traceController && typeof traceController.close === 'function') {
            try {
                traceController.close();
            } catch (e) {
                console.warn("Failed to close trace controller during clear", e);
            }
            traceController = null;
        }
        set({ traces: [], traceConnected: false, workflow: null });
    }
}));
