"use client";

import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {addEdge, Controls, MiniMap, ReactFlow, ReactFlowInstance, useEdgesState, useNodesState} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CommonNode from "../../components/reactflow/common-node";
import {NODE_CATALOG} from "@/app/data/nodes";
import NodeSideBar from "@/app/components/node-side-bar";
import {NodeConfigForm} from "@/components/reactflow/node-config";
import {useWorkflowStore} from "@/app/flow/data_service";
import {IWorkflow} from "@/app/data/data";
import {Spinner} from "@/components/ui/spinner";
import {CommonDialog} from "@/app/components/common-dialog";
import {OpenWorkflowDialog} from "@/app/components/open-dialog";
import {SaveWorkflowDialog} from "@/app/components/save-dialog";


const nodeTypes = {
    common: CommonNode,
};
const getId = () => crypto.randomUUID();


const Page: FC = () => {
    const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
    const viewportInitialized = useRef(false);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const {
        loading,
        workflow,
        saveWorkflow,
        openWorkflows,
        error,
        clear,
        savedWorkflow,
        workflows,
        openWorkflow
    } = useWorkflowStore();
    const [saveDialog, setSaveDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
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
            setEdges((eds) => addEdge({...params, animated: true}, eds)),
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

    const updateNodeConfig = (propName: any, value: any) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id !== selectedNodeId
                    ? node
                    : {
                        ...node,
                        data: {
                            ...node.data,
                            inputProps: node.data.inputProps.map((p: any) => {
                                const isMapper =
                                    typeof propName === "object" &&
                                    propName?.name === "mapper" &&
                                    p.name === "mapper";

                                if (isMapper) {
                                    return {
                                        ...p,
                                        value: {
                                            ...(typeof p.value === "object" &&
                                            !Array.isArray(p.value)
                                                ? p.value
                                                : {}),
                                            [propName.type]: value,
                                        },
                                    };
                                }
                                if (p.name === propName) {
                                    return {
                                        ...p,
                                        value,
                                    };
                                }

                                return p;
                            }),
                        },
                    }
            )
        );


    };
    useEffect(() => {
        const openedFlow: IWorkflow = workflow
        if (openedFlow) {
            const loadedNodes = openedFlow.definition?.nodes.map((n: any) => ({
                id: n.id,
                type: "common",
                position: n.position ?? {x: 200, y: 200},
                data: {
                    type: n.type,
                    label: n.label,
                    color: n.color,
                    config: {
                        icon: n.config?.icon ?? "",
                    },
                    inputProps: n.config?.inputProps ?? [],
                    inputs: n.inputs ?? [],
                    outputs: n.outputs ?? [],
                },
            }));

            const loadedEdges = openedFlow.definition?.edges.map((e: any, index: number) => ({
                id: `e-${crypto.randomUUID()}`,
                source: e.source,
                target: e.target,
                sourceHandle: e.sourceHandle
                    ? e.sourceHandle
                    : undefined,
                animated: true,
            }));

            console.log(loadedEdges)

            setNodes([]);
            setEdges([]);

            requestAnimationFrame(() => {
                setNodes(loadedNodes);
                setEdges(loadedEdges);
            });
        }
    }, [workflow])

    const loadWorkflowFromJson = async () => {
        await openWorkflows();
        setOpenDialog(true);
    };


    const exportWorkflow = async () => {
        setSaveDialog(true);
    };


    useEffect(() => {
        if (!rfInstance || nodes.length === 0 || viewportInitialized.current) return;
        rfInstance.setViewport({x: 0, y: 0, zoom: 0.1}, {duration: 0});
        viewportInitialized.current = true;
    }, [rfInstance, nodes.length]);

    return (
        <div style={{height: "100vh"}}>
            {loading && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <Spinner/>
            </div>}


            <CommonDialog open={error} title={`Error File Opening`}
                          message={JSON.parse(error)?.error} type={"error"} code={JSON.parse(error)?.code}
                          onClose={clear}/>

            <CommonDialog open={savedWorkflow} title={`File Saved`}
                          message={savedWorkflow?.message} type={"info"}
                          code={""}
                          onClose={clear}/>

            <OpenWorkflowDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                files={workflows}
                onOpenFile={async (id) => {
                    await openWorkflow(id);
                    setOpenDialog(false);
                }}
            />

            <SaveWorkflowDialog
                open={saveDialog}
                fileName={workflow?.flowName ?? ""}
                description={workflow?.description ?? ""}
                onClose={() => setSaveDialog(false)}
                onSave={async (fileName, description) => {
                    const wf = {
                        nodes: nodes.map((n) => ({
                            id: n.id,
                            type: n.data.type,
                            label: n.data.label,
                            color: n.data.color,
                            position: n.position,
                            config: {
                                icon: n.data.config?.icon ?? "",
                                inputProps: n.data.inputProps ?? [],
                            },
                            inputs: n.data.inputs ?? [],
                            outputs: n.data.outputs ?? [],
                        })),
                        edges: edges.map((e) => ({
                            source: e.source,
                            target: e.target,
                            sourceHandle: e.sourceHandle
                                ? e.sourceHandle
                                : "default",
                        })),
                    };

                    console.log(wf)
                    const workspace = {
                        flowId: workflow?.flowId ? workflow?.flowId : getId(),
                        flowName: fileName,
                        description: description,
                        definition: wf,
                        state: true
                    }
                    await saveWorkflow(workspace);
                }}/>

            <div className="fixed left-0 top-0 h-full w-[260px] border-r border-border bg-black p-4 text-white z-20">
                <NodeSideBar/>
            </div>

            <div className="fixed right-0 top-0 h-full w-[320px] border-l border-border bg-black p-4 text-white z-20">
                {selectedNode ? (
                    <NodeConfigForm node={selectedNode} onChange={updateNodeConfig}/>
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
                    Save
                </button>
                <button
                    onClick={loadWorkflowFromJson}
                    style={{
                        position: "absolute",
                        zIndex: 10,
                        top: 80,
                        left: 120,
                        padding: "8px 12px",
                        background: "#6366f1",
                        color: "white",
                        borderRadius: 6,
                    }}
                >
                    Open
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
                    <MiniMap/>
                    <Controls/>
                </ReactFlow>
            </div>
        </div>
    );
};

export default Page;
