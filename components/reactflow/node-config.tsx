"use client";

import React from "react";
import {ObjectMapper} from "@/components/reactflow/object-mapper";
import {ChevronDown, ChevronLeft, ChevronRight, Info, Settings2, SlidersHorizontal} from "lucide-react";
import {cn} from "@/lib/utils";
import RouteAgentSelector from "@/app/components/route-agent-selector";
import {Switch} from "@/components/ui/switch";
import Approval from "@/components/reactflow/Approval";

type Props = {
    node: any;
    onChange: (name: string, value: any) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
};

export const NodeConfigForm: React.FC<Props> = ({node, onChange, isOpen, setIsOpen}) => {
    const hasProps = !!node?.data?.inputProps?.length;

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed top-1/2 -translate-y-1/2 z-50 flex h-10 w-6 items-center justify-center rounded-l-lg border border-r-0 border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-300 shadow-2xl",
                    isOpen ? "right-[450px]" : "right-0"
                )}
                title={isOpen ? "Collapse Properties" : "Expand Properties"}
            >
                {isOpen ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
            </button>

            {/* MAIN PANEL */}
            <div
                className={cn(
                    "fixed right-0 top-0 z-40 h-full border-l border-slate-800 bg-slate-950 transition-all duration-300 ease-in-out shadow-2xl overflow-hidden flex flex-col",
                    isOpen ? "w-[450px] translate-x-0" : "w-0 translate-x-full"
                )}
            >

                <div
                    className="flex h-16 items-center gap-3 border-b border-slate-800 px-6 shrink-0 bg-slate-950/50 backdrop-blur-sm">
                    <Settings2 size={18} className="text-emerald-500"/>
                    <div className="flex flex-col">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">
                            Node Properties
                        </h3>
                        {node && (
                            <span className="text-[9px] text-slate-500 font-mono truncate w-64">
                                ID: {node.id}
                            </span>
                        )}
                    </div>
                </div>

                <div
                    className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent custom-scrollbar">
                    {!node ? (
                        <div
                            className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
                            <div className="p-4 rounded-full bg-slate-900">
                                <Info size={32} className="text-slate-500"/>
                            </div>
                            <p className="text-xs text-slate-400 italic px-10">
                                Select a node to modify its intelligence parameters.
                            </p>
                        </div>
                    ) : !hasProps ? (
                        <div
                            className="flex flex-col items-center justify-center py-20 text-center space-y-2 opacity-50">
                            <SlidersHorizontal size={24} className="text-slate-600"/>
                            <p className="text-xs text-slate-400 italic">No static properties found.</p>
                        </div>
                    ) : (
                        <div className="space-y-6 pb-20">
                            {node.data.inputProps.map((prop: any) => {
                                switch (prop?.type) {
                                    case "text":
                                        return (
                                            <div key={prop.name} className="space-y-2">
                                                <label
                                                    className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">{prop.displayName}</label>
                                                <input
                                                    className="w-full rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all"
                                                    value={prop.value ?? ""}
                                                    onChange={(e) => onChange(prop.name, e.target.value)}
                                                />
                                            </div>
                                        );

                                    case "select":
                                        return (
                                            <div key={prop.name} className="space-y-2">
                                                <label
                                                    className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">{prop.displayName}</label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                                                        value={prop.value ?? ""}
                                                        onChange={(e) => onChange(prop.name, e.target.value)}
                                                    >
                                                        {prop.values?.map((v: any) => (
                                                            <option key={v.value} value={v.value}
                                                                    className="bg-slate-900">{v.name}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown size={14}
                                                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"/>
                                                </div>
                                            </div>
                                        );

                                    case "mapper":
                                        return (
                                            <div key={prop.name}
                                                 className="space-y-3 pt-4 border-t border-slate-800 mt-2">
                                                <label
                                                    className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">{prop.displayName}</label>
                                                <ObjectMapper onChange={onChange} value={prop}/>
                                            </div>
                                        );

                                    case "approval":
                                        return (
                                           <Approval key={1} onChange={onChange} value={prop.value} values={prop.values}/>
                                        )

                                    case "routeAgent":
                                        return (
                                            <div key={prop.name} className="space-y-2">
                                                <label
                                                    className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">{prop.displayName}</label>
                                                <div className="relative">
                                                    <RouteAgentSelector onChange={onChange} value={prop}/>
                                                </div>

                                            </div>
                                        );

                                    default:
                                        return null;
                                }
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
