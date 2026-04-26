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
import { cn } from "@/lib/utils";

type CommonDialogProps = {
    open: boolean;
    type: "error" | "info" | "warning";
    title?: string;
    children: React.ReactNode;
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
                                 children,
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
                    "flex flex-col gap-0 p-0 transition-all duration-300",
                    fullscreen
                        ? [
                            "!fixed !inset-0 !z-50",
                            "!w-screen !h-screen !max-w-none !max-h-none",
                            "!m-0 !rounded-none !border-none",
                            "!translate-x-0 !translate-y-0",
                            "bg-slate-950"
                        ]
                        : "w-[100vw] max-w-2xl h-auto max-h-[90vh] rounded-lg border border-slate-800 shadow-2xl"
                )}
            >
                <DialogHeader className={cn(
                    "border-b border-slate-800 bg-slate-950/50 shrink-0",
                    fullscreen ? "p-6" : "p-4"
                )}>
                    <DialogTitle className={`flex items-center gap-2 ${cfg.color}`}>
                        <Icon className="h-5 w-5" />
                        {title ?? cfg.title}
                        {code && <span className="text-sm opacity-70">({code})</span>}
                    </DialogTitle>

                    <DialogDescription asChild>
                        <div className="sr-only">Status for accessibility</div>
                    </DialogDescription>
                </DialogHeader>

                {/* Main Content Area */}
                <div
                    className={cn(
                        "flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 bg-slate-950",
                        fullscreen ? "h-full" : "max-h-[60vh]"
                    )}
                >
                    {children}
                </div>

                <DialogFooter className={cn(
                    "border-t border-slate-800 bg-slate-950/50 shrink-0",
                    fullscreen ? "p-6" : "p-4"
                )}>
                    <Button variant={cfg.button} onClick={onClose} className="min-w-[100px]">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
