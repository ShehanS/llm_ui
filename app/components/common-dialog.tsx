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

type CommonDialogProps = {
    open: boolean;
    type: "error" | "info" | "warning";
    title?: string;
    message: string;
    code?: string | number;
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
                                 onClose,
                             }: CommonDialogProps) => {
    const cfg = dialogConfig[type];
    const Icon = cfg.icon;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <DialogTitle className={`flex items-center gap-2 ${cfg.color}`}>
                        <Icon className="h-5 w-5" />
                        {title ?? cfg.title}
                        {code && <span className="text-sm opacity-70">({code})</span>}
                    </DialogTitle>

                    <DialogDescription className="mt-2 text-sm">
                        {message}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant={cfg.button} onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
