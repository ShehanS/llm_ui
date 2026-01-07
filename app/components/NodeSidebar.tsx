"use client";

import React from "react";
import { NODE_CATALOG } from "@/app/data/nodes";

const NODE_PREVIEW_SIZE = 120;

const NodeSidebar = () => {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <div className="fixed left-0 top-0 z-20 h-full w-[280px] border-r border-border bg-black p-4 text-white overflow-y-auto">
            <h3 className="mb-4 text-base font-semibold">Nodes</h3>

            <div className="grid grid-cols-1 gap-4">
                {Object.values(NODE_CATALOG).map((node) => (
                    <div
                        key={node.type}
                        draggable
                        onDragStart={(e) => onDragStart(e, node.type)}
                        className="flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
                        style={{
                            width: NODE_PREVIEW_SIZE,
                            height: NODE_PREVIEW_SIZE,
                            borderRadius: 10,
                            background: "#020617",
                            border: `2px solid ${node.color}`,
                            fontSize: 14,
                            fontWeight: 600,
                            textAlign: "center",
                            lineHeight: "18px",
                        }}
                    >
                        {node.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NodeSidebar;
