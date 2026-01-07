import {IAgent, ITool} from "@/app/data/data";
import {create} from "zustand";
import {fetchAgents, fetchPlugins, uploadPlugin} from "@/app/settings/api";

interface SettingsStore {
    tools: ITool[];
    agents: IAgent[];
    loading: boolean;
    error: string | null;
    loadingTools: () => Promise<void>;
    upload: (file: File) => Promise<void>;
    loadingAgents: (file: File) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
    tools: [],
    agents: [],
    loading: false,
    error: null,

    loadingTools: async () => {
        set({loading: true});
        try {
            const data = await fetchPlugins();
            set({tools: data, loading: false});
        } catch (e: any) {
            set({loading: false, error: e.message});
        }
    },

    uploadTool: async (file: File) => {
        set({loading: true});
        try {
            const tool = await uploadPlugin(file);
            set({tools: [...get().tools, tool], loading: false});
        } catch (e: any) {
            set({loading: false, error: e.message});
        }
    },

    loadingAgents: async () => {
        set({loading: true});
        try {
            const data = await fetchAgents();
            set({agents: data, loading: false});
        } catch (e: any) {
            set({loading: false, error: e.message});
        }
    }
}));
