import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {IWorkflow} from "@/app/data/data";

type Props = {
    open: boolean;
    onClose: () => void;
    files: IWorkflow[];
    onOpenFile: (id: string | null) => void;
};

export const OpenWorkflowDialog = ({
                                       open,
                                       onClose,
                                       files,
                                       onOpenFile,
                                   }: Props) => (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
                <DialogTitle>Saved Workflows</DialogTitle>
            </DialogHeader>

            <ScrollArea className="max-h-[300px] pr-2">
                <div className="space-y-2">
                    {files.map((file) => (
                        <button
                            key={file.id}
                            className="w-full rounded-md border px-3 py-2 text-left hover:bg-muted transition"
                            onClick={() => {
                                onOpenFile(file.flowId);
                            }}
                        >
                            <div className="font-medium">{file.flowName}</div>
                        </button>
                    ))}
                </div>
            </ScrollArea>

            <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                    Close
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);
