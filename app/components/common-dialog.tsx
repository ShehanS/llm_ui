"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, XCircle } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils"; // Using the standard shadcn utility

type CommonDialogProps = {
    open: boolean;
    type: "error" | "info" | "warning";
    title?: string;
    message: React.ReactNode;
    code?: string | number;
    fullscreen?: boolean;
    onClose: () => void;
};

const dialogConfig = {
    error: {
        title: "Error",
        color: "text-red-600",
        button: "destructive" as const,
        icon: XCircle,
    },
    warning: {
        title: "Warning",
        color: "text-yellow-600",
        button: "default" as const,
        icon: AlertTriangle,
    },
    info: {
        title: "Information",
        color: "text-blue-600",
        button: "default" as const,
        icon: Info,
    },
};

export const CommonDialog = ({
                                 open,
                                 type,
                                 title,
                                 message,
                                 code,
                                 fullscreen = false,
                                 onClose,
                             }: CommonDialogProps) => {
    const cfg = dialogConfig[type];
    const Icon = cfg.icon;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className={cn(
                    "flex flex-col gap-0 p-0 overflow-hidden transition-all duration-300",
                    fullscreen
                        ? "fixed inset-0 h-screen w-screen max-w-none rounded-none translate-x-0 translate-y-0 left-0 top-0"
                        : "w-full max-w-2xl h-auto max-h-[90vh] rounded-lg p-6"
                )}
            >
                {/* Header padding needs to be manual if we use p-0 for fullscreen */}
                <DialogHeader className={cn(
                    "border-b border-slate-800 bg-slate-950/50",
                    fullscreen ? "p-6" : "pb-4"
                )}>
                    <DialogTitle className={`flex items-center gap-2 ${cfg.color}`}>
                        <Icon className="h-5 w-5" />
                        {title ?? cfg.title}
                        {code && <span className="text-sm opacity-70">({code})</span>}
                    </DialogTitle>

                    {/* asChild logic remains to fix hydration */}
                    <DialogDescription asChild>
                        <div className="hidden">Status for accessibility</div>
                    </DialogDescription>
                </DialogHeader>

                {/* Main Content Area */}
                <div
                    className={cn(
                        "flex-1 overflow-auto p-6 scrollbar-thin scrollbar-thumb-slate-700",
                        fullscreen ? "h-full" : "max-h-[60vh]"
                    )}
                >
                    {message}
                </div>

                <DialogFooter className={cn(
                    "border-t border-slate-800 bg-slate-950/50",
                    fullscreen ? "p-6" : "pt-4"
                )}>
                    <Button variant={cfg.button} onClick={onClose} className="min-w-[100px]">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
