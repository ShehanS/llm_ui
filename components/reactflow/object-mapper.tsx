"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Code, Database, Layers } from "lucide-react";
import {BaseSelect} from "@/app/components/base-select";


type MapperItem = {
    key: string;
    value: string;
};

type ObjectMapperProps = {
    value?: {
        name: string;
        value?: {
            payloadSource?: string;
            payloadExpression?: string;
            map?: MapperItem[];
        };
    };
    onChange: (name: string, value: any) => void;
};

export const ObjectMapper: React.FC<ObjectMapperProps> = ({ value, onChange }) => {
    const name = value?.name;

    const detectMode = () => {
        if (value?.value?.map) return "mapper";
        if (value?.value?.payloadExpression) return "payloadExpression";
        return "payloadSource";
    };

    const [mode, setMode] = useState<"payloadSource" | "payloadExpression" | "mapper">(detectMode());
    const [payloadSource, setPayloadSource] = useState("body");
    const [payloadExpression, setPayloadExpression] = useState("");
    const [mapper, setMapper] = useState<MapperItem[]>([]);

    useEffect(() => {
        if (!value?.value) return;
        setPayloadSource(value.value.payloadSource ?? "");
        setPayloadExpression(value.value.payloadExpression ?? "");
        setMapper(structuredClone(value.value.map ?? []));
        setMode(detectMode());
    }, [value]);

    const emit = (next: any) => {
        if (!name) return;
        onChange(name, next);
    };

    const changeMode = (nextMode: typeof mode) => {
        setMode(nextMode);
        if (nextMode === "payloadSource") {
            emit({ payloadSource });
        } else if (nextMode === "payloadExpression") {
            emit({ payloadExpression });
        } else {
            emit({ map: mapper.length ? mapper : [{ key: "", value: "" }] });
        }
    };

    const addMapper = () => {
        const next = [...structuredClone(mapper), { key: "", value: "" }];
        setMapper(next);
        emit({ map: next });
    };

    const updateMapper = (index: number, field: "key" | "value", val: string) => {
        const next = structuredClone(mapper);
        next[index] = { ...next[index], [field]: val };
        setMapper(next);
        emit({ map: next });
    };

    const removeMapper = (index: number) => {
        const next = mapper.filter((_, i) => i !== index);
        setMapper(next);
        emit({ map: next });
    };

    const getModeIcon = () => {
        if (mode === "payloadSource") return <Database size={14} />;
        if (mode === "payloadExpression") return <Code size={14} />;
        return <Layers size={14} />;
    };

    return (
        <div className="space-y-4 w-full">
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                    Mapping Mode
                </label>
                <BaseSelect
                    value={mode}
                    onChange={(e) => changeMode(e.target.value as any)}
                    rightIcon={getModeIcon()}
                >
                    <option value="" disabled>
                        Select Mode...
                    </option>
                    <option value="payloadSource">Direct Source</option>
                    <option value="mapper">Key-Value Mapper</option>
                </BaseSelect>
            </div>

            {mode === "payloadSource" && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                        Source Target
                    </label>
                    <BaseSelect
                        value={payloadSource}
                        onChange={(e) => {
                            const val = e.target.value;
                            setPayloadSource(val);
                            emit({ payloadSource: val });
                        }}
                    >
                        <option value="" disabled>
                            Select Source...
                        </option>
                        <option value="body">Request Body</option>
                        <option value="headers">Request Headers</option>
                        <option value="query">Query Parameters</option>
                        <option value="all">Full Payload</option>
                    </BaseSelect>
                </div>
            )}

            {mode === "payloadExpression" && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                        Expression
                    </label>
                    <textarea
                        rows={3}
                        placeholder="{{body.data.id}}"
                        className="w-full rounded-md border border-slate-800 bg-black/40 px-3 py-2 text-xs text-emerald-400 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500/50 placeholder:text-slate-700 resize-none"
                        value={payloadExpression}
                        onChange={(e) => {
                            setPayloadExpression(e.target.value);
                            emit({ payloadExpression: e.target.value });
                        }}
                    />
                </div>
            )}

            {/* OBJECT MAPPER UI */}
            {mode === "mapper" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                        Field Mappings
                    </label>

                    <div className="space-y-4">
                        {mapper.map((item, index) => (
                            <div key={index} className="relative p-3 rounded-lg border border-slate-800 bg-slate-900/30 space-y-3">
                                <button
                                    type="button"
                                    onClick={() => removeMapper(index)}
                                    className="absolute -top-2 -right-2 p-1 bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-700 rounded-full shadow-lg transition-colors z-10"
                                >
                                    <Trash2 size={12} />
                                </button>

                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-slate-600 uppercase ml-1">Key</span>
                                    <input
                                        className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 placeholder:text-slate-700"
                                        placeholder="e.g. userId"
                                        value={item.key}
                                        onChange={(e) => updateMapper(index, "key", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-slate-600 uppercase ml-1">Value Expression</span>
                                    <input
                                        className="w-full rounded-md border border-slate-800 bg-black px-3 py-1.5 text-xs text-emerald-400 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500/50 placeholder:text-slate-800"
                                        placeholder="{{body.id}}"
                                        value={item.value}
                                        onChange={(e) => updateMapper(index, "value", e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addMapper}
                        className="flex items-center justify-center gap-2 w-full border border-dashed border-slate-800 py-3 text-[11px] font-medium text-slate-400 hover:border-slate-600 hover:text-slate-200 hover:bg-slate-900/50 transition-all rounded-md group"
                    >
                        <Plus size={14} className="group-hover:scale-110 transition-transform" />
                        Add New Mapping
                    </button>
                </div>
            )}
        </div>
    );
};
