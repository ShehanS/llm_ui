"use client";

import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {addEdge, Controls, MiniMap, ReactFlow, ReactFlowInstance, useEdgesState, useNodesState} from "@xyflow/react";
import "@xyflow/react/dist/style.css";


import CommonNode from "../../components/reactflow/common-node";
import NodeSideBar from "@/app/components/node-side-bar";
import {NodeConfigForm} from "@/components/reactflow/node-config";
import {Spinner} from "@/components/ui/spinner";
import {CommonDialog} from "@/app/components/common-dialog";
import {OpenWorkflowDialog} from "@/app/components/open-dialog";
import {SaveWorkflowDialog} from "@/app/components/save-dialog";
import {AlertCircle, ChevronDown, ChevronUp, Terminal, X} from "lucide-react";
import {NODE_CATALOG} from "@/app/data/nodes";
import {useWorkflowStore} from "@/app/flow/data_service";
import {IExecutionTrace} from "@/app/data/data";
import {cn} from "@/lib/utils";

const nodeTypes = {
    common: CommonNode,
};

const getId = () => crypto.randomUUID();

const Page: FC = () => {
    const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
    const [leftOpen, setLeftOpen] = useState(true);
    const [rightOpen, setRightOpen] = useState(true);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [debugDetails, setDebugDetails] = useState<IExecutionTrace | null>(null);
    const [isPanelExpanded, setIsPanelExpanded] = useState(true);

    const {
        loading, workflow, saveWorkflow, openWorkflows, error, clear,
        savedWorkflow, workflows, openWorkflow, startLiveTrace,
        traces, stopLiveTrace, traceConnected
    } = useWorkflowStore();

    const [saveDialog, setSaveDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const selectedNode = useMemo(
        () => nodes.find((n) => n.id === selectedNodeId) ?? null,
        [nodes, selectedNodeId]
    );

    const highlightedNodes = useMemo(
        () => nodes.map((n) => ({
            ...n,
            data: {...n.data, isSelected: n.id === selectedNodeId, _traceUpdate: traces.length},
        })),
        [nodes, selectedNodeId, traces]
    );

    useEffect(() => {
        if (!rfInstance) return;

        const handleViewUpdate = () => {
            rfInstance.fitView({duration: 400, padding: 0.2});
        };

        window.addEventListener("resize", handleViewUpdate);
        const timeout = setTimeout(handleViewUpdate, 350);

        return () => {
            window.removeEventListener("resize", handleViewUpdate);
            clearTimeout(timeout);
        };
    }, [leftOpen, rightOpen, rfInstance]);

    const onNodeClick = (_: any, node: any) => {
        setSelectedNodeId(node.id);
        if (traceConnected) {
            const nodeTrace = [...traces].reverse().find(t => String(t.nodeId) === String(node.id));
            if (nodeTrace) {
                setDebugDetails(nodeTrace);
                setIsPanelExpanded(true);
            }
        }
    };

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge({...params, animated: true}, eds)),
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
        setNodes((nds) => nds.map((node) => node.id !== selectedNodeId ? node : {
            ...node,
            data: {
                ...node.data,
                inputProps: node.data.inputProps.map((p: any) => p.name === propName ? {...p, value} : p),
            },
        }));
    };

    useEffect(() => {
        if (workflow) {
            const loadedNodes = workflow.definition?.nodes.map((n: any) => ({
                id: String(n.id),
                type: "common",
                position: n.position ?? {x: 200, y: 200},
                data: {...n, inputProps: n.config?.inputProps ?? []},
            }));
            const loadedEdges = workflow.definition?.edges.map((e: any) => ({
                id: `e-${crypto.randomUUID()}`,
                source: String(e.source),
                target: String(e.target),
                sourceHandle: e.sourceHandle || undefined,
                animated: true,
            }));
            setNodes(loadedNodes);
            setEdges(loadedEdges);
        }
    }, [workflow, setNodes, setEdges]);

    return (
        <div className="h-screen w-full bg-[#0f172a] flex overflow-hidden font-sans text-slate-200">
            {loading &&
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <Spinner/></div>}

            <CommonDialog open={!!error} title="Error" message={String(error)} type="error" onClose={clear}/>
            <CommonDialog open={!!savedWorkflow} title="Success" message="Workflow saved!" type="info" onClose={clear}/>
            <OpenWorkflowDialog open={openDialog} onClose={() => setOpenDialog(false)} files={workflows}
                                onOpenFile={(id) => {
                                    openWorkflow(id);
                                    setOpenDialog(false);
                                }}/>
            <SaveWorkflowDialog open={saveDialog} fileName={workflow?.flowName ?? ""}
                                description={workflow?.description ?? ""} onClose={() => setSaveDialog(false)}
                                onSave={async (fileName, description) => {

                                    const wfDef = {
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
                                            sourceHandle: e.sourceHandle || "default",
                                        })),
                                    };

                                    const payload = {
                                        flowId: workflow?.flowId || getId(),
                                        flowName: fileName,
                                        description: description,
                                        definition: wfDef,
                                        state: true
                                    };
                                    await saveWorkflow(payload);
                                    setSaveDialog(false);
                                }}/>
            <NodeSideBar isOpen={leftOpen} setIsOpen={setLeftOpen}/>
            <div
                className="flex-1 flex flex-col relative overflow-hidden transition-all duration-300 ease-in-out bg-slate-900/50"
                style={{
                    marginLeft: leftOpen ? "260px" : "0px",
                    marginRight: rightOpen ? "320px" : "0px"
                }}
            >
                <div
                    className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-slate-900/95 p-2 rounded-xl border border-slate-700 backdrop-blur-md shadow-2xl">
                    <button onClick={() => setSaveDialog(true)}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold">Save
                    </button>
                    <button onClick={async () => {
                        await openWorkflows();
                        setOpenDialog(true);
                    }} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold">Open
                    </button>
                    <div className="w-[1px] bg-slate-700 mx-1"/>
                    {!traceConnected ? (
                        <button onClick={() => workflow?.flowId && startLiveTrace(workflow.flowId)}
                                className="px-5 py-2 bg-emerald-600 rounded-lg text-xs font-semibold flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse"/>
                            Debug</button>
                    ) : (
                        <button onClick={stopLiveTrace}
                                className="px-5 py-2 bg-red-600 rounded-lg text-xs font-semibold flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-white animate-ping"/>
                            Stop Trace</button>
                    )}
                </div>

                <div className="flex-1 relative" ref={reactFlowWrapper} onDrop={onDrop} onDragOver={onDragOver}>
                    <ReactFlow
                        nodes={highlightedNodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        onInit={setRfInstance}
                        fitView
                        snapToGrid
                    >
                        <MiniMap maskColor="rgba(15, 23, 42, 0.8)"/>
                        <Controls/>
                    </ReactFlow>
                </div>
                {debugDetails && traceConnected && (
                    <div className={cn(
                        "absolute bottom-4 left-4 right-4 bg-slate-950 border border-slate-800 rounded-xl z-[60] transition-all duration-300 shadow-2xl overflow-hidden flex flex-col",
                        isPanelExpanded ? 'h-[40vh]' : 'h-10'
                    )}>
                        <div
                            className="flex items-center justify-between px-4 h-10 bg-slate-900 border-b border-slate-800 cursor-pointer"
                            onClick={() => setIsPanelExpanded(!isPanelExpanded)}>
                            <div className="flex items-center gap-2">
                                <Terminal size={14} className="text-emerald-400"/>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-200">Debug Console</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="text-slate-400 hover:text-white">{isPanelExpanded ?
                                    <ChevronDown size={18}/> : <ChevronUp size={18}/>}</button>
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    setDebugDetails(null);
                                }} className="text-slate-400 hover:text-red-400"><X size={18}/></button>
                            </div>
                        </div>
                        {isPanelExpanded && (
                            <div className="p-4 flex-1 grid grid-cols-2 gap-4 overflow-hidden bg-slate-950">
                                <div className="flex flex-col h-full overflow-hidden">
                                    <span
                                        className="text-[10px] text-blue-400 font-bold uppercase mb-2 ml-1">Input Data</span>
                                    <pre
                                        className="flex-1 bg-black/40 p-3 rounded-lg border border-slate-800 overflow-auto text-[11px] font-mono scrollbar-thin scrollbar-thumb-slate-700">{JSON.stringify(debugDetails.input, null, 2)}</pre>
                                </div>
                                <div className="flex flex-col h-full overflow-hidden">
                                    <span className="text-[10px] text-emerald-400 font-bold uppercase mb-2 ml-1">Output Data</span>
                                    <pre
                                        className="flex-1 bg-black/40 p-3 rounded-lg border border-slate-800 overflow-auto text-[11px] font-mono scrollbar-thin scrollbar-thumb-slate-700">{JSON.stringify(debugDetails.output, null, 2)}</pre>
                                </div>
                                {debugDetails.error && (
                                    <div className="col-span-2 pt-2 border-t border-slate-800">
                                        <div className="flex items-center gap-2 text-red-400 mb-1 ml-1">
                                            <AlertCircle size={12}/>
                                            <span className="text-[10px] font-bold uppercase">Error Log</span>
                                        </div>
                                        <div
                                            className="bg-red-950/20 border border-red-900/50 p-3 rounded text-red-200 text-xs font-mono">{debugDetails.error}</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <NodeConfigForm node={selectedNode} onChange={updateNodeConfig} isOpen={rightOpen}
                            setIsOpen={setRightOpen}/>
        </div>
    );
};

export default Page;
