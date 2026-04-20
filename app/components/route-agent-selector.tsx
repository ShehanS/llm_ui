"use client";

import React, { FC, useEffect, useState, useRef } from "react";
import { useConfigStore } from "@/components/reactflow/agent-config/data_service";

import {
    Bot, Loader, GitBranch, X, Plus,
    ChevronDown, Terminal, Trash2, CheckCircle2,
    Wrench, UserPlus, BrainCircuit, Save, AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import {useDialogDataStore} from "@/app/store/dialog_data_store";

// --- QUICK FORM COMPONENTS FOR DIALOG ---

const CreateRoutingForm = ({ onSuccess }: { onSuccess: () => void }) => {
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
                    placeholder="e.g. support-workflow"
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
                className="w-full bg-emerald-600 py-3 rounded-xl font-bold text-xs uppercase shadow-lg hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 text-white"
            >
                {loading ? <Loader size={14} className="animate-spin" /> : <BrainCircuit size={14} />}
                Create Strategy
            </button>
        </div>
    );
};

const CreateAgentForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const { createNewAgent, loading } = useConfigStore();
    const [form, setForm] = useState({
        agentName: '', displayName: '', systemPrompt: '',
        model: { provider: 'openai', name: 'gpt-4o', temperature: 0.7 },
        tools: []
    });

    const handleSave = async () => {
        if (!form.agentName || !form.displayName) return;
        await createNewAgent(form);
        onSuccess();
    };

    return (
        <div className="space-y-4 p-2 bg-slate-950">
            <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">Agent ID</label>
                <input
                    placeholder="e.g. billing_specialist"
                    className="w-full bg-slate-900 border border-slate-800 p-3 text-xs rounded-md text-white outline-none focus:border-blue-500"
                    onChange={e => setForm({ ...form, agentName: e.target.value })}
                />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">Display Name</label>
                <input
                    placeholder="e.g. Billing Assistant"
                    className="w-full bg-slate-900 border border-slate-800 p-3 text-xs rounded-md text-white outline-none focus:border-blue-500"
                    onChange={e => setForm({ ...form, displayName: e.target.value })}
                />
            </div>
            <button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-blue-600 py-3 rounded-xl font-bold text-xs uppercase shadow-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-2 text-white"
            >
                {loading ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
                Deploy Agent
            </button>
        </div>
    );
};

// --- MAIN SELECTOR COMPONENT ---

type RouteAgentSelectorProps = {
    value: any;
    onChange: (name: string, value: any) => void;
};

