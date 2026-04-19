"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Handle, Position, useUpdateNodeInternals } from "@xyflow/react";
import { useWorkflowStore } from "@/app/store/flow_data_store";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";

const NODE_WIDTH = 150;
const NODE_HEIGHT = 48;

const CommonNode: React.FC<any> = ({ id, data, selected }) => {
    const updateNodeInternals = useUpdateNodeInternals();

    const { traces, traceConnected, stopLiveTrace } = useWorkflowStore(
        useShallow((state) => ({
            traces: state.traces,
            traceConnected: state.traceConnected,
            stopLiveTrace: state.stopLiveTrace,
        }))
    );

    const [isHovered, setIsHovered] = useState(false);
    const [hoveredHandle, setHoveredHandle] = useState<string | null>(null);
    const [labelsVisible, setLabelsVisible] = useState(true);

    useEffect(() => {
        updateNodeInternals(id);
    }, [id, data.outputs, data.inputs, updateNodeInternals]);

    const getHandleColor = (handleId: string) => {
        const normalizedId = handleId?.toLowerCase();
        if (normalizedId === "error" || normalizedId === "false" || normalizedId === "no") return "#ef4444";
        if (normalizedId === "true" || normalizedId === "yes" || normalizedId === "success") return "#10b981";
        return "#6366f1";
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLabelsVisible(!labelsVisible);
    };

    const latestTrace = useMemo(() => {
        if (!traceConnected || !Array.isArray(traces)) return null;
        return [...traces].reverse().find((t) => String(t.nodeId) === String(id));
    }, [traces, id, traceConnected]);

    const nodeStatus = latestTrace?.status?.toUpperCase() || "IDLE";

    useEffect(() => {
        if (traceConnected && (nodeStatus === "COMPLETE" || nodeStatus === "ERROR")) {
            const timer = setTimeout(() => stopLiveTrace(), 1000000);
            return () => clearTimeout(timer);
        }
    }, [nodeStatus, traceConnected, stopLiveTrace]);

    const nodeStyle = useMemo(() => {
        const isRunning = nodeStatus === "RUNNING" && traceConnected;
        const isError = nodeStatus === "ERROR" && traceConnected;

        let borderColor = "rgb(30 41 59)";
        let shadow = "0 4px 6px -1px rgb(0 0 0 / 0.1)";
        let background = "rgb(2 6 23)";

        if (selected || isHovered) {
            borderColor = "#ffffff";
            shadow = "0 0 15px 2px rgba(255, 255, 255, 0.2)";
        } else if (isError) {
            borderColor = "#ef4444";
            background = "#450a0a";
        } else if (isRunning) {
            borderColor = "transparent";
            shadow = "0 0 15px rgba(99, 102, 241, 0.4)";
        }

        return { borderColor, shadow, background };
    }, [nodeStatus, traceConnected, selected, isHovered]);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onDoubleClick={handleDoubleClick}
            className={cn(
                "relative flex items-center transition-all duration-200",
                nodeStatus === "RUNNING" && traceConnected && "animate-pulse"
            )}
            style={{
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
                borderRadius: "10px",
                background: nodeStyle.background,
                border: `1.5px solid ${nodeStyle.borderColor}`,
                boxShadow: nodeStyle.shadow,
                zIndex: selected ? 100 : (isHovered ? 50 : 1),
            }}
        >
            {nodeStatus === "RUNNING" && traceConnected && !selected && !isHovered && (
                <div className="absolute inset-[-1.5px] rounded-[10px] overflow-hidden pointer-events-none">
                    <div
                        className="absolute inset-[-100%] animate-[spin_3s_linear_infinite]"
                        style={{
                            background: "conic-gradient(from 0deg, transparent 0%, #6366f1 25%, #a855f7 50%, #6366f1 75%, transparent 100%)"
                        }}
                    />
                    <div className="absolute inset-[1.5px] bg-slate-950 rounded-[9px]" />
                </div>
            )}

            <div
                className="w-12 h-full flex items-center justify-center rounded-l-[9px] border-r border-slate-800/50 shrink-0"
                style={{ backgroundColor: `${data.color}15` }}
            >
                <div
                    className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold"
                    style={{ color: data.color, border: `1px solid ${data.color}40` }}
                >
                    {data.label?.charAt(0)}
                </div>
            </div>

            <div className="flex-1 px-3 text-left overflow-hidden">
                <div className="text-[11px] font-bold text-slate-200 truncate leading-none mb-1">
                    {data.label}
                </div>
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter truncate">
                    {data.type || 'Action'}
                </div>
            </div>

            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center gap-2 -translate-x-1/2">
                {data.inputs?.map((input: any) => (
                    <div key={input.id} className="relative flex items-center">
                        <Handle
                            id={input.id}
                            type="target"
                            position={Position.Left}
                            style={{
                                position: 'relative',
                                top: 'auto',
                                transform: 'none',
                                background: getHandleColor(input.id),
                                width: 8,
                                height: 8,
                                border: '2px solid #020617',
                                pointerEvents: 'all'
                            }}
                        />
                    </div>
                ))}
            </div>

            <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center gap-2 translate-x-1/2">
                {data.outputs?.map((output: any) => (
                    <div
                        key={output.id}
                        className="relative flex items-center group"
                        onMouseEnter={() => setHoveredHandle(`output-${output.id}`)}
                        onMouseLeave={() => setHoveredHandle(null)}
                    >
                        {labelsVisible && (
                            <div className={cn(
                                "absolute left-full ml-2 px-1.5 py-0.5 rounded text-[7px] font-bold border whitespace-nowrap z-30 transition-opacity",
                                output.id === 'true' ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30" :
                                    output.id === 'false' ? "bg-red-950/80 text-red-400 border-red-500/30" :
                                        "bg-slate-900/95 text-slate-300 border-slate-700/50"
                            )}>
                                {output.label || output.id}
                            </div>
                        )}
                        <Handle
                            id={output.id}
                            type="source"
                            position={Position.Right}
                            style={{
                                position: 'relative',
                                top: 'auto',
                                transform: 'none',
                                background: getHandleColor(output.id),
                                width: 8,
                                height: 8,
                                border: '2px solid #020617',
                                pointerEvents: 'all'
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommonNode;
