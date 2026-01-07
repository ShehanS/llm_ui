"use client";

import {FC, useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader,} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs";
import {useSettingsStore} from "@/app/settings/data_service";
import {Item, ItemActions, ItemContent, ItemDescription, ItemTitle,} from "@/components/ui/item";
import {IAgent, ITool} from "@/app/data/data";
import { Badge } from "@/components/ui/badge"

const Agents: FC = () => {
    const {tools, loadingTools, uploadTool, loading, loadingAgents, agents} = useSettingsStore();

    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadingTools();
    }, [loadingTools]);

    useEffect(() => {
        loadingAgents();
    }, [loadingAgents]);

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        try {
            await uploadTool(file);
            setFile(null);
            await loadingTools();
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex w-full flex-col gap-6">
            <Tabs defaultValue="agent" className="flex h-full w-full flex-col">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="agent">Agents Settings</TabsTrigger>
                    <TabsTrigger value="tool">Tool Settings</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-hidden">
                    <TabsContent value="agent" className="h-full">
                        <Card className="flex h-full flex-col">
                            <CardHeader/>
                            <CardContent>

                                <div className="flex w-full max-w-md flex-col gap-4">
                                    {agents.map((a: IAgent) => (
                                        <Item key={a.id} variant="outline">
                                            <ItemContent>
                                                <ItemTitle>{a.displayName}</ItemTitle>
                                                <ItemDescription>
                                                    Expertise: {a.expertise}
                                                </ItemDescription>
                                                <hr/>
                                                <p className="text-sm text-muted-foreground">
                                                    Description: {a.description}
                                                </p>
                                                <hr/>
                                                <div className="flex w-full flex-wrap gap-2 p-2">
                                                    <Badge>{a.model.name}</Badge>
                                                    <Badge>{a.model.provider}</Badge>
                                                </div>

                                            </ItemContent>
                                            <ItemActions>
                                                <Button variant="outline" size="sm">
                                                    Action
                                                </Button>
                                            </ItemActions>
                                        </Item>
                                    ))}
                                </div>

                            </CardContent>
                            <CardFooter>
                                <Button>Save changes</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="tool" className="h-full">
                        <Card className="flex h-full flex-col">
                            <CardHeader/>

                            <CardContent className="flex-1 overflow-y-auto space-y-6">
                                <div className="flex flex-col gap-3 border rounded-md p-4">
                                    <h4 className="font-medium">Upload Tool</h4>

                                    <input
                                        type="file"
                                        accept=".js"
                                        onChange={(e) =>
                                            setFile(e.target.files?.[0] ?? null)
                                        }
                                    />

                                    <Button
                                        onClick={handleUpload}
                                        disabled={!file || uploading}
                                    >
                                        {uploading ? "Uploading..." : "Upload Tool"}
                                    </Button>
                                </div>

                                {loading && <p>Loading tools...</p>}

                                {!loading && tools.length === 0 && (
                                    <p>No tools installed.</p>
                                )}

                                <div className="flex w-full max-w-md flex-col gap-4">
                                    {tools.map((p: ITool) => (
                                        <Item key={p.id} variant="outline">
                                            <ItemContent>
                                                <ItemTitle>{p.name}</ItemTitle>
                                                <ItemDescription>
                                                    {p.description}
                                                </ItemDescription>
                                                <hr/>
                                                <p className="text-sm text-muted-foreground">
                                                    {p.fileName}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {p.status}
                                                </p>
                                                {p.agents.map((agent, index) => (
                                                    <p key={index}
                                                       className="text-sm text-muted-foreground">{agent.agentName}</p>
                                                ))}

                                            </ItemContent>
                                            <ItemActions>
                                                <Button variant="outline" size="sm">
                                                    Action
                                                </Button>
                                            </ItemActions>
                                        </Item>
                                    ))}
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Button>Save changes</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default Agents;
