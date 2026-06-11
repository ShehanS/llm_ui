"use client";

import React, {FC, useEffect, useRef, useState} from "react";
import {useConfigStore} from "@/components/reactflow/agent-config/data_service";
import {
    Badge,
    Bot,
    BrainCircuit,
    CheckCircle2,
    ChevronDown,
    Code2,
    Database,
    Edit2,
    File,
    GitBranch,
    Loader,
    Loader2,
    Save,
    ShieldAlert,
    ShieldCheck,
    Terminal,
    Trash2,
    Wrench,
    X
} from "lucide-react";
import {cn} from "@/lib/utils";
import {useDialogDataStore} from "@/app/store/dialog_data_store";
import Editor from "@monaco-editor/react";
import {useSettingsStore} from "@/app/settings/data_service";
import {Button} from "@/components/ui/button";
import {IAgentTool} from "@/app/data/data";

const DEFAULT_MOCK_CODE = `async function getMetadata() {
return {
name: "food_order_tool",
onSuccessStatus: "ready_to_check",
description: "Extracts and structures food order details.",
schema: {
type: "object",
properties: {
name: { type: "string", description: "User's full name" },
address: { type: "string", description: "Delivery address" },
phone: { type: "string", description: "Contact phone number" },
orderItems: { type: "string", description: "List of food items" }
},
required: ["name", "address", "phone", "orderItems"]
}
};
}

async function run(input) {
return JSON.stringify({
status: "EXTRACTED",
data: input,
message: "All required information has been captured."
});
}`;

const CopyToolForm: FC<{ onSuccess: () => void, initialData: any }> = ({ onSuccess, initialData }) => {
    const { loading, copyTool } = useConfigStore();
    const [form, setForm] = useState({
        copyFrom: initialData?.toolName || '',
        toolDisplayName: initialData?.displayName || '',
        description: '',
        dangerous: false,
        toolName: ''
    });

    const handleSave = async () => {
        if (!form.toolName || !form.toolDisplayName) return;
        await copyTool(form as any);
        onSuccess();
    };

    return (
        <div className="space-y-4 p-2 bg-slate-950">
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">System Name</label>
                    <input
                        className="w-full bg-slate-900 border border-slate-800 p-3 text-xs rounded-md text-blue-400 font-mono outline-none focus:border-blue-500"
                        value={form.toolName || ''}
                        onChange={e => setForm({ ...form, toolName: e.target.value })}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">Display Label</label>
                    <input
                        className="w-full bg-slate-900 border border-slate-800 p-3 text-xs rounded-md text-slate-300 outline-none focus:border-blue-500"
                        value={form.toolDisplayName || ''}
                        onChange={e => setForm({ ...form, toolDisplayName: e.target.value })}
                    />
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">Description</label>
                <textarea
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-800 p-3 text-xs rounded-md text-slate-300 outline-none focus:border-blue-500"
                    value={form.description || ''}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                />
            </div>
            <button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-emerald-600 py-3 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 text-white hover:bg-emerald-500"
            >
                {loading ? <Loader size={14} className="animate-spin" /> : <Wrench size={14} />} Confirm Copy
            </button>
        </div>
    );
};

const CreateToolForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const { loading: isSaving, agentTools, updateTool, deleteTool, fetchInitialData } = useConfigStore();
    const { loading: settingsLoading, loadingCommonTools, commonTools } = useSettingsStore();
    const { openDialog, closeDialog, id } = useDialogDataStore();

    const [tool, setTool] = useState({
        toolName: "new_tool",
        source: DEFAULT_MOCK_CODE,
        displayName: "New Tool Template",
        readonly: false,
        dangerous: false
    });

    useEffect(() => { loadingCommonTools(); }, [loadingCommonTools]);

    const handleUpdate = async () => {
        const existing:IAgentTool | undefined = agentTools.find(at => at.toolName === tool.toolName);
        if (existing?.id) {
            await updateTool(existing.id, {
                ...existing,
                source: tool.source,
                toolDisplayName: tool.displayName,
                dangerous: tool.dangerous
            });
            await fetchInitialData();
            onSuccess();
        }
    };

    const renderToolItem = (t: any, isTemplate: boolean) => (
        <div
            key={t.id || t.toolName}
            className="group flex flex-col gap-1 p-3 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-900 hover:border-slate-700 transition-all cursor-pointer mb-2"
            onClick={() => setTool({
                toolName: t.toolName ?? "",
                source: t.source ?? "",
                displayName: t.toolDisplayName ?? t.toolName ?? "",
                readonly: !!t.readOnly,
                dangerous: !!t.dangerous
            })}
        >
            <div className="flex items-center justify-between">
                <div className="flex flex-col truncate pr-4">
                    <span className="text-sm font-medium text-slate-200 truncate">{t.toolDisplayName || t.toolName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    {!isTemplate && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setTool({ toolName: t.toolName, source: t.source, displayName: t.toolDisplayName, readonly: false, dangerous: !!t.dangerous });
                                }}
                                className="p-1 text-blue-400 hover:bg-blue-500/10 rounded"
                            >
                                <Terminal size={12} />
                            </button>
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    if (confirm('Delete tool?')) {
                                        await deleteTool(t.id);
                                        await fetchInitialData();
                                    }
                                }}
                                className="p-1 text-slate-500 hover:text-red-500 rounded"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    )}
                    <Badge variant="outline" className={cn("text-[10px] uppercase", t.readOnly ? "text-amber-500" : "text-blue-500")}>
                        {t.readOnly ? 'Locked' : 'Edit'}
                    </Badge>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-slate-950 h-full min-h-[700px]">
            <div className="w-full md:w-72 flex flex-col gap-6 border-r border-slate-800 pr-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 px-1"><Database className="w-4 h-4 text-blue-400" /><h3 className="text-sm font-semibold text-slate-300 uppercase">Templates</h3></div>
                    <div className="overflow-y-auto max-h-[300px] scrollbar-hide">
                        {settingsLoading ? <Loader className="animate-spin text-slate-800 mx-auto" /> : commonTools?.map(t => renderToolItem(t, true))}
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 px-1"><Wrench className="w-4 h-4 text-emerald-400" /><h3 className="text-sm font-semibold text-slate-300 uppercase">Customized</h3></div>
                    <div className="overflow-y-auto max-h-[300px] scrollbar-hide">{agentTools?.map(t => renderToolItem(t, false))}</div>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between bg-slate-900/50 p-2 rounded-t-lg border border-slate-800 border-b-0">
                    <div className="flex items-center gap-2 px-2"><Code2 className="w-4 h-4 text-slate-400" /><span className="text-xs font-mono text-slate-400">{tool.readonly ? 'view_only.js' : 'editor.js'}</span></div>
                    <div className="flex items-center gap-2">
                        {!tool.readonly && agentTools.some(at => at.toolName === tool.toolName) && (
                            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-md border border-slate-800">
                                <button
                                    onClick={() => setTool(prev => ({...prev, dangerous: !prev.dangerous}))}
                                    className={cn("flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-bold uppercase transition-all",
                                        tool.dangerous ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                    )}
                                >
                                    {tool.dangerous ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                                    {tool.dangerous ? "Dangerous" : "Safe"}
                                </button>
                                <Button size="sm" onClick={handleUpdate} className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white"><Save size={14} /> Update</Button>
                            </div>
                        )}
                        <Button size="sm" onClick={() => openDialog({ type: "info", title: "Copy Tool", children: <CopyToolForm initialData={tool} onSuccess={() => { closeDialog(id); onSuccess(); }} /> })} disabled={isSaving || !tool.toolName} className="h-8 bg-blue-600 hover:bg-blue-500 text-white"><File size={14} /> Copy</Button>
                    </div>
                </div>
                <div className="rounded-b-lg border border-slate-800 overflow-hidden relative">
                    {tool.readonly && <div className="absolute top-2 right-4 z-10 px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold rounded">READ ONLY</div>}
                    <Editor
                        height="600px"
                        language="javascript"
                        value={tool.source || ''}
                        theme="vs-dark"
                        onChange={(val) => !tool.readonly && setTool(prev => ({ ...prev, source: val ?? "" }))}
                        options={{ fontSize: 14, minimap: { enabled: false }, readOnly: tool.readonly, domReadOnly: tool.readonly, backgroundColor: "#020617" }}
                    />
                </div>
            </div>
        </div>
    );
};

