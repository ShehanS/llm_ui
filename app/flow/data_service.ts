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

    traces: IExecutionTrace;
    traceConnected: boolean;

    saveWorkflow: (workflow: IWorkflow) => Promise<void>;
    openWorkflow: (id: string) => Promise<void>;
    openWorkflows: () => Promise<void>;

    startLiveTrace: (runId: string) => void;
    stopLiveTrace: () => void;

    clear: () => void;
}

let closeTrace: (() => void) | null = null;
let traceController: { close: () => void } | null = null;
export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
    loading: false,
    error: null,

    workflow: null,
    workflows: [],
    savedWorkflow: null,

    traces: null,
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

    startLiveTrace: (runId: string) => {
        if (traceController) {
            traceController.close();
            traceController = null;
        }

        set({ traces: null, traceConnected: false });

        traceController = openWorkflowTraceWS(
            runId,
            (trace: IExecutionTrace) => {
                set((state) => ({
                    traces: trace,
                    traceConnected: true
                }));
            },
            () => set({ traceConnected: false }),
            () => set({ traceConnected: false })
        );
    },

    stopLiveTrace: () => {
        if (traceController) {
            traceController.close();
            traceController = null;
        }
        set({ traceConnected: false });
    },

    clear: () => {
        if (traceController) {
            traceController.close();
            traceController = null;
        }
        set({ traces: null, traceConnected: false, workflow: null });
    }
}));
