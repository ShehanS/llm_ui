import React from "react";
import { ObjectMapper } from "@/components/reactflow/object-mapper";

type Props = {
    node: any;
    onChange: (name: string, value: any) => void;
};

export const NodeConfigForm: React.FC<Props> = ({ node, onChange }) => {
    if (!node?.data?.inputProps?.length) {
        return <p className="text-gray-400">No configuration</p>;
    }

    return (
        <div className="space-y-2 text-white">
            {/* Node Title */}
            <h3 className="text-lg font-semibold border-b border-gray-800 pb-2">
                {node.data.label}
            </h3>

            {node.data.inputProps.map((prop: any) => {
                switch (prop?.type) {
                    /* ---------- TEXT ---------- */
                    case "text":
                        return (
                            <div
                                key={prop.name}
                                className="space-y-1"
                            >
                                <label className="block text-sm text-gray-300">
                                    {prop.displayName}
                                </label>
                                <input
                                    className="w-full rounded border border-gray-700 px-3 py-2 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={prop.value ?? ""}
                                    onChange={(e) =>
                                        onChange(prop.name, e.target.value)
                                    }
                                    placeholder={prop.placeholder}
                                />
                            </div>
                        );

                    /* ---------- NUMBER ---------- */
                    case "number":
                        return (
                            <div
                                key={prop.name}
                                className="space-y-1"
                            >
                                <label className="block text-sm text-gray-300">
                                    {prop.displayName}
                                </label>
                                <input
                                    type="number"
                                    className="w-full rounded border border-gray-700 px-3 py-2 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={prop.value ?? 0}
                                    onChange={(e) =>
                                        onChange(
                                            prop.name,
                                            Number(e.target.value)
                                        )
                                    }
                                />
                            </div>
                        );

                    /* ---------- SELECT ---------- */
                    case "select":
                        return (
                            <div
                                key={prop.name}
                                className="space-y-1"
                            >
                                <label className="block text-sm text-gray-300">
                                    {prop.displayName}
                                </label>
                                <select
                                    className="w-full rounded border border-gray-700 px-3 py-2 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={prop.value ?? ""}
                                    onChange={(e) =>
                                        onChange(prop.name, e.target.value)
                                    }
                                >
                                    {prop.values.map((v: any) => (
                                        <option
                                            key={v.value}
                                            value={v.value}
                                        >
                                            {v.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        );

                    case "checkBox":
                        return (
                            <label
                                key={prop.name}
                                className="flex items-center gap-2 text-sm text-gray-300"
                            >
                                <input
                                    type="checkbox"
                                    className="accent-blue-500"
                                    checked={!!prop.value}
                                    onChange={(e) =>
                                        onChange(
                                            prop.name,
                                            e.target.checked
                                        )
                                    }
                                />
                                {prop.displayName}
                            </label>
                        );

                    case "mapper":
                        return (
                            <div key={prop.name} className="pt-2">
                                <ObjectMapper
                                    onChange={onChange}
                                    value={prop}
                                />
                            </div>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
};