const RouteAgentSelector: FC<RouteAgentSelectorProps> = ({ value, onChange }) => {
    const {
        routingConfigs, agents: allAvailableAgents, tools: allAvailableTools,
        fetchInitialData, assignAgentToRoute, removeAgentFromRoute,
        assignTool, unlinkTool, deleteRoutingConfig, loading
    } = useConfigStore();

    const { openCommonDialog, closeCommonDialog } = useDialogDataStore();

    const [isOpen, setIsOpen] = useState(false);
    const [selectedRouteName, setSelectedRouteName] = useState(value?.value ?? value ?? "");
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchInitialData();
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectRoute = (routeName: string) => {
        setSelectedRouteName(routeName);
        onChange("routeAgent", routeName);
        setIsOpen(false);
    };

    const runAction = async (action: () => Promise<void>) => {
        await action();
        await fetchInitialData();
    };

    const openStrategyDialog = () => {
        openCommonDialog({
            type: "info",
            title: "New Routing Strategy",
            children: <CreateRoutingForm onSuccess={() => { fetchInitialData(); closeCommonDialog(); }} />
        });
    };

    const openAgentDialog = () => {
        openCommonDialog({
            type: "info",
            title: "Quick Agent Deployment",
            children: <CreateAgentForm onSuccess={() => { fetchInitialData(); closeCommonDialog(); }} />
        });
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1 mb-2 block">
                Intelligence Strategy
            </label>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between rounded-md border px-3 py-2.5 text-sm transition-all bg-slate-900/50",
                    selectedRouteName ? "border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]" : "border-slate-800"
                )}
            >
                <div className="flex items-center gap-2">
                    {loading ? <Loader size={14} className="animate-spin text-blue-400" /> : <GitBranch size={14} className="text-emerald-500" />}
                    <span className={selectedRouteName ? "text-white font-medium" : "text-slate-500"}>
                        {selectedRouteName || "Select Strategy..."}
                    </span>
                </div>
                <ChevronDown size={16} className={cn("text-slate-500 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute z-[100] mt-2 w-full max-h-[550px] overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.7)] custom-scrollbar animate-in fade-in zoom-in-95 duration-200">

                    {/* STICKY 3-ACTION HEADER */}
                    <div className="sticky top-0 z-50 bg-slate-900 p-2 grid grid-cols-3 gap-1.5 border-b border-slate-800 shadow-md">
                        <button
                            type="button"
                            onClick={openStrategyDialog}
                            className="flex items-center justify-center gap-1.5 py-2 bg-emerald-600/10 border border-emerald-500/30 rounded-lg text-[8px] font-bold text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all"
                        >
                            <BrainCircuit size={12}/> STRATEGY
                        </button>
                        <button
                            type="button"
                            onClick={openAgentDialog}
                            className="flex items-center justify-center gap-1.5 py-2 bg-blue-600/10 border border-blue-500/30 rounded-lg text-[8px] font-bold text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
                        >
                            <UserPlus size={12}/> AGENT
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center gap-1.5 py-2 bg-amber-600/10 border border-amber-500/30 rounded-lg text-[8px] font-bold text-amber-400 hover:bg-amber-600 hover:text-white transition-all"
                        >
                            <Wrench size={12}/> TOOL
                        </button>
                    </div>

                    <div className="p-1">
                        {routingConfigs?.map((route) => (
                            <div key={route.id} className={cn(
                                "m-2 p-4 rounded-xl border border-transparent transition-all",
                                selectedRouteName === route.routeName ? "bg-blue-600/5 border-blue-500/20 shadow-inner" : "hover:bg-slate-900/40"
                            )}>
                                {/* ROUTE HEADER WITH DELETE */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-tight">
                                            <GitBranch size={14} className="text-blue-400" /> {route.routeName}
                                        </span>
                                        <span className="text-[8px] text-slate-600 font-mono">ID: {route.id}</span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        {/* DELETE STRATEGY BUTTON */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if(confirm(`Permanently delete strategy: ${route.routeName}?`)) {
                                                    runAction(() => deleteRoutingConfig(route.id!));
                                                }
                                            }}
                                            className="p-1.5 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded transition-all"
                                        >
                                            <Trash2 size={13} />
                                        </button>

                                        {/* SELECT BUTTON */}
                                        <button
                                            type="button"
                                            onClick={() => handleSelectRoute(route.routeName)}
                                            className={cn(
                                                "text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all",
                                                selectedRouteName === route.routeName
                                                    ? "bg-emerald-600 border-emerald-500 text-white"
                                                    : "border-slate-700 text-slate-400 hover:bg-slate-800"
                                            )}
                                        >
                                            {selectedRouteName === route.routeName ? <CheckCircle2 size={12}/> : "SELECT"}
                                        </button>
                                    </div>
                                </div>

                                {/* FLEET MANAGEMENT */}
                                <div className="space-y-3 pl-3 border-l-2 border-slate-800/50">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Linked Fleet</span>
                                        <select
                                            className="bg-slate-800 text-[9px] text-blue-400 rounded px-2 py-0.5 outline-none border border-transparent hover:border-blue-500/50"
                                            onChange={(e) => e.target.value && runAction(() => assignAgentToRoute(route.id, Number(e.target.value)))}
                                            value=""
                                        >
                                            <option value="">+ Link</option>
                                            {allAvailableAgents
                                                .filter(a => !route.agents?.some((ra: any) => ra.id === a.id))
                                                .map(a => <option key={a.id} value={a.id}>{a.displayName}</option>)
                                            }
                                        </select>
                                    </div>

                                    {route.agents?.map((agent: any) => (
                                        <div key={agent.id} className="bg-slate-900/60 border border-slate-800/40 rounded-lg p-3 space-y-3 shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-medium text-slate-200 flex items-center gap-2 italic">
                                                    <Bot size={12} className="text-blue-400" /> {agent.displayName}
                                                </span>
                                                <button onClick={() => runAction(() => removeAgentFromRoute(route.id, agent.id))} className="text-slate-600 hover:text-red-500 transition-colors">
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>

                                            {/* TOOLS GRID */}
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {agent.tools?.map((tool: string) => (
                                                    <span key={tool} className="flex items-center gap-1 px-2 py-0.5 bg-black text-[9px] font-mono text-emerald-400 border border-emerald-500/10 rounded group">
                                                        <Terminal size={10} className="text-emerald-700"/>
                                                        {tool}
                                                        <button onClick={() => runAction(() => unlinkTool(agent.id, tool))} className="text-slate-700 hover:text-red-500 ml-1">
                                                            <X size={10} />
                                                        </button>
                                                    </span>
                                                ))}
                                                <select
                                                    className="bg-transparent text-[9px] text-slate-600 outline-none hover:text-emerald-500 transition-colors font-bold"
                                                    onChange={(e) => e.target.value && runAction(() => assignTool(agent.id, e.target.value))}
                                                    value=""
                                                >
                                                    <option value="">+ Tool</option>
                                                    {allAvailableTools
                                                        .filter(t => !agent.tools?.includes(t.name))
                                                        .map(t => <option key={t.name} value={t.name}>{t.name}</option>)
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RouteAgentSelector;
