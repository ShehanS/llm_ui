"use client";

import React, {useEffect, useState} from 'react';
import {useConfigStore} from "@/components/reactflow/agent-config/data_service";
import {BaseSelect} from "@/app/components/base-select";
import {
    BrainCircuit,
    Edit3,
    Key,
    Plus,
    PlusCircle,
    Save,
    Sparkles,
    Terminal,
    Trash2,
    User,
    Wrench,
    X
} from "lucide-react";

export const OrchestratorManager = () => {
    const [activeTab, setActiveTab] = useState<'routing' | 'agents' | 'tools'>('routing');
    const {currentRouteName, fetchInitialData} = useConfigStore();

    useEffect(() => {
        fetchInitialData(currentRouteName || "test");
    }, []);

    return (
        <div
            className="flex flex-col h-[850px] bg-slate-950 text-slate-200 border border-slate-800 rounded-xl overflow-hidden shadow-2xl mx-auto w-full max-w-6xl">
            <div className="flex border-b border-slate-800 bg-slate-900/50 p-1.5">
                {[
                    {id: 'routing', label: 'Routing Strategies', icon: BrainCircuit},
                    {id: 'agents', label: 'Agent Fleet', icon: User},
                    {id: 'tools', label: 'Capabilities', icon: Wrench},
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-md transition-all ${
                            activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                        }`}
                    >
                        <tab.icon size={14}/>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-hidden">
                {activeTab === 'routing' && <RoutingTab/>}
                {activeTab === 'agents' && <AgentsTab/>}
                {activeTab === 'tools' && <ToolsTab/>}
            </div>
        </div>
    );
};


const RoutingTab = () => {
    const {
        routingConfigs, routingConfig, agents, loading,
        fetchRoutingConfig, updateRoutingConfig, createNewRouting, deleteRoutingConfig
    } = useConfigStore();

    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState({
        routeName: '',
        classifierModel: {provider: 'openai', name: 'gpt-4o-mini', apiKey: ''},
        fallbackAgent: '',
        routingPrompt: ''
    });

    useEffect(() => {
        if (routingConfig && !isAdding) {
            setForm({
                routeName: routingConfig.routeName || '',
                classifierModel: {
                    provider: routingConfig.classifierModel?.provider || 'openai',
                    name: routingConfig.classifierModel?.name || 'gpt-4o-mini',
                    apiKey: routingConfig.classifierModel?.apiKey || ''
                },
                fallbackAgent: routingConfig.fallbackAgent || '',
                routingPrompt: routingConfig.routingPrompt || ''
            });
        }
    }, [routingConfig, isAdding]);

    const handleSave = async () => {
        if (isAdding) {
            await createNewRouting(form);
            setIsAdding(false);
        } else {
            await updateRoutingConfig({...form, id: routingConfig?.id});
        }
    };

    return (
        <div className="grid grid-cols-12 h-full">
            <div className="col-span-4 border-r border-slate-800 p-6 bg-slate-900/20 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Routes</h4>
                    <button onClick={() => {
                        setIsAdding(true);
                        setForm({
                            routeName: 'new-route',
                            classifierModel: {provider: 'openai', name: 'gpt-4o-mini', apiKey: ''},
                            fallbackAgent: '',
                            routingPrompt: ''
                        });
                    }} className="text-blue-400 hover:scale-110 transition-transform"><PlusCircle size={20}/></button>
                </div>
                <div className="space-y-2">
                    {routingConfigs?.map((rc) => (
                        <div key={rc.id}
                             className={`group flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${routingConfig?.id === rc.id ? 'bg-blue-600/10 border-blue-500/50' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}
                             onClick={() => {
                                 setIsAdding(false);
                                 fetchRoutingConfig(rc.routeName);
                             }}>
                            <span
                                className={`text-xs font-mono ${routingConfig?.id === rc.id ? 'text-blue-400 font-bold' : 'text-slate-400'}`}>{rc.routeName}</span>
                            <button onClick={(e) => {
                                e.stopPropagation();
                                deleteRoutingConfig(rc.id!);
                            }}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-red-500 transition-all">
                                <Trash2 size={12}/></button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="col-span-8 p-8 overflow-y-auto bg-slate-950">
                <div className="max-w-2xl space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Route Name</label>
                        <input
                            className="w-full bg-slate-900 border border-slate-800 rounded-md p-2.5 text-xs font-mono text-blue-400"
                            value={form.routeName} disabled={!isAdding}
                            onChange={(e) => setForm({...form, routeName: e.target.value})}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Provider</label>
                            <BaseSelect value={form.classifierModel.provider} onChange={(e) => setForm({
                                ...form,
                                classifierModel: {...form.classifierModel, provider: e.target.value}
                            })}>
                                <option value="openai">OpenAI</option>
                                <option value="anthropic">Anthropic</option>
                            </BaseSelect>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Model</label>
                            <input
                                className="w-full bg-slate-900 border border-slate-800 rounded-md p-2.5 text-xs text-white"
                                value={form.classifierModel.name} onChange={(e) => setForm({
                                ...form,
                                classifierModel: {...form.classifierModel, name: e.target.value}
                            })}/>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Key
                            size={10}/> API Key</label>
                        <input type="password" placeholder="sk-..."
                               className="w-full bg-slate-900 border border-slate-800 rounded-md p-2.5 text-xs text-white"
                               value={form.classifierModel.apiKey} onChange={(e) => setForm({
                            ...form,
                            classifierModel: {...form.classifierModel, apiKey: e.target.value}
                        })}/>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Fallback Agent</label>
                        <BaseSelect value={form.fallbackAgent}
                                    onChange={(e) => setForm({...form, fallbackAgent: e.target.value})}>
                            <option value="">None</option>
                            {agents.map(a => <option key={a.id} value={a.agentName}>{a.displayName}</option>)}
                        </BaseSelect>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">System Prompt</label>
                        <textarea rows={8}
                                  className="w-full bg-black/40 border border-slate-800 rounded-md p-4 text-xs font-mono text-slate-300"
                                  value={form.routingPrompt}
                                  onChange={(e) => setForm({...form, routingPrompt: e.target.value})}/>
                    </div>
                    <button onClick={handleSave} disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-md font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20">{loading ?
                        <Sparkles size={14} className="animate-pulse"/> :
                        <Save size={14}/>} {isAdding ? 'CREATE STRATEGY' : 'UPDATE STRATEGY'}</button>
                </div>
            </div>
        </div>
    );
};


const AgentsTab = () => {
    const {agents, tools, createNewAgent, updateAgent, deleteAgent, assignTool, unlinkTool} = useConfigStore();
    const [modal, setModal] = useState<any>(null);

    const handleAgentSave = async () => {
        if (!modal) return;

        try {

            if (modal.id) {
                await updateAgent(modal);
            } else {
                await createNewAgent(modal);
            }
            setModal(null);
        } catch (error) {
            console.error("Failed to save agent:", error);
        }
    };

    return (
        <div className="p-8 space-y-6 overflow-y-auto h-full">
            <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Agent Fleet</h3>
                <button
                    onClick={() => setModal({
                        agentName: '',
                        displayName: '',
                        systemPrompt: '',
                        model: {provider: 'openai', name: 'gpt-4o', temperature: 0.7}
                    })}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase bg-blue-600 text-white px-5 py-2.5 rounded-md hover:bg-blue-500 transition-all"
                >
                    <Plus size={14}/> New Agent
                </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {agents.map(agent => (
                    <div key={agent.id} className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-5">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400"><User size={20}/></div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">{agent.displayName}</h4>
                                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">{agent.agentName}</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => setModal(agent)}
                                        className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-md transition-all">
                                    <Edit3 size={14}/>
                                </button>
                                <button onClick={() => deleteAgent(agent.id!)}
                                        className="p-2 text-slate-500 hover:text-red-500 hover:bg-slate-800 rounded-md transition-all">
                                    <Trash2 size={14}/>
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase text-slate-600 tracking-widest">Active
                                Capabilities</label>
                            <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                                {agent.tools?.map((t: any) => (
                                    <span key={t.id}
                                          className="flex items-center gap-2 px-2.5 py-1 bg-slate-800 text-[10px] font-mono text-blue-400 border border-slate-700 rounded-md group">
                                        <Terminal size={10}/> {t.name}
                                        <button onClick={() => unlinkTool(agent.id!, t.id)}
                                                className="text-slate-600 hover:text-red-500">
                                            <X size={10}/>
                                        </button>
                                    </span>
                                ))}
                                <div className="relative">
                                    <BaseSelect
                                        className="w-36 py-1 text-[10px] bg-transparent border-dashed border-slate-700"
                                        value=""
                                        onChange={(e) => assignTool(agent.id!, Number(e.target.value))}
                                    >
                                        <option value="">+ Link Tool</option>
                                        {tools.filter(t => !agent.tools?.some((at: any) => at.id === t.id)).map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </BaseSelect>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {modal && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
                    <div
                        className="bg-slate-950 border border-slate-800 p-8 rounded-2xl w-full max-w-lg space-y-6 shadow-2xl">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-blue-400">
                                {modal.id ? 'Edit Agent' : 'Create Agent'}
                            </h3>
                            <button onClick={() => setModal(null)}><X size={20}/></button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">Agent ID
                                    Name</label>
                                <input placeholder="e.g. supportAgent"
                                       className="w-full bg-slate-900 border border-slate-800 p-3 text-xs rounded-md text-white"
                                       value={modal.agentName}
                                       onChange={e => setModal({...modal, agentName: e.target.value})}/>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">Display
                                    Label</label>
                                <input placeholder="e.g. Support Specialist"
                                       className="w-full bg-slate-900 border border-slate-800 p-3 text-xs rounded-md text-white"
                                       value={modal.displayName}
                                       onChange={e => setModal({...modal, displayName: e.target.value})}/>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">System
                                    Instructions</label>
                                <textarea placeholder="You are a helpful assistant..." rows={6}
                                          className="w-full bg-slate-900 border border-slate-800 p-4 text-xs rounded-md font-mono text-slate-300"
                                          value={modal.systemPrompt}
                                          onChange={e => setModal({...modal, systemPrompt: e.target.value})}/>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={handleAgentSave}
                                className="flex-1 bg-blue-600 py-3 rounded-xl font-bold text-xs uppercase shadow-lg shadow-blue-900/30 hover:bg-blue-500 transition-all"
                            >
                                {modal.id ? 'Update Agent' : 'Create Agent'}
                            </button>
                            <button
                                onClick={() => setModal(null)}
                                className="flex-1 bg-slate-800 py-3 rounded-xl font-bold text-xs uppercase text-slate-400 hover:bg-slate-700 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* --- TOOL REGISTRY TAB --- */
const ToolsTab = () => {
    const {tools, createNewTool, updateTool, deleteTool} = useConfigStore();
    const [modal, setModal] = useState<any>(null);

    return (
        <div className="p-8 space-y-6 overflow-y-auto h-full bg-slate-950">
            <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Tools Registry</h3>
                <button onClick={() => setModal({name: '', description: '', type: 'script', code: ''})}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase bg-emerald-600 text-white px-5 py-2.5 rounded-md hover:bg-emerald-500 transition-all">
                    <Plus size={14}/> Register Tool
                </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {tools.map(tool => (
                    <div key={tool.id}
                         className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl group hover:border-emerald-500/30 transition-all">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2 bg-emerald-600/10 rounded-lg text-emerald-500"><Terminal size={18}/>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setModal(tool)}
                                        className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-md">
                                    <Edit3 size={14}/></button>
                                <button onClick={() => deleteTool(tool.id!)}
                                        className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-slate-800 rounded-md">
                                    <Trash2 size={14}/></button>
                            </div>
                        </div>
                        <h4 className="text-sm font-bold text-slate-200 mb-1">{tool.name}</h4>
                        <p className="text-[10px] text-slate-500 line-clamp-2 h-8">{tool.description || 'No description provided.'}</p>
                        <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                            <span
                                className="text-[9px] font-bold px-2 py-0.5 bg-slate-800 rounded uppercase tracking-widest text-slate-400">{tool.type}</span>
                        </div>
                    </div>
                ))}
            </div>

            {modal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-6">
                    <div
                        className="bg-slate-950 border border-slate-800 p-8 rounded-2xl w-full max-w-4xl space-y-6 shadow-2xl">
                        <div className="flex justify-between items-center"><h3
                            className="font-bold text-sm uppercase tracking-widest text-emerald-500">{modal.id ? 'Edit Tool' : 'Register New Tool'}</h3>
                            <button onClick={() => setModal(null)}><X size={20}/></button>
                        </div>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-4 space-y-4">
                                <input placeholder="Tool Name"
                                       className="w-full bg-slate-900 border border-slate-800 p-3 text-xs rounded-md"
                                       value={modal.name} onChange={e => setModal({...modal, name: e.target.value})}/>
                                <BaseSelect value={modal.type}
                                            onChange={e => setModal({...modal, type: e.target.value})}>
                                    <option value="script">Local Script (JS)</option>
                                    <option value="api">External API</option>
                                </BaseSelect>
                                <textarea placeholder="Description" rows={4}
                                          className="w-full bg-slate-900 border border-slate-800 p-3 text-xs rounded-md"
                                          value={modal.description}
                                          onChange={e => setModal({...modal, description: e.target.value})}/>
                            </div>
                            <div className="col-span-8 space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">JavaScript
                                    Implementation</label>
                                <textarea rows={15}
                                          className="w-full bg-black border border-slate-800 p-4 text-xs font-mono text-emerald-400 rounded-md scrollbar-thin scrollbar-thumb-slate-800"
                                          value={modal.code}
                                          onChange={e => setModal({...modal, code: e.target.value})}/>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4 border-t border-slate-800">
                            <button onClick={() => {
                                modal.id ? updateTool(modal.id, modal) : createNewTool(modal);
                                setModal(null);
                            }}
                                    className="flex-1 bg-emerald-600 py-3 rounded-xl font-bold text-xs uppercase shadow-lg shadow-emerald-900/30 hover:bg-emerald-500">Save
                                Tool
                            </button>
                            <button onClick={() => setModal(null)}
                                    className="w-32 bg-slate-800 py-3 rounded-xl font-bold text-xs uppercase text-slate-400">Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
