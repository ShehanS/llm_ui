import { create } from "zustand";
import React from "react";

type DialogType = "error" | "info" | "warning";

interface Dialog {
    id: string;
    type: DialogType;
    title: string;
    children: React.ReactNode;
    code?: string | number;
    fullscreen?: boolean;
}

interface DialogDataStore {
    dialogs: Dialog[];
    openDialog: (data: Omit<Dialog, "id">) => void;
    closeDialog: (id: string) => void;
    closeAllDialogs: () => void;
}

export const useDialogDataStore = create<DialogDataStore>((set) => ({
    dialogs: [],

    openDialog: (data) => {
        const id = crypto.randomUUID();

        set((state) => ({
            dialogs: [
                ...state.dialogs,
                { id, ...data }
            ],
        }));
    },

    closeDialog: (id) => {
        set((state) => ({
            dialogs: state.dialogs.filter(d => d.id !== id),
        }));
    },

    closeAllDialogs: () => {
        set({ dialogs: [] });
    },
}));
