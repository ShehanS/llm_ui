export interface ITool {
    id: number | null;
    pId: string;
    name: string;
    description: string;
    fileName: string;
    path: string;
    agents: string[];
    status: string;
}

export interface IAgent {
    id: number | null;
    agentName: string;
    description: string;
    expertise: string;
    isDefault: boolean;
    model: IModelConfig;
    systemPrompt: string;
    tools: string[];
    displayName: string | null;
}

export interface IModelConfig {
    provider: string;
    name: string;
    temperature: number;
    apiKey: string;
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
    sourceHandle: string | null

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
