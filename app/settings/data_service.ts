import {IAgent, ICommonTool, ITool} from "@/app/data/data";
import {create} from "zustand";
import {fetchAgents, fetchCommonTools, fetchPlugins, uploadPlugin} from "@/app/settings/api";

interface SettingsStore {
    tools: ITool[];
    agents: IAgent[];
    commonTools: ICommonTool[];
    loading: boolean;
    error: string | null;
    loadingTools: () => Promise<void>;
    upload: (file: File) => Promise<void>;
    loadingAgents: () => Promise<void>;
    loadingCommonTools: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
    tools: [],
    agents: [],
    commonTools: [],
    loading: false,
    error: null,
    loadingCommonTools: async () => {
        set({loading: true, error: null});
        try {
            const data = await fetchCommonTools();
            set({loading: false, commonTools: data});
        } catch (e: any) {
            set({loading: false, error: e.message});
        }
    },
    loadingTools: async () => {
        set({loading: true, error: null});
        try {
            const data = await fetchPlugins();
            set({tools: data, loading: false});
        } catch (e: any) {
            set({loading: false, error: e.message});
        }
    },

    upload: async (file: File) => {
        set({loading: true, error: null});
        try {
            const tool = await uploadPlugin(file);
            set({
                tools: [...get().tools, tool],
                loading: false
            });
        } catch (e: any) {
            set({loading: false, error: e.message});
        }
    },

    loadingAgents: async () => {
        set({loading: true, error: null});
        try {
            const data = await fetchAgents();
            set({agents: data, loading: false});
        } catch (e: any) {
            set({loading: false, error: e.message});
        }
    }
}));
