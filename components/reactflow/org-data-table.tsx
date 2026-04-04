import React, { FC, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Plus, Save, Trash2, X, Users, ShieldCheck, UserPlus, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COMPANY_ROLES = ["Owner", "Admin", "Financial Admin", "System Admin", "Technical Lead", "Technician", "Support Staff"];
const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];

interface User {
    id: number;
    fullName: string;
    lastName: string;
    role: string;
    whatsapp: string;
    email: string;
    gender: string;
    designation: string;
}

interface Policy {
    id: number;
    name: string;
    description: string;
}

interface Group {
    id: number;
    name: string;
    userIds: number[];
    policyIds: number[];
}

interface OrgData {
    users: User[];
    groups: Group[];
    policies: Policy[];
}

type OrgDataTableProps = {
    name: string;
    value?: OrgData;
    onChange: (name: string, value: OrgData) => void;
};

const OrgDataTable: FC<OrgDataTableProps> = ({ name, value, onChange }) => {
    const [localData, setLocalData] = useState<OrgData>({
        users: value?.users || [],
        groups: value?.groups || [],
        policies: value?.policies || []
    });

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<any>({});

    useEffect(() => {
        if (value) {
            setLocalData({
                users: Array.isArray(value.users) ? value.users : [],
                groups: Array.isArray(value.groups) ? value.groups : [],
                policies: Array.isArray(value.policies) ? value.policies : []
            });
        }
    }, [value]);

    const updateGlobal = (newData: OrgData) => {
        setLocalData(newData);
        onChange(name, newData);
    };

    const addGroup = () => {
        const newId = Date.now();
        const newGroup: Group = { id: newId, name: "New Group", userIds: [], policyIds: [] };
        const newData = { ...localData, groups: [...localData.groups, newGroup] };
        setEditingId(newId);
        setEditForm(newGroup);
        updateGlobal(newData);
    };

    const toggleUserInGroup = (groupId: number, userId: number) => {
        const updatedGroups = localData.groups.map(g => {
            if (g.id !== groupId) return g;
            const userIds = g.userIds.includes(userId)
                ? g.userIds.filter(id => id !== userId)
                : [...g.userIds, userId];
            return { ...g, userIds };
        });
        updateGlobal({ ...localData, groups: updatedGroups });
    };

    const removeGroup = (id: number) => {
        const newData = { ...localData, groups: localData.groups.filter(g => g.id !== id) };
        updateGlobal(newData);
    };

    return (
        <div className="w-full space-y-4 bg-transparent">
            <Tabs defaultValue="groups" className="w-full">
                <TabsList className="bg-slate-900 border border-slate-800">
                    <TabsTrigger value="users" className="text-xs">Users Pool</TabsTrigger>
                    <TabsTrigger value="groups" className="text-xs font-bold text-cyan-400">Manage Groups</TabsTrigger>
                </TabsList>

                <TabsContent value="groups">
                    <div className="relative rounded-lg border border-slate-800 overflow-hidden bg-slate-950/20">
                        <div className="absolute top-2 right-4 z-10">
                            <Button variant="outline" size="sm" onClick={addGroup} className="h-8 border-cyan-500/50 text-cyan-400 hover:bg-cyan-950">
                                <Plus className="h-4 w-4 mr-2" /> Create New Group
                            </Button>
                        </div>

                        <Table>
                            <TableHeader className="bg-slate-900/60">
                                <TableRow className="border-slate-800">
                                    <TableHead className="text-[10px] uppercase font-bold text-cyan-100/70 w-[250px]">Group Name</TableHead>
                                    <TableHead className="text-[10px] uppercase font-bold text-cyan-100/70">Add/Remove Users</TableHead>
                                    <TableHead className="text-right text-[10px] uppercase font-bold text-cyan-100/70 pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {localData.groups.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-10 text-slate-500 text-xs">
                                            No groups created. Click "Create New Group" to start.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    localData.groups.map(group => (
                                        <TableRow key={group.id} className="border-slate-800 hover:bg-slate-800/10">
                                            <TableCell className="py-3">
                                                {editingId === group.id ? (
                                                    <input
                                                        autoFocus
                                                        className="bg-slate-900 border border-cyan-500/50 rounded h-8 text-xs px-2 text-white w-full"
                                                        value={editForm.name || ""}
                                                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                                                        onBlur={() => {
                                                            const updated = localData.groups.map(g => g.id === group.id ? { ...g, name: editForm.name } : g);
                                                            updateGlobal({ ...localData, groups: updated });
                                                            setEditingId(null);
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => {setEditingId(group.id); setEditForm(group);}}>
                                                        <span className="text-sm font-medium text-slate-200">{group.name}</span>
                                                        <Edit className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex flex-wrap gap-2 items-center">
                                                    <Select onValueChange={(val) => toggleUserInGroup(group.id, parseInt(val))}>
                                                        <SelectTrigger className="h-8 w-[180px] bg-slate-900 border-slate-700 text-[11px] text-slate-300">
                                                            <UserPlus className="w-3.5 h-3.5 mr-2 text-cyan-400"/>
                                                            <span>Assign Users...</span>
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-slate-900 border-slate-700 max-h-[300px]">
                                                            {localData.users.map(u => (
                                                                <SelectItem key={u.id} value={u.id.toString()} className="text-xs focus:bg-cyan-950 focus:text-white">
                                                                    <div className="flex items-center justify-between w-full gap-4">
                                                                        <span>{u.fullName || `User ${u.id}`}</span>
                                                                        {group.userIds.includes(u.id) && <Check className="w-3 h-3 text-cyan-400" />}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                    <div className="flex -space-x-2 overflow-hidden ml-2">
                                                        {group.userIds.length > 0 ? (
                                                            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded border border-cyan-500/20">
                                                                {group.userIds.length} users assigned
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] text-slate-600 italic">Empty group</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-right py-3 pr-4">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-400/10"
                                                    onClick={() => removeGroup(group.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* Users and Policies content remain accessible in other tabs */}
            </Tabs>
        </div>
    );
};

export default OrgDataTable;
