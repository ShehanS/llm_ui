import React, { FC, useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Users, User, Plus, Trash2, ArrowDown } from "lucide-react";

interface Option {
    id: string;
    name: string;
    type?: 'group' | 'person';
}

interface ApprovalStep {
    id: string;
    entityId: string;
    policyId: string;
}

export const GeneralApproval: FC = () => {
    const [entities, setEntities] = useState<Option[]>([]);
    const [policies, setPolicies] = useState<Option[]>([]);
    const [steps, setSteps] = useState<ApprovalStep[]>([
        { id: "1", entityId: "g1", policyId: "p2" },
        { id: "2", entityId: "u1", policyId: "p3" }
    ]);

    useEffect(() => {
        setEntities([
            { id: "g1", name: "System Administrators", type: "group" },
            { id: "g2", name: "Financial Department", type: "group" },
            { id: "u1", name: "John Doe (Lead)", type: "person" },
            { id: "u2", name: "Jane Smith (Manager)", type: "person" },
        ]);

        setPolicies([
            { id: "p1", name: "High Priority Approval" },
            { id: "p2", name: "Standard Expense Policy" },
            { id: "p3", name: "Technical Override" },
        ]);
    }, []);

    const addStep = () => {
        setSteps([...steps, { id: Date.now().toString(), entityId: "", policyId: "" }]);
    };

    const removeStep = (id: string) => {
        if (steps.length > 1) {
            setSteps(steps.filter(s => s.id !== id));
        }
    };

    const updateStep = (id: string, field: 'entityId' | 'policyId', value: string) => {
        setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const getOrdinal = (n: number) => {
        const s = ["th", "st", "nd", "rd"], v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return (
        <div className="w-full space-y-8 bg-transparent">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-cyan-400 font-bold uppercase tracking-widest text-[10px]">Workflow Sequence</h3>
                <Button onClick={addStep} variant="ghost" size="sm" className="h-7 text-cyan-400 hover:bg-cyan-950/30 text-[10px] uppercase font-bold">
                    <Plus className="w-3 h-3 mr-1" /> Add Step
                </Button>
            </div>

            <div className="space-y-10">
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        <div className="relative p-6 bg-transparent border border-slate-800/60 rounded-xl transition-all">

                            {/* OVERLAY LABEL */}
                            <div className="absolute -top-3 left-6 px-3 py-0.5 bg-[#020617] border border-slate-800 rounded-md">
                                <span className="text-[10px] font-bold text-cyan-400 whitespace-nowrap uppercase tracking-tighter">
                                    {getOrdinal(index + 1)} Approval
                                </span>
                            </div>

                            <div className="flex items-end gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                                    {/* Entity Select */}
                                    <div className="space-y-2">
                                        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest ml-1">Approver</span>
                                        <Select value={step.entityId} onValueChange={(val) => updateStep(step.id, 'entityId', val)}>
                                            <SelectTrigger className="bg-slate-950/40 border-slate-800 h-10 text-slate-300 focus:ring-0">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                                                {entities.map(e => (
                                                    <SelectItem key={e.id} value={e.id}>
                                                        <div className="flex items-center gap-2">
                                                            {e.type === 'group' ? <Users className="w-3.5 h-3.5 text-cyan-500" /> : <User className="w-3.5 h-3.5 text-amber-500" />}
                                                            <span className="text-xs">{e.name}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Policy Select */}
                                    <div className="space-y-2">
                                        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest ml-1">Policy</span>
                                        <Select value={step.policyId} onValueChange={(val) => updateStep(step.id, 'policyId', val)}>
                                            <SelectTrigger className="bg-slate-950/40 border-slate-800 h-10 text-slate-300 focus:ring-0">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                                                {policies.map(p => (
                                                    <SelectItem key={p.id} value={p.id} className="text-xs">{p.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* TRASH ICON */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeStep(step.id)}
                                    className="h-10 w-10 text-slate-600 hover:text-red-400 hover:bg-transparent mb-[2px]"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {index !== steps.length - 1 && (
                            <div className="flex justify-center -my-6 relative z-10">
                                <div className="bg-[#020617] p-1 rounded-full border border-slate-800">
                                    <ArrowDown className="w-3 h-3 text-slate-600" />
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
