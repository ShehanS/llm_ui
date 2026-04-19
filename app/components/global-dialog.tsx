"use client";


import {CommonDialog} from "@/app/components/common-dialog";
import {useDialogDataStore} from "@/app/store/dialog_data_store";

const GlobalDialog = () => {
    const {
        isOpenDialog,
        type,
        title,
        children,
        code,
        fullscreen,
        closeCommonDialog,
    } = useDialogDataStore();

    return (
        <CommonDialog
            open={isOpenDialog}
            type={type}
            title={title}
            children={children}
            code={"1"}
            fullscreen={fullscreen}
            onClose={closeCommonDialog}
        />
    );
};

export default GlobalDialog;
