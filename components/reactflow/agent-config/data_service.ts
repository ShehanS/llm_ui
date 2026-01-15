import { create } from "zustand";
import * as api from "./api"; // Standardizing on your fetch-based API wrappers
import { IAgent, IMainConfig, ITool } from "@/app/data/data";

interface ConfigStore {
    loading: boolean;
    error: string | null;
    agents: IAgent[];
    tools: ITool[];
    fullConfig: IMainConfig | null;

    fetchInitialData: () => Promise<void>;
    createNewAgent: (agent: any) => Promise<void>;
    updateAgent: (agent: any) => Promise<void>;
    deleteAgent: (id: number) => Promise<void>;

    createNewTool: (tool: any) => Promise<void>;
    deleteTool: (id: number) => Promise<void>;

    assignTool: (agentId: number, toolId: number) => Promise<void>;
    unlinkTool: (agentId: number, toolId: number) => Promise<void>;
    pushToAI: () => Promise<void>;
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
    loading: false,
    error: null,
    agents: [],
    tools: [],
    fullConfig: null,

    fetchInitialData: async () => {
        set({ loading: true, error: null });
        try {
            // Using your getFullConfig and getAllTools wrappers
            const [agents, tools, fullConfig] = await Promise.all([
                api.getAllAgents(),
                api.getAllTools(),
                api.getFullConfig()
            ]);

            set({
                agents,
                tools,
                fullConfig,
                loading: false
            });
        } catch (e: any) {
            set({ error: e.message || "Failed to load configuration", loading: false });
        }
    },

    createNewAgent: async (agent) => {
        set({ loading: true });
        try {
            await api.addAgent(agent);
            await get().fetchInitialData();
        } catch (e: any) {
            set({ error: e.message, loading: false });
        }
    },

    updateAgent: async (agent) => {
        if (!agent.id) return;
        set({ loading: true });
        try {
            await api.updateAgent(agent.id, agent);
            await get().fetchInitialData();
        } catch (e: any) {
            set({ error: e.message, loading: false });
        }
    },

    deleteAgent: async (id) => {
        if (!confirm("Are you sure you want to delete this agent?")) return;
        set({ loading: true });
        try {
            await api.deleteAgent(id);
            await get().fetchInitialData();
        } catch (e: any) {
            set({ error: e.message, loading: false });
        }
    },

    createNewTool: async (tool) => {
        set({ loading: true });
        try {
            await api.addTool(tool);
            await get().fetchInitialData();
        } catch (e: any) {
            set({ error: e.message, loading: false });
        }
    },

    deleteTool: async (id) => {
        if (!confirm("Delete this tool?")) return;
        set({ loading: true });
        try {
            await api.deleteTool(id);
            await get().fetchInitialData();
        } catch (e: any) {
            set({ error: e.message, loading: false });
        }
    },

    assignTool: async (agentId, toolId) => {
        set({ loading: true });
        try {
            await api.linkToolToAgent(agentId, toolId);
            await get().fetchInitialData();
        } catch (e: any) {
            set({ error: e.message, loading: false });
        }
    },

    unlinkTool: async (agentId, toolId) => {
        set({ loading: true });
        try {
            await api.unlinkToolFromAgent(agentId, toolId);
            await get().fetchInitialData();
        } catch (e: any) {
            set({ error: e.message, loading: false });
        }
    },

    pushToAI: async () => {
        set({ loading: true });
        try {
            await api.reloadAIService();
            alert("AI Orchestrator synchronized with Database.");
            set({ loading: false });
        } catch (e: any) {
            alert("AI Service is offline or reload failed.");
            set({ loading: false });
        }
    }
}));
