"use client";

import React, {useEffect, useMemo, useState} from "react";
import {useConfigStore} from "@/components/reactflow/agent-config/data_service";
import {MinusCircle, Terminal, User, Wrench} from "lucide-react";
import {BaseSelect} from "@/app/components/base-select";

export const AgentConfig = () => {
    const {
        agents,
        tools,
        fetchInitialData,
        assignTool,
        unlinkTool,
    } = useConfigStore();

    const [selectedAgentId, setSelectedAgentId] = useState<number | "">("");

    const handleSelectAgent = (id: number) => {
        console.log(id)
        console.log(agents)
        setSelectedAgentId(id);
    }

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const selectedAgent = useMemo(
        () => agents.find((a) => a.id === selectedAgentId),
        [agents, selectedAgentId]
    );

    const availableTools = useMemo(() => {
        if (!selectedAgent) return [];
        return tools.filter(
            (t) => !selectedAgent.tools?.some((at: any) => at.id === t.id)
        );
    }, [tools, selectedAgent]);

    return (
        <div className="space-y-4">
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <BaseSelect
                    value={selectedAgentId}
                    onChange={(e) => handleSelectAgent(Number(e.target.value))}
                    rightIcon={<User size={14}/>}
                >
                    <option value="" disabled>
                        Select Agent...
                    </option>

                    {agents && agents.map((agent) => (
                        <option
                            key={agent.id ?? `agent-${Math.random()}`}
                            value={agent.id ?? ""}
                        >
                            {agent.displayName || agent.agentName || "Unknown Agent"}
                        </option>
                    ))}
                </BaseSelect>
            </div>

            {selectedAgent && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-300">
                    {/* ADD TOOL */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                            Link New Capability
                        </label>

                        <BaseSelect
                            value=""
                            onChange={(e) => {
                                if (selectedAgentId !== "") {
                                    assignTool(selectedAgentId as number, Number(e.target.value));
                                }
                            }}
                            rightIcon={<Wrench size={14}/>}
                            className="text-slate-400"
                        >
                            <option value="" disabled>
                                + Add Tool Skill...
                            </option>

                            {availableTools.map((tool) => (
                                <option
                                    key={tool.id ?? `tool-${Math.random()}`}
                                    value={tool.id ?? ""}
                                >
                                    {tool.name}
                                </option>
                            ))}
                        </BaseSelect>
                    </div>

                    {/* ASSIGNED TOOLS LIST */}
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase text-slate-600 ml-1 mb-1 block">
                            Active Skills
                        </label>
                        {selectedAgent.tools?.map((t: any) => (
                            <div
                                key={t.id}
                                className="flex items-center justify-between p-2 bg-slate-900/30 border border-slate-800/40 rounded-md group hover:border-slate-700 transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <Terminal
                                        size={11}
                                        className="text-slate-600 group-hover:text-blue-500 transition-colors"
                                    />
                                    <span className="text-[11px] font-mono text-slate-400 group-hover:text-slate-200">
                                        {t.name}
                                    </span>
                                </div>

                                <button
                                    onClick={() =>
                                        selectedAgentId !== "" &&
                                        unlinkTool(selectedAgentId as number, t.id)
                                    }
                                    className="text-slate-700 hover:text-red-500 transition-colors"
                                    title="Unlink Tool"
                                >
                                    <MinusCircle size={13}/>
                                </button>
                            </div>
                        ))}
                        {(!selectedAgent.tools || selectedAgent.tools.length === 0) && (
                            <p className="text-[10px] italic text-slate-700 ml-1 py-1">No tools assigned.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
