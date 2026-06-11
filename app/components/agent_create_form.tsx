import React, { useState } from 'react';
import { useConfigStore } from "@/components/reactflow/agent-config/data_service";
import { Save, Sparkles } from "lucide-react";

export const CreateAgentForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const { createNewAgent, loading } = useConfigStore();
    const [form, setForm] = useState({
        agentName: '',
        displayName: '',
        systemPrompt: '',
        model: { provider: 'openai', name: 'gpt-4o', temperature: 0.7 },
        tools: []
    });

    const handleSave = async () => {
        if (!form.agentName || !form.displayName) return;
        await createNewAgent(form);
        onSuccess();
    };

    return (
        <div className="space-y-4 p-2">
            <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">System Identifier</label>
                <input
                    placeholder="e.g. food_agent"
                    className="w-full bg-slate-900 border border-slate-800 p-3 text-xs rounded-md text-white focus:border-blue-500 outline-none transition-colors"
                    value={form.agentName}
                    onChange={e => setForm({ ...form, agentName: e.target.value })}
                />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">Friendly Name</label>
                <input
                    placeholder="e.g. Order Assistant"
                    className="w-full bg-slate-900 border border-slate-800 p-3 text-xs rounded-md text-white focus:border-blue-500 outline-none transition-colors"
                    value={form.displayName}
                    onChange={e => setForm({ ...form, displayName: e.target.value })}
                />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">Core Directives</label>
                <textarea
                    placeholder="Define the agent's behavior..."
                    rows={6}
                    className="w-full bg-slate-900 border border-slate-800 p-4 text-xs rounded-md font-mono text-slate-300 focus:border-blue-500 outline-none transition-colors resize-none"
                    value={form.systemPrompt}
                    onChange={e => setForm({ ...form, systemPrompt: e.target.value })}
                />
            </div>
            <button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-blue-600 py-3 rounded-xl font-bold text-xs uppercase shadow-lg shadow-blue-900/30 hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
            >
                {loading ? <Sparkles size={14} className="animate-spin" /> : <Save size={14} />}
                Initialize Agent
            </button>
        </div>
    );
};
