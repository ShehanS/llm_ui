"use client";

import { CommonDialog } from "@/app/components/common-dialog";
import { useDialogDataStore } from "@/app/store/dialog_data_store";

const GlobalDialog = () => {
    const { dialogs, closeDialog } = useDialogDataStore();

    return (
        <>
            {dialogs.map((dialog, index) => (
                <CommonDialog
                    key={dialog.id}
                    open={true}
                    type={dialog.type}
                    title={dialog.title}
                    fullscreen={dialog.fullscreen ?? false}
                    onClose={() => closeDialog(dialog.id)}
                    style={{
                        zIndex: 1000 + index, // stack dialogs properly
                    }}
                >
                    {dialog.children}
                </CommonDialog>
            ))}
        </>
    );
};

export default GlobalDialog;
