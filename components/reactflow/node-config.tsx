"use client";

import React from "react";
import { ObjectMapper } from "@/components/reactflow/object-mapper";
import {
    ChevronLeft,
    ChevronRight,
    Settings2,
    SlidersHorizontal,
    Info, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
    node: any;
    onChange: (name: string, value: any) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
};

export const NodeConfigForm: React.FC<Props> = ({ node, onChange, isOpen, setIsOpen }) => {
    const hasProps = !!node?.data?.inputProps?.length;

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed top-1/2 -translate-y-1/2 z-50 flex h-10 w-6 items-center justify-center rounded-l-lg border border-r-0 border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-300 shadow-2xl",
                    isOpen ? "right-[320px]" : "right-0"
                )}
                title={isOpen ? "Collapse Properties" : "Expand Properties"}
            >
                {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
            <div
                className={cn(
                    "fixed right-0 top-0 z-40 h-full border-l border-slate-800 bg-slate-950 transition-all duration-300 ease-in-out shadow-2xl overflow-hidden flex flex-col",
                    isOpen ? "w-[320px] translate-x-0" : "w-0 translate-x-full"
                )}
            >
                <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6 shrink-0 bg-slate-950/50 backdrop-blur-sm">
                    <Settings2 size={18} className="text-emerald-500" />
                    <div className="flex flex-col">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">
                            Properties
                        </h3>
                        {node && (
                            <span className="text-[9px] text-slate-500 font-mono truncate w-48">
                                NODE_ID: {node.id}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    {!node ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
                            <div className="p-4 rounded-full bg-slate-900">
                                <Info size={32} className="text-slate-500" />
                            </div>
                            <p className="text-xs text-slate-400 italic px-10">
                                Select a node on the canvas to configure its properties.
                            </p>
                        </div>
                    ) : !hasProps ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-2 opacity-50">
                            <SlidersHorizontal size={24} className="text-slate-600" />
                            <p className="text-xs text-slate-400 italic">No configuration available for this node type.</p>
                        </div>
                    ) : (
                        <div className="space-y-6 pb-10">
                            {node.data.inputProps.map((prop: any) => {
                                switch (prop?.type) {
                                    case "text":
                                        return (
                                            <div key={prop.name} className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                                                    {prop.displayName}
                                                </label>
                                                <input
                                                    className="w-full rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all"
                                                    value={prop.value ?? ""}
                                                    onChange={(e) => onChange(prop.name, e.target.value)}
                                                    placeholder={prop.placeholder || "Enter value..."}
                                                />
                                            </div>
                                        );

                                    case "number":
                                        return (
                                            <div key={prop.name} className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                                                    {prop.displayName}
                                                </label>
                                                <input
                                                    type="number"
                                                    className="w-full rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all"
                                                    value={prop.value ?? 0}
                                                    onChange={(e) => onChange(prop.name, Number(e.target.value))}
                                                />
                                            </div>
                                        );

                                    case "select":
                                        return (
                                            <div key={prop.name} className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                                                    {prop.displayName}
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/40 appearance-none cursor-pointer"
                                                        value={prop.value ?? ""}
                                                        onChange={(e) => onChange(prop.name, e.target.value)}
                                                    >
                                                        {prop.values?.map((v: any) => (
                                                            <option key={v.value} value={v.value} className="bg-slate-900">
                                                                {v.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                        <ChevronDown size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        );

                                    case "checkBox":
                                        return (
                                            <label key={prop.name} className="flex items-center group cursor-pointer py-1 select-none">
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="peer h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0 focus:ring-offset-0 transition-all"
                                                        checked={!!prop.value}
                                                        onChange={(e) => onChange(prop.name, e.target.checked)}
                                                    />
                                                </div>
                                                <span className="ml-3 text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
                                                    {prop.displayName}
                                                </span>
                                            </label>
                                        );

                                    case "mapper":
                                        return (
                                            <div key={prop.name} className="space-y-3 pt-4 border-t border-slate-800 mt-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                                                    {prop.displayName}
                                                </label>
                                                <ObjectMapper onChange={onChange} value={prop} />
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
