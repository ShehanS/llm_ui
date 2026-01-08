"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Props = {
    fileName?: string;
    description?: string;
    open: boolean;
    onClose: () => void;
    onSave: (fileName: string, description: string) => void;
};

export const SaveWorkflowDialog = ({
                                       fileName: initialFileName = "",
                                       description: initialDescription = "",
                                       open,
                                       onClose,
                                       onSave,
                                   }: Props) => {
    const [fileName, setFileName] = useState("");
    const [description, setDescription] = useState("");

    // 🔥 SYNC parent -> state when dialog opens
    useEffect(() => {
        if (open) {
            setFileName(initialFileName);
            setDescription(initialDescription);
        }
    }, [open, initialFileName, initialDescription]);

    const handleSave = () => {
        if (!fileName.trim()) return;
        onSave(fileName.trim(), description.trim());
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <DialogTitle>
                        {initialFileName ? "Edit Workflow" : "Save Workflow"}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="fileName">File name</Label>
                        <Input
                            id="fileName"
                            placeholder="My workflow"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Optional description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!fileName.trim()}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
