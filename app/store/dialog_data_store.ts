import { create } from "zustand";
import React from "react";

type DialogType = "error" | "info" | "warning";

interface DialogDataStore {
    loading: boolean;
    isOpenDialog: boolean;
    error: any | null;


    type: DialogType;
    title: string;
    message: React.ReactNode;
    code?: string | number;
    fullscreen: boolean;


    openCommonDialog: (data: {
        type: DialogType;
        title: string;
        children: React.ReactNode;
        code?: string | number;
        fullscreen?: boolean;
    }) => void;

    closeCommonDialog: () => void;
}

export const useDialogDataStore = create<DialogDataStore>((set) => ({
    loading: false,
    isOpenDialog: false,
    error: null,

    type: "info",
    title: "",
    message: null,
    code: undefined,
    fullscreen: false,

    openCommonDialog: (data) => {
        set({
            isOpenDialog: true,
            type: data.type || "info",
            title: data.title,
            children: data.children,
            code: data.code,
            fullscreen: data.fullscreen ?? false,
        });
    },

    closeCommonDialog: () => {
        set({
            isOpenDialog: false,
            title: "",
            children: null,
            code: undefined,
            fullscreen: false,
        });
    },
}));
