"use client";

import React, { useEffect } from 'react';
import {Plus, Trash2, Link as LinkIcon} from 'lucide-react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useReactFlow, useEdges} from "@xyflow/react";

type LogicControllerProps = {
    node: any;
    onChange: (propName: string, value: any) => void;
};

const LogicController: React.FC<LogicControllerProps> = ({node, onChange}) => {
    const { setEdges, getNode } = useReactFlow();
    const edges = useEdges();

    if (!node) return null;

    const outputs = node.data?.outputs || [];

    const getTargetData = (handleId: string) => {
        const edge = edges.find(e => e.source === node.id && e.sourceHandle === handleId);
        if (!edge) return null;

        const targetNode = getNode(edge.target);
        if (!targetNode) return null;

        return {
            id: targetNode.id,
            label: targetNode.data?.label || targetNode.id,
            type: targetNode.type
        };
    };

    const emit = (newOutputs: any[]) => {
        onChange("logic", newOutputs);
    };

    useEffect(() => {
        const hasChanges = outputs.some((out: any) => {
            const currentTarget = getTargetData(out.id);
            return JSON.stringify(out.targetNode) !== JSON.stringify(currentTarget);
        });

        if (hasChanges) {
            const updatedOutputs = outputs.map((out: any) => ({
                ...out,
                targetNode: getTargetData(out.id)
            }));
            emit(updatedOutputs);
        }
    }, [edges]);

    const updateOutputField = (id: string, field: string, value: string) => {
        const updatedOutputs = outputs.map((out: any) =>
            out.id === id ? {...out, [field]: value} : out
        );
        emit(updatedOutputs);
    };

    const handleRemove = (id: string) => {
        setEdges((eds) => eds.filter((e) => !(e.source === node.id && e.sourceHandle === id)));
        const updatedOutputs = outputs.filter((out: any) => out.id !== id);
        emit(updatedOutputs);
    };

    const handleAddOutput = () => {
        const newOutput = {
            id: `out-${crypto.randomUUID()}`,
            label: `Output ${outputs.length + 1}`,
            value: "",
            type: 'source',
            targetNode: null
        };
        emit([...outputs, newOutput]);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Output Logic Configuration
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddOutput}
                    className="h-6 px-2 text-[10px] text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/10 gap-1"
                >
                    <Plus size={12}/> Add
                </Button>
            </div>

            <div className="space-y-4">
                {outputs.map((out: any) => {
                    const target = out.targetNode;

                    return (
                        <div key={out.id} className="p-3 bg-slate-950/50 rounded-lg border border-slate-800 space-y-3 relative group">
                            <button
                                onClick={() => handleRemove(out.id)}
                                className="absolute top-2 right-2 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={14}/>
                            </button>

                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Output Name</label>
                                <Input
                                    className="h-8 text-[11px] bg-slate-900 border-slate-800 focus-visible:ring-indigo-500/50 text-slate-200"
                                    value={out.label || ""}
                                    placeholder="e.g. Success, Failure"
                                    onChange={(e) => updateOutputField(out.id, 'label', e.target.value)}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Logic Condition</label>
                                <Input
                                    className="h-8 text-[11px] bg-slate-900 border-slate-800 focus-visible:ring-indigo-500/50 text-slate-200 font-mono"
                                    value={out.value || ""}
                                    placeholder="e.g. status === 200"
                                    onChange={(e) => updateOutputField(out.id, 'value', e.target.value)}
                                />
                            </div>

                            <div className="pt-1 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 px-1">
                                    <div className="flex items-center gap-1.5">
                                        <LinkIcon size={10} className={target ? "text-emerald-500" : "text-slate-600"} />
                                        <span className="text-[9px] text-slate-500 font-medium">
                                            Target: <span className={target ? "text-slate-300 transition-colors" : "text-slate-600 italic transition-colors"}>
                                                {target?.label || "Not connected"}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[8px] text-slate-700 font-mono uppercase tracking-tighter">ID: {out.id.split('-')[0]}</span>
                            </div>
                        </div>
                    );
                })}

                {outputs.length === 0 && (
                    <div className="text-[10px] text-slate-600 italic text-center py-6 border border-dashed border-slate-800 rounded-md">
                        No logic outputs defined. Click "+" to add one.
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogicController;
