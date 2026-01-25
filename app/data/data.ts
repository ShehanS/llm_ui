export interface ITool {
    name: string;
    description: string;
    type?: string;
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
    tools: string[];
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
    input: {
        items?: Array<{
            data: Record<string, any>;
        }>;
    } | null;
    output: {
        items?: Array<{
            data: Record<string, any>;
        }>;
    } | null;
    config: Record<string, any>;
    status: 'RUNNING' | 'COMPLETE' | 'FAILED' | 'WAITING';
    startedAt: string;
    completedAt?: string | null;
    error?: string | null;
    metadata?: any;
}
