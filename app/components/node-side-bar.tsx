"use client";

import React from "react";
import { NODE_CATALOG } from "@/app/data/nodes";
import {
    ChevronLeft,
    ChevronRight,
    Boxes,
    Search,
    GripVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
};

const NodeSideBar: React.FC<Props> = ({ isOpen, setIsOpen }) => {

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed top-1/2 -translate-y-1/2 z-50 flex h-10 w-6 items-center justify-center rounded-r-lg border border-l-0 border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-300 shadow-2xl",
                    isOpen ? "left-[260px]" : "left-0"
                )}
                title={isOpen ? "Collapse Catalog" : "Expand Catalog"}
            >
                {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

            {/* SIDEBAR CONTAINER */}
            <div
                className={cn(
                    "fixed left-0 top-0 z-40 h-full border-r border-slate-800 bg-slate-950 transition-all duration-300 ease-in-out shadow-2xl overflow-hidden flex flex-col",
                    isOpen ? "w-[260px] translate-x-0" : "w-0 -translate-x-full"
                )}
            >
                <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6 shrink-0 bg-slate-950/50 backdrop-blur-sm">
                    <Boxes size={20} className="text-indigo-500" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">
                        Nodes
                    </h3>
                </div>

                {/* Search Bar (Visual only for now) */}
                <div className="px-4 py-3 border-b border-slate-900/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={12} />
                        <input
                            type="text"
                            placeholder="Search nodes..."
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-md py-1.5 pl-8 pr-3 text-[11px] text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 transition-all"
                        />
                    </div>
                </div>

                {/* Scrollable Node List */}
                <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    <p className="mb-4 text-[10px] font-bold uppercase text-slate-500 tracking-tighter ml-1">
                        Components
                    </p>

                    <div className="grid grid-cols-1 gap-3 pb-10">
                        {Object.values(NODE_CATALOG).map((node) => (
                            <div
                                key={node.type}
                                draggable
                                onDragStart={(e) => onDragStart(e, node.type)}
                                className="group relative flex items-center gap-3 p-3 rounded-lg border border-slate-800 bg-slate-900/30 hover:bg-slate-900 hover:border-slate-700 cursor-grab active:cursor-grabbing transition-all duration-200 select-none"
                            >
                                {/* Color Indicator / Icon Area */}
                                <div
                                    className="h-8 w-8 rounded-md flex items-center justify-center shrink-0 shadow-inner"
                                    style={{
                                        backgroundColor: `${node.color}15`, // 15% opacity hex
                                        border: `1px solid ${node.color}40`
                                    }}
                                >
                                    <span style={{ color: node.color }} className="font-bold text-xs uppercase">
                                        {node.label.charAt(0)}
                                    </span>
                                </div>

                                {/* Node Label */}
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-[12px] font-semibold text-slate-300 group-hover:text-white truncate">
                                        {node.label}
                                    </span>
                                    <span className="text-[9px] text-slate-600 uppercase font-bold tracking-tighter">
                                        {node.type}
                                    </span>
                                </div>

                                {/* Drag Handle Icon */}
                                <div className="ml-auto text-slate-700 group-hover:text-slate-500 transition-colors">
                                    <GripVertical size={14} />
                                </div>

                                {/* Subtle background glow matching node color on hover */}
                                <div
                                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"
                                    style={{ backgroundColor: node.color }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer / Tip Section */}
                <div className="p-4 border-t border-slate-800 bg-slate-950/80">
                    <div className="rounded-md bg-slate-900/50 p-3 border border-slate-800/50">
                        <p className="text-[9px] text-slate-500 leading-relaxed">
                            <span className="text-indigo-400 font-bold">TIP:</span> Drag and drop nodes onto the canvas to begin building your workflow.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NodeSideBar;
