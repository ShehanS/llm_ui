"use client";

import React, { FC, useCallback, useEffect } from "react";
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    MiniMap,
    Controls,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import CommonNode from "../../components/reactflow/common-node";

/* 🔥 JSON CONFIG (can come from API / DB) */
export const nodeConfig = {
    type: "agent",
    label: "LLM Agent",
    color: "#6366f1",
    inputs: [
        { id: "in-text", label: "Text", position: "left" },
        { id: "in-context", label: "Context", position: "left" },
    ],
    outputs: [
        { id: "out-success", label: "Success", position: "right" },
        { id: "out-error", label: "Error", position: "right" },
    ],
};

const nodeTypes = {
    common: CommonNode,
};

const snapGrid: [number, number] = [20, 20];
const defaultViewport = { x: 0, y: 0, zoom: 1.2 };

const Page: FC = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        setNodes([
            {
                id: "agent-1",
                type: "common",
                position: { x: 200, y: 100 },
                data: nodeConfig,
            },
            {
                id: "agent-2",
                type: "common",
                position: { x: 550, y: 120 },
                data: {
                    ...nodeConfig,
                    label: "Post Processor",
                    color: "#16a34a",
                },
            },
        ]);

        setEdges([
            {
                id: "e1",
                source: "agent-1",
                sourceHandle: "out-success",
                target: "agent-2",
                targetHandle: "in-text",
                animated: true,
            },
        ]);
    }, [setNodes, setEdges]);

    const onConnect = useCallback(
        (params: any) =>
            setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
        [setEdges]
    );

    return (
        <div className="w-full h-screen">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                snapToGrid
                snapGrid={snapGrid}
                defaultViewport={defaultViewport}
                fitView
            >
                <MiniMap />
                <Controls />
            </ReactFlow>
        </div>
    );
};

export default Page;