const CreateRoutingForm = ({ onSuccess, initialData }: { onSuccess: () => void, initialData?: any }) => {
    const { createNewRouting, loading, fetchInitialData, agents } = useConfigStore();
    const [form, setForm] = useState({
        id: initialData?.id || null,
        routeName: initialData?.routeName || '',
        classifierModel: initialData?.classifierModel || {
            provider: 'openai',
            name: 'gpt-4o-mini',
            apiKey: '',
            temperature: 0
        },
        fallbackAgent: initialData?.fallbackAgent || '',
        routingPrompt: initialData?.routingPrompt || '',
        serviceType: initialData?.serviceType || 'CLOUD',
        serviceURL: initialData?.serviceURL || ''
    });

    const handleSave = async () => {
        if (form.routeName) {
            await createNewRouting(form as any);
            await fetchInitialData();
            onSuccess();
        }
    };

    return (
        <div className="space-y-4 p-2 bg-slate-950">
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">Route ID</label>
                    <input
                        className="w-full bg-slate-900 border border-slate-800 p-3 text-xs rounded-md text-white outline-none focus:border-blue-500"
                        value={form.routeName || ''}
                        onChange={e => setForm({ ...form, routeName: e.target.value })}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">Fallback Agent</label>
                    <select
                        className="w-full bg-slate-900 border border-slate-800 p-3 text-xs rounded-md text-slate-300 outline-none focus:border-blue-500"
                        value={form.fallbackAgent || ''}
                        onChange={e => setForm({ ...form, fallbackAgent: e.target.value })}
                    >
                        <option value="">Select Fallback...</option>
                        {agents?.map(agent => (
                            <option key={agent.id} value={agent.agentName || ''}>
                                {agent.displayName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 space-y-3">
                <label className="text-[10px] text-emerald-400 uppercase font-bold block">Service Configuration</label>
                <div className={cn("grid gap-2", form.serviceType === 'LOCAL' ? "grid-cols-2" : "grid-cols-1")}>
                    <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold ml-1">Service Type</label>
                        <select
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs rounded-md text-white outline-none"
                            value={form.serviceType || 'CLOUD'}
                            onChange={e => setForm({ ...form, serviceType: e.target.value })}
                        >
                            <option value="CLOUD">CLOUD</option>
                            <option value="LOCAL">LOCAL</option>
                        </select>
                    </div>
                    {form.serviceType === 'LOCAL' && (
                        <div className="space-y-1">
                            <label className="text-[9px] text-slate-500 uppercase font-bold ml-1">Service URL</label>
                            <input
                                className="w-full bg-slate-950 border border-slate-800 p-2 text-xs rounded-md text-white outline-none focus:border-blue-500"
                                value={form.serviceURL || ''}
                                onChange={e => setForm({ ...form, serviceURL: e.target.value })}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 space-y-3">
                <label className="text-[10px] text-blue-400 uppercase font-bold block">Classifier Configuration</label>
                <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold ml-1">Provider</label>
                        <input
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs rounded-md text-white outline-none"
                            value={form.classifierModel.provider || ''}
                            onChange={e => setForm({ ...form, classifierModel: { ...form.classifierModel, provider: e.target.value }})}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold ml-1">Model Name</label>
                        <input
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs rounded-md text-white outline-none"
                            value={form.classifierModel.name || ''}
                            onChange={e => setForm({ ...form, classifierModel: { ...form.classifierModel, name: e.target.value }})}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold ml-1">Temp</label>
                        <input
                            type="number" step="0.1"
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs rounded-md text-white outline-none"
                            value={form.classifierModel.temperature ?? 0}
                            onChange={e => setForm({ ...form, classifierModel: { ...form.classifierModel, temperature: parseFloat(e.target.value) }})}
                        />
                    </div>
                </div>
                {/* Added Missing API Key Input */}
                <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 uppercase font-bold ml-1">API Key</label>
                    <input
                        type="password"
                        className="w-full bg-slate-950 border border-slate-800 p-2 text-xs rounded-md text-white outline-none focus:border-blue-500"
                        value={form.classifierModel.apiKey || ''}
                        onChange={e => setForm({ ...form, classifierModel: { ...form.classifierModel, apiKey: e.target.value }})}
                        placeholder="Enter API Key"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">Routing Prompt</label>
                <textarea
                    rows={4}
                    className="w-full bg-slate-900 border border-slate-800 p-4 text-xs rounded-md text-slate-300 outline-none focus:border-blue-500 resize-none font-mono"
                    value={form.routingPrompt || ''}
                    onChange={e => setForm({ ...form, routingPrompt: e.target.value })}
                />
            </div>

            <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold text-xs uppercase shadow-lg transition-all flex items-center justify-center gap-2 text-white"
            >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <BrainCircuit size={14} />}
                {form.id ? 'Update Strategy' : 'Create Strategy'}
            </Button>
        </div>
    );
};
const CreateAgentForm = ({ onSuccess, initialData }: { onSuccess: () => void, initialData?: any }) => {
    const { createNewAgent, loading, fetchInitialData } = useConfigStore();
    const [form, setForm] = useState({
        id: initialData?.id || null,
        agentName: initialData?.agentName || '',
        displayName: initialData?.displayName || '',
        description: initialData?.description || '',
        expertise: initialData?.expertise || '',
        environment: initialData?.environment || 'CLOUD',
        baseURL: initialData?.baseURL || '',
        systemPrompt: initialData?.systemPrompt || '',
        isDefault: initialData?.isDefault || false,
        model: initialData?.model || {
            provider: 'openai',
            name: 'gpt-4o',
            temperature: 0.7,
            apiKey: ''
        }
    });

    const handleSave = async () => {
        if (form.agentName) {
            await createNewAgent(form as any);
            await fetchInitialData();
            onSuccess();
        }
    };

    return (
        <div className="space-y-4 p-2 bg-slate-950 overflow-y-auto max-h-[80vh] custom-scrollbar">
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">Agent ID</label>
                    <input
                        className="w-full bg-slate-900 border border-slate-800 p-3 text-xs rounded-md text-white outline-none focus:border-blue-500"
                        value={form.agentName || ''}
                        onChange={e => setForm({ ...form, agentName: e.target.value })}
                        placeholder="e.g. billing_specialist"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">Display Name</label>
                    <input
                        className="w-full bg-slate-900 border border-slate-800 p-3 text-xs rounded-md text-white outline-none focus:border-blue-500"
                        value={form.displayName || ''}
                        onChange={e => setForm({ ...form, displayName: e.target.value })}
                        placeholder="e.g. Billing Assistant"
                    />
                </div>
            </div>

            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 space-y-3">
                <label className="text-[10px] text-emerald-400 uppercase font-bold block">Service Environment</label>
                <div className={cn("grid gap-2", form.environment === 'LOCAL' ? "grid-cols-2" : "grid-cols-1")}>
                    <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold ml-1">Environment Type</label>
                        <select
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs rounded-md text-white outline-none"
                            value={form.environment || 'CLOUD'}
                            onChange={e => setForm({ ...form, environment: e.target.value })}
                        >
                            <option value="CLOUD">CLOUD</option>
                            <option value="LOCAL">LOCAL</option>
                        </select>
                    </div>
                    {form.environment === 'LOCAL' && (
                        <div className="space-y-1">
                            <label className="text-[9px] text-slate-500 uppercase font-bold ml-1">Base URL</label>
                            <input
                                className="w-full bg-slate-950 border border-slate-800 p-2 text-xs rounded-md text-blue-400 font-mono outline-none focus:border-blue-500"
                                value={form.baseURL || ''}
                                onChange={e => setForm({ ...form, baseURL: e.target.value })}
                                placeholder="http://localhost:11434"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">Expertise</label>
                <input
                    className="w-full bg-slate-900 border border-slate-800 p-3 text-xs rounded-md text-slate-300 outline-none focus:border-blue-500"
                    value={form.expertise || ''}
                    onChange={e => setForm({ ...form, expertise: e.target.value })}
                    placeholder="e.g. Data Analysis"
                />
            </div>

            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 space-y-3">
                <label className="text-[10px] text-blue-400 uppercase font-bold block">Intelligence Configuration</label>
                <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold">Provider</label>
                        <select
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs rounded-md text-white outline-none"
                            value={form.model.provider || 'openai'}
                            onChange={e => setForm({ ...form, model: { ...form.model, provider: e.target.value }})}
                        >
                            <option value="openai">OpenAI</option>
                            <option value="anthropic">Anthropic</option>
                            <option value="ollama">Ollama</option>
                        </select>
                    </div>
                    <div className="space-y-1 flex-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold">Model Name</label>
                        <input
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs rounded-md text-white outline-none"
                            value={form.model.name || ''}
                            onChange={e => setForm({ ...form, model: { ...form.model, name: e.target.value }})}
                        />
                    </div>
                    <div className="space-y-1 w-20">
                        <label className="text-[9px] text-slate-500 uppercase font-bold">Temp</label>
                        <input
                            type="number" step="0.1" min="0" max="2"
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-xs rounded-md text-white outline-none"
                            value={form.model.temperature ?? 0.7}
                            onChange={e => setForm({ ...form, model: { ...form.model, temperature: parseFloat(e.target.value) }})}
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 uppercase font-bold ml-1">API Key</label>
                    <input
                        type="password"
                        className="w-full bg-slate-950 border border-slate-800 p-2 text-xs rounded-md text-white outline-none focus:border-blue-500"
                        value={form.model.apiKey || ''}
                        onChange={e => setForm({ ...form, model: { ...form.model, apiKey: e.target.value }})}
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">System Prompt</label>
                <textarea
                    rows={4}
                    className="w-full bg-slate-900 border border-slate-800 p-3 text-xs rounded-md text-slate-300 outline-none focus:border-blue-500 resize-none font-mono"
                    value={form.systemPrompt || ''}
                    onChange={e => setForm({ ...form, systemPrompt: e.target.value })}
                />
            </div>

            <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold text-xs uppercase shadow-lg transition-all flex items-center justify-center gap-2 text-white"
            >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {form.id ? 'Update Agent' : 'Deploy Agent'}
            </Button>
        </div>
    );
};
const RouteAgentSelector: FC<{ value: any, onChange: (name: string, value: any) => void }> = ({ value, onChange }) => {
    const { routingConfigs, agents, agentTools, fetchInitialData, assignAgentToRoute, removeAgentFromRoute, assignTool, unlinkTool, deleteRoutingConfig, deleteAgent, loading } = useConfigStore();
    const { openDialog, closeDialog, id } = useDialogDataStore();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRouteName, setSelectedRouteName] = useState<string>(value?.value ?? value ?? "");
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const runAction = async (action: () => Promise<void>) => {
        await action();
        await fetchInitialData();
    };


    return (
        <div className="relative w-full" ref={containerRef}>
            <label className="text-[10px] font-bold uppercase text-slate-500 ml-1 mb-2 block">Intelligence Strategy</label>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className={cn("w-full flex items-center justify-between rounded-md border px-3 py-2.5 text-sm bg-slate-900/50", selectedRouteName ? "border-emerald-500/50" : "border-slate-800")}>
                <div className="flex items-center gap-2">{loading ? <Loader size={14} className="animate-spin text-blue-400" /> : <GitBranch size={14} className="text-emerald-500" />}<span className={selectedRouteName ? "text-white" : "text-slate-500"}>{selectedRouteName || "Select Strategy..."}</span></div>
                <ChevronDown size={16} className={cn("text-slate-500 transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen && (
                <div className="absolute z-[100] mt-2 w-full max-h-[500px] overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 shadow-2xl">
                    <div className="sticky top-0 z-50 bg-slate-900 p-2 grid grid-cols-3 gap-1.5 border-b border-slate-800">
                        <button type="button" onClick={() => openDialog({ type: "info", title: "New Route Agent", children: <CreateRoutingForm onSuccess={() => { closeDialog(id); }} /> })} className="py-2 bg-emerald-600/10 border border-emerald-500/30 rounded-lg text-[8px] font-bold text-emerald-400">ROUTE AGENT</button>
                        <button type="button" onClick={() => openDialog({ type: "info", title: "New Agent", children: <CreateAgentForm onSuccess={() => { closeDialog(id); }} /> })} className="py-2 bg-blue-600/10 border border-blue-500/30 rounded-lg text-[8px] font-bold text-blue-400">AGENT</button>
                        <button type="button" onClick={() => openDialog({ type: "info", title: "Tools", fullscreen: true, children: <CreateToolForm onSuccess={() => { closeDialog(id); }} /> })} className="py-2 bg-amber-600/10 border border-amber-500/30 rounded-lg text-[8px] font-bold text-amber-400">TOOL</button>
                    </div>
                    <div className="p-1">
                        {routingConfigs?.map((route) => (
                            <div key={route.id} className={cn("m-2 p-4 rounded-xl border border-transparent hover:bg-slate-900/40", selectedRouteName === route.routeName && "bg-blue-600/5 border-blue-500/20")}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex flex-col"><span
                                        className="text-xs font-bold text-white flex items-center gap-2"><GitBranch
                                        size={14} className="text-blue-400"/> {route.routeName}</span><span
                                        className="text-[8px] text-slate-600">ID: {route.id}</span></div>
                                    <div className="flex items-center gap-1.5">
                                        <button type="button" onClick={(e) => {
                                            e.stopPropagation();
                                            openDialog({
                                                type: "info",
                                                title: "Edit Strategy",
                                                children: <CreateRoutingForm initialData={route} onSuccess={() => {
                                                    closeDialog(id);
                                                    fetchInitialData();
                                                }}/>
                                            });
                                        }} className="p-1 text-blue-400 hover:text-blue-300"><Edit2 size={13}/></button>
                                        <button type="button" onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm(`Delete strategy?`)) runAction(() => deleteRoutingConfig(route.id!));
                                        }} className="p-1 text-slate-600 hover:text-red-500"><Trash2 size={13}/>
                                        </button>
                                        <button type="button" onClick={() => {
                                            console.log(route)
                                            setSelectedRouteName(route.routeName);
                                            onChange("routeAgent", route.routeName);
                                            setIsOpen(false);
                                        }}
                                                className={cn("text-[10px] font-bold px-3 py-1.5 rounded-lg border", selectedRouteName === route.routeName ? "bg-emerald-600 text-white" : "text-slate-400")}>{selectedRouteName === route.routeName ?
                                            <CheckCircle2 size={12}/> : "SELECT"}</button>
                                    </div>
                                </div>
                                <div className="space-y-3 pl-3 border-l-2 border-slate-800/50">
                                    <div className="flex items-center justify-between"><span
                                        className="text-[9px] font-bold text-slate-500 uppercase">Fleet</span><select
                                        className="bg-slate-800 text-[9px] text-blue-400 rounded px-2"
                                        onChange={(e) => e.target.value && runAction(() => assignAgentToRoute(route.id, Number(e.target.value), selectedRouteName))}
                                        value="">
                                        <option value="">+ Link</option>
                                        {agents?.filter(a => !route.agents?.some((ra: any) => ra.id === a.id)).map(a =>
                                            <option key={a.id} value={a.id!}>{a.displayName}</option>)}</select></div>
                                    {route.agents?.map((agent: any) => (
                                        <div key={agent.id} className="bg-slate-900/60 p-3 rounded-lg space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className="text-[10px] text-slate-200 flex items-center gap-2"><Bot
                                                    size={12} className="text-blue-400"/> {agent.displayName}</span>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => openDialog({
                                                        type: "info",
                                                        title: "Edit Agent",
                                                        children: <CreateAgentForm initialData={agent}
                                                                                   onSuccess={() => {
                                                                                       closeDialog(id);
                                                                                       fetchInitialData();
                                                                                   }}/>
                                                    })} className="text-blue-400 hover:text-blue-300"><Edit2 size={11}/>
                                                    </button>
                                                    <button onClick={() => {
                                                        if (confirm(`Delete agent ${agent.agentName}?`)) runAction(() => deleteAgent(agent.id!));
                                                    }} className="text-slate-600 hover:text-red-500"><Trash2 size={11}/>
                                                    </button>
                                                    <button
                                                        onClick={() => runAction(() => removeAgentFromRoute(route.id, agent.id, selectedRouteName))}
                                                        className="text-slate-600 hover:text-amber-500 ml-2"
                                                        title="Unlink from Route"><X size={11}/></button>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {agent.tools?.map((t: IAgentTool) => (
                                                    <span key={t.toolName} className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-[11px] font-bold text-emerald-400 border border-emerald-500/30 rounded uppercase tracking-wide shadow-sm">
                                                        {t.toolDisplayName}
                                                        <button
                                                            onClick={() => runAction(() => unlinkTool(agent.id, t.toolName, selectedRouteName))}
                                                            className="hover:text-red-400 transition-colors"
                                                        >
                                                            <X size={11} strokeWidth={3} />
                                                        </button>
                                                    </span>
                                                ))}
                                                <select
                                                    className="bg-transparent text-[10px] font-semibold text-slate-500 hover:text-blue-400 outline-none cursor-pointer"
                                                    onChange={(e) => e.target.value && runAction(() => assignTool(agent.id, e.target.value, selectedRouteName))}
                                                    value="">
                                                    <option value="">+ Tool</option>
                                                    {agentTools?.filter(t => !agent.tools?.some((at: any) => at.toolName === t.toolName)).map(t =>
                                                        <option key={t.toolName}
                                                                value={t.toolName!}>{t.toolDisplayName}</option>)}
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
