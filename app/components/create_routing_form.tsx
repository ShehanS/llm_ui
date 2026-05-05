import React, { useState } from 'react';
import { useConfigStore } from "@/components/reactflow/agent-config/data_service";
import { Save, BrainCircuit } from "lucide-react";

export const CreateRoutingForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const { createNewRouting, loading } = useConfigStore();
    const [form, setForm] = useState({
        routeName: '',
        classifierModel: { provider: 'openai', name: 'gpt-4o-mini', apiKey: '' },
        fallbackAgent: '',
        routingPrompt: ''
    });

    const handleSave = async () => {
        if (!form.routeName) return;
        await createNewRouting(form);
        onSuccess();
    };

    return (
        <div className="space-y-4 p-2 bg-slate-950">
            <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">Route Identifier</label>
                <input
                    placeholder="e.g. customer-support-route"
                    className="w-full bg-slate-900 border border-slate-800 p-3 text-xs rounded-md text-blue-400 font-mono focus:border-blue-500 outline-none"
                    value={form.routeName}
                    onChange={e => setForm({ ...form, routeName: e.target.value })}
                />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">System Instructions</label>
                <textarea
                    placeholder="Define how the router should decide between agents..."
                    rows={6}
                    className="w-full bg-slate-900 border border-slate-800 p-4 text-xs rounded-md font-mono text-slate-300 focus:border-blue-500 outline-none resize-none"
                    value={form.routingPrompt}
                    onChange={e => setForm({ ...form, routingPrompt: e.target.value })}
                />
            </div>
            <button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-emerald-600 py-3 rounded-xl font-bold text-xs uppercase shadow-lg hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
            >
                <BrainCircuit size={14} />
                Create Strategy
            </button>
        </div>
    );
};
