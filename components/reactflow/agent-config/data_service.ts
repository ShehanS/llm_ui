import {create} from "zustand";
import * as api from "./api";
import {IAgent, IRoutingConfig, ITool} from "@/app/data/data";

interface ConfigStore {
    loading: boolean;
    error: string | null;
    agents: IAgent[];
    tools: ITool[];
    routingConfig: IRoutingConfig | null;
    routingConfigs: IRoutingConfig[];
    currentRouteName: string;

    fetchInitialData: (routeName: string) => Promise<void>;
    fetchRoutingConfig: (routeName: string) => Promise<void>;
    updateRoutingConfig: (config: Partial<IRoutingConfig>) => Promise<void>;
    createNewRouting: (config: any) => Promise<void>;
    deleteRoutingConfig: (id: number) => Promise<void>;

    createNewAgent: (agent: any) => Promise<void>;
    updateAgent: (agent: any) => Promise<void>;
    deleteAgent: (id: number) => Promise<void>;

    createNewTool: (tool: any) => Promise<void>;
    updateTool: (id: number, tool: any) => Promise<void>;
    deleteTool: (id: number) => Promise<void>;

    assignTool: (agentId: number, toolId: number) => Promise<void>;
    unlinkTool: (agentId: number, toolId: number) => Promise<void>;

    assignAgentToRoute: (routeId: number, agentId: number) => Promise<void>;
    removeAgentFromRoute: (routeId: number, agentId: number) => Promise<void>;

    pushToAI: () => Promise<void>;
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
    loading: false,
    error: null,
    agents: [],
    tools: [],
    routingConfig: null,
    routingConfigs: [],
    currentRouteName: "test",

    fetchInitialData: async (routeName: string) => {
        set({ loading: true, error: null, currentRouteName: routeName });
        try {
            const [agents, tools, routingConfigs] = await Promise.all([
                api.getAllAgents(),
                api.getAllTools(),
                api.getRoutingConfigs(),
            ]);

            set({
                agents: agents || [],
                tools: tools || [],
                routingConfigs: routingConfigs || [],
                loading: false
            });
        } catch (e: any) {
            set({ error: e.message || "Failed to load data", loading: false });
        }
    },

    fetchRoutingConfig: async (routeName: string) => {
        set({ loading: true, currentRouteName: routeName });
        try {
            const routingConfig = await api.getRoutingConfig(routeName);
            set({ routingConfig: routingConfig, loading: false });
        } catch (e: any) {
            set({ error: e.message, loading: false });
        }
    },

    createNewRouting: async (config) => {
        set({ loading: true });
        try {
            await api.saveRoutingConfig(config);
            await get().fetchInitialData(config.routeName);
        } catch (e: any) { set({ error: e.message, loading: false }); }
    },

    updateRoutingConfig: async (config) => {
        set({ loading: true });
        try {
            const payload = { ...config, routeName: get().currentRouteName };
            await api.saveRoutingConfig(payload);
            await get().fetchInitialData(get().currentRouteName);
        } catch (e: any) { set({ error: e.message, loading: false }); }
    },

    deleteRoutingConfig: async (id) => {
        if (!confirm("Delete this routing configuration?")) return;
        set({ loading: true });
        try {
            await api.deleteRoutingConfig(id);
            await get().fetchInitialData("test");
        } catch (e: any) { set({ error: e.message, loading: false }); }
    },

    createNewAgent: async (agent) => {
        set({ loading: true });
        try {
            await api.addAgent(agent);
            await get().fetchInitialData(get().currentRouteName);
        } catch (e: any) { set({ error: e.message, loading: false }); }
    },

    updateAgent: async (agent) => {
        if (!agent.id) return;
        set({ loading: true });
        try {
            await api.updateAgent(agent.id, agent);
            await get().fetchInitialData(get().currentRouteName);
        } catch (e: any) { set({ error: e.message, loading: false }); }
    },

    deleteAgent: async (id) => {
        if (!confirm("Delete agent?")) return;
        set({ loading: true });
        try {
            await api.deleteAgent(id);
            await get().fetchInitialData(get().currentRouteName);
        } catch (e: any) { set({ error: e.message, loading: false }); }
    },

    createNewTool: async (tool) => {
        set({ loading: true });
        try {
            await api.addTool(tool);
            await get().fetchInitialData(get().currentRouteName);
        } catch (e: any) { set({ error: e.message, loading: false }); }
    },

    updateTool: async (id, tool) => {
        set({ loading: true });
        try {
            await api.updateTool(id, tool);
            await get().fetchInitialData(get().currentRouteName);
        } catch (e: any) { set({ error: e.message, loading: false }); }
    },

    deleteTool: async (id) => {
        if (!confirm("Delete tool?")) return;
        set({ loading: true });
        try {
            await api.deleteTool(id);
            await get().fetchInitialData(get().currentRouteName);
        } catch (e: any) { set({ error: e.message, loading: false }); }
    },

    assignTool: async (agentId, toolId) => {
        set({ loading: true });
        try {
            await api.linkToolToAgent(agentId, toolId);
            await get().fetchInitialData(get().currentRouteName);
        } catch (e: any) { set({ error: e.message, loading: false }); }
    },

    unlinkTool: async (agentId, toolId) => {
        set({ loading: true });
        try {
            await api.unlinkToolFromAgent(agentId, toolId);
            await get().fetchInitialData(get().currentRouteName);
        } catch (e: any) { set({ error: e.message, loading: false }); }
    },

    assignAgentToRoute: async (routeId, agentId) => {
        set({ loading: true });
        try {
            await api.linkAgentToRoute(routeId, agentId);
            if (get().routingConfig?.id === routeId) {
                await get().fetchRoutingConfig(get().currentRouteName);
            }
            set({ loading: false });
        } catch (e: any) { set({ error: e.message, loading: false }); }
    },

    removeAgentFromRoute: async (routeId, agentId) => {
        set({ loading: true });
        try {
            await api.unlinkAgentFromRoute(routeId, agentId);
            if (get().routingConfig?.id === routeId) {
                await get().fetchRoutingConfig(get().currentRouteName);
            }
            set({ loading: false });
        } catch (e: any) { set({ error: e.message, loading: false }); }
    },

    pushToAI: async () => {
        set({ loading: true });
        try {
            await api.reloadAIService();
            alert("AI Orchestrator synchronized.");
            set({ loading: false });
        } catch (e: any) {
            alert("AI Sync failed.");
            set({ loading: false });
        }
    }
}));
