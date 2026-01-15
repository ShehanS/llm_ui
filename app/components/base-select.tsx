"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

type BaseSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    rightIcon?: React.ReactNode;
};

export const BaseSelect = React.forwardRef<
    HTMLSelectElement,
    BaseSelectProps
    >(({ className, children, rightIcon, ...props }, ref) => {
    return (
        <div className="relative w-full">
            <select
                ref={ref}
                className={clsx(
                    "w-full appearance-none rounded-md",
                    "border border-slate-800 bg-slate-900",
                    "px-3 py-2 text-xs text-white",
                    "outline-none cursor-pointer transition-all",
                    "focus:border-slate-700 focus:ring-1 focus:ring-blue-500/50",
                    className
                )}
                {...props}
            >
                {children}
            </select>

            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-500">
                {rightIcon}
                <ChevronDown size={14} />
            </div>
        </div>
    );
});

BaseSelect.displayName = "BaseSelect";
