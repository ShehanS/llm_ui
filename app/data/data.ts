export interface ITool {
    id: number | null;
    name: string;           // Name used by LLM to call tool
    description: string;    // Description for LLM instruction
    type: "script" | "api"; // Logic type
    code?: string;          // JavaScript for VM2 (if type is script)
    url?: string;           // Endpoint (if type is api)
    toolSchema: string;     // Stringified JSON Schema for parameters
    status: string;
}

export interface IAgent {
    id: number | null;
    agentName: string;
    displayName: string | null;
    description: string;
    expertise: string;
    isDefault: boolean;
    model: IModelConfig;
    systemPrompt: string;
    tools: ITool[];
}

export interface IModelConfig {
    id: number | null;
    provider: string | null;
    name: string | null;
    temperature: number | null;
    apiKey?: string | null;
}


export interface IRoutingConfig {
    id: number;
    classifierModel: IModelConfig;
    routingPrompt: string;
    fallbackAgent: string;
}

export interface IMainConfig {
    agents: IAgent[];
    routing: IRoutingConfig;
}

export interface IResponseMessage<T> {
    code: string;
    message: string;
    data: T;
    error: string | null;
}

export interface INode {
    id: string | null;
    type: string | null;
    label: string | null;
    color: string | null;
    position: IPosition | null;
    config: any | null;
}

export interface IEdge {
    source: string | null;
    target: string | null;
    sourceHandle: string | null;
}

export interface IPosition {
    x: number | null;
    y: number | null;
}

export interface IDefinition {
    edges: IEdge[];
    nodes: INode[];
}

export interface IWorkflow {
    id: number | null;
    flowId: string | null;
    flowName: string | null;
    description: string | null;
    definition: IDefinition | null;
    state: boolean;
}

export interface IExecutionTrace {
    runId: string;
    nodeId: string;
    nodeType: string;
    input: any;
    output: any;
    config: Record<string, any>;
    status: string;
    startedAt: string;
    completedAt?: string | null;
    error?: string | null;
}
