"use client";

import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    addEdge,
    Controls,
    MiniMap,
    ReactFlow,
    ReactFlowInstance,
    useEdgesState,
    useNodesState,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import CommonNode from "../../components/reactflow/common-node";
import { NODE_CATALOG } from "@/app/data/nodes";
import NodeSidebar from "@/app/components/NodeSidebar";
import { NodeConfigForm } from "@/components/reactflow/node-config";

const nodeTypes = {
    common: CommonNode,
};

let id = 0;
const getId = () => `${++id}`;

const Page: FC = () => {
    const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
    const viewportInitialized = useRef(false);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    const selectedNode = useMemo(
        () => nodes.find((n) => n.id === selectedNodeId) ?? null,
        [nodes, selectedNodeId]
    );

    const highlightedNodes = useMemo(
        () =>
            nodes.map((n) => ({
                ...n,
                data: {
                    ...n.data,
                    isSelected: n.id === selectedNodeId,
                },
            })),
        [nodes, selectedNodeId]
    );

    const onNodeClick = (_: any, node: any) => {
        setSelectedNodeId(node.id);
    };

    const onConnect = useCallback(
        (params: any) =>
            setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
        [setEdges]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const nodeType = event.dataTransfer.getData("application/reactflow");
            if (!nodeType || !rfInstance || !reactFlowWrapper.current) return;

            const bounds = reactFlowWrapper.current.getBoundingClientRect();
            const position = rfInstance.screenToFlowPosition({
                x: event.clientX - bounds.left,
                y: event.clientY - bounds.top,
            });

            const catalogNode = NODE_CATALOG[nodeType];

            const newNode = {
                id: getId(),
                type: "common",
                position,
                data: {
                    ...catalogNode,
                    inputProps: catalogNode.config?.inputProps
                        ? JSON.parse(JSON.stringify(catalogNode.config.inputProps))
                        : [],
                },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [rfInstance, setNodes]
    );

    const updateNodeConfig = (propName: string, value: any) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id !== selectedNodeId
                    ? node
                    : {
                        ...node,
                        data: {
                            ...node.data,
                            inputProps: node.data.inputProps.map((p: any) =>
                                p.name === propName ? { ...p, value } : p
                            ),
                        },
                    }
            )
        );
    };

    const exportWorkflow = () => {
        const workflow = {
            nodes: nodes.map((n) => ({
                id: n.id,
                type: n.data.type,
                config: n.data.inputProps || [],
            })),
            edges: edges.map((e) => ({
                source: e.source,
                target: e.target,
                sourceHandle: e.sourceHandle
                    ? e.sourceHandle.replace("out-", "")
                    : "default",
            })),
        };

        console.log(JSON.stringify(workflow, null, 2));
    };

    useEffect(() => {
        if (!rfInstance || nodes.length === 0 || viewportInitialized.current) return;
        rfInstance.setViewport({ x: 0, y: 0, zoom: 0.1 }, { duration: 0 });
        viewportInitialized.current = true;
    }, [rfInstance, nodes.length]);

    return (
        <div style={{ height: "100vh" }}>
            <div className="fixed left-0 top-0 h-full w-[260px] border-r border-border bg-black p-4 text-white z-20">
                <NodeSidebar />
            </div>

            <div className="fixed right-0 top-0 h-full w-[320px] border-l border-border bg-black p-4 text-white z-20">
                {selectedNode ? (
                    <NodeConfigForm node={selectedNode} onChange={updateNodeConfig} />
                ) : (
                    <p className="text-gray-500">Select a node</p>
                )}
            </div>

            <div
                ref={reactFlowWrapper}
                onDrop={onDrop}
                onDragOver={onDragOver}
                style={{
                    height: "100%",
                    marginLeft: 260,
                    marginRight: 320,
                    position: "relative",
                }}
            >
                <button
                    onClick={exportWorkflow}
                    style={{
                        position: "absolute",
                        zIndex: 10,
                        top: 80,
                        left: 50,
                        padding: "8px 12px",
                        background: "#6366f1",
                        color: "white",
                        borderRadius: 6,
                    }}
                >
                    Export Backend JSON
                </button>

                <ReactFlow
                    nodes={highlightedNodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    onInit={setRfInstance}
                    minZoom={0.1}
                    maxZoom={2}
                    fitView
                >
                    <MiniMap />
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    );
};

export default Page;
