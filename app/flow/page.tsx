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
        (params: any) => setEdges((eds) => addEdge({...params, animated: true, type:"smoothstep"}, eds)),
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
            console.log(propName, value)
        // setNodes((nds) => nds.map((node) => node.id !== selectedNodeId ? node : {
        //     ...node,
        //     data: {
        //         ...node.data,
        //         inputProps: node.data.inputProps.map((p: any) => p.name === propName ? {...p, value} : p),
        //     },
        // }));
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
                                    propName?.name === "inputMapper" || propName?.name === "outputMapper" &&
                                    propName?.name === "inputMapper" || propName?.name === "outputMapper";

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
                type: String(e.type),
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
            {/*<CommonDialog open={!!savedWorkflow} title="Success" message="Workflow saved!" type="info" onClose={clear}/>*/}
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
                                            type: e.type,
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
                        isPanelExpanded ? 'h-[70vh]' : 'h-10'
                    )}>
                        <div
                            className="flex items-center justify-between px-4 h-10 bg-slate-900 border-b border-slate-800 cursor-pointer shrink-0"
                            onClick={() => setIsPanelExpanded(!isPanelExpanded)}>
                            <div className="flex items-center gap-2">
                                <Terminal size={14} className={cn(
                                    debugDetails.status === 'FAILED' ? "text-red-400" :
                                        debugDetails.status === 'WAITING' ? "text-indigo-400" : "text-emerald-400"
                                )}/>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-200">
                    Debug Console: {debugDetails.nodeType} ({debugDetails.status})
                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="text-slate-400 hover:text-white">
                                    {isPanelExpanded ? <ChevronDown size={18}/> : <ChevronUp size={18}/>}
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); setDebugDetails(null); }}
                                        className="text-slate-400 hover:text-red-400">
                                    <X size={18}/>
                                </button>
                            </div>
                        </div>

                        {isPanelExpanded && (
                            <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">

                                    {debugDetails.status === 'FAILED' && (
                                        <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-lg flex items-start gap-3">
                                            <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0"/>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-[10px] font-bold text-red-500 uppercase tracking-tight">Execution Error</span>
                                                <p className="text-red-200 text-xs font-mono break-words leading-relaxed">
                                                    {typeof debugDetails.metadata === 'string' ? debugDetails.metadata : debugDetails.error || "Check output for details."}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {debugDetails.status === 'WAITING' && debugDetails.metadata && (
                                        <div className="p-4 bg-indigo-950/20 border border-indigo-500/30 rounded-xl">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"/>
                                                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Human Approval Context</span>
                                            </div>
                                            <pre className="bg-black/40 p-3 rounded-lg text-indigo-100 text-[11px] font-mono overflow-x-auto border border-indigo-500/10">
                                {JSON.stringify(debugDetails.metadata, null, 2)}
                            </pre>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                        {/* Section: Config */}
                                        <section className="flex flex-col space-y-2">
                                            <div className="flex items-center gap-2 px-1">
                                                <div className="w-1 h-3 bg-amber-500 rounded-full"/>
                                                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Configuration</span>
                                            </div>
                                            <pre className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50 overflow-auto text-[11px] font-mono text-slate-300 max-h-[400px] scrollbar-thin scrollbar-thumb-slate-700">
                                {JSON.stringify(debugDetails.config, null, 2)}
                            </pre>
                                        </section>
                                        <section className="flex flex-col space-y-2">
                                            <div className="flex items-center gap-2 px-1">
                                                <div className="w-1 h-3 bg-blue-500 rounded-full"/>
                                                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Input</span>
                                            </div>
                                            <pre className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50 overflow-auto text-[11px] font-mono text-slate-300 max-h-[400px] scrollbar-thin scrollbar-thumb-slate-700">
                                {JSON.stringify(debugDetails.input, null, 2)}
                            </pre>
                                        </section>

                                        {/* Section: Output */}
                                        <section className="flex flex-col space-y-2">
                                            <div className="flex items-center gap-2 px-1">
                                                <div className="w-1 h-3 bg-emerald-500 rounded-full"/>
                                                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Output</span>
                                            </div>
                                            <pre className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50 overflow-auto text-[11px] font-mono text-slate-300 max-h-[400px] scrollbar-thin scrollbar-thumb-slate-700">
                                {JSON.stringify(debugDetails.output, null, 2) || "null"}
                            </pre>
                                        </section>
                                    </div>
                                </div>
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
