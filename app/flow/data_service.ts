import {create} from "zustand";
import {openWorkflow, openWorkflows, saveWorkflow as saveWorkflowApi} from "@/app/flow/api";
import {IWorkflow} from "@/app/data/data";

interface WorkflowStore {
    loading: boolean;
    error: any | null;
    savedWorkflow: any | null;
    openWorkflow: (id: string) => Promise<void>;
    saveWorkflow: (workflow: IWorkflow) => Promise<void>;
    openWorkflows: () => Promise<void>;
    workflows: IWorkflow[];
    clear: () => Promise<void>;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
    loading: false,
    error: null,
    workflow: null,
    workflows: [],

    saveWorkflow: async (workflow) => {
        if (get().loading) return;

        set({loading: true, error: null});

        try {
            const data = await saveWorkflowApi(workflow);
            set({
                savedWorkflow: data,
                loading: false,
            });
        } catch (e: any) {
            set({
                loading: false,
                error: e?.message ?? "Failed to save workflow",
            });
        }
    },

    openWorkflow: async (id: string) => {
        if (get().loading) return;

        set({loading: true, error: null});

        try {
            const data = await openWorkflow(id);
            set({
                workflow: data,
                loading: false,
            });
        } catch (e: any) {
            set({
                loading: false,
                error: e?.message ?? "Failed to open workflow",
            });
        }
    },

    openWorkflows: async () => {
        if (get().loading) return;

        set({loading: true, error: null});

        try {
            const data = await openWorkflows();
            set({
                workflows: data,
                loading: false,
            });
        } catch (e: any) {
            set({
                loading: false,
                error: e?.message ?? "Failed to open workflow",
            });
        }
    },

    clear: () => {
        set({loading: false, error: null, savedWorkflow: null});
    }

}));
