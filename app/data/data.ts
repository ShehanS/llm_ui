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
