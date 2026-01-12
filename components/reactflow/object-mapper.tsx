import React, { useEffect, useState } from "react";

type MapperItem = {
    key: string;
    value: string;
};

type ObjectMapperProps = {
    value?: {
        name: string;
        value?: {
            payloadSource?: string;
            payloadExpression?: string;
            map?: MapperItem[];
        };
    };
    onChange: (name: string, value: any) => void;
};

export const ObjectMapper: React.FC<ObjectMapperProps> = ({
                                                              value,
                                                              onChange,
                                                          }) => {
    const name = value?.name;

    const detectMode = () => {
        if (value?.value?.map) return "mapper";
        if (value?.value?.payloadExpression) return "payloadExpression";
        return "payloadSource";
    };

    const [mode, setMode] = useState<
        "payloadSource" | "payloadExpression" | "mapper"
        >(detectMode());

    const [payloadSource, setPayloadSource] = useState("body");
    const [payloadExpression, setPayloadExpression] = useState("");
    const [mapper, setMapper] = useState<MapperItem[]>([]);

    /* -------- Sync from parent -------- */
    useEffect(() => {
        if (!value?.value) return;

        setPayloadSource(value.value.payloadSource ?? "body");
        setPayloadExpression(value.value.payloadExpression ?? "");
        setMapper(structuredClone(value.value.map ?? []));
        setMode(detectMode());
    }, [value]);

    const emit = (next: any) => {
        if (!name) return;
        onChange(name, next);
    };

    /* -------- Mode change -------- */
    const changeMode = (nextMode: typeof mode) => {
        setMode(nextMode);

        if (nextMode === "payloadSource") {
            emit({ payloadSource });
        } else if (nextMode === "payloadExpression") {
            emit({ payloadExpression });
        } else {
            emit({ map: mapper.length ? mapper : [{ key: "", value: "" }] });
        }
    };

    /* -------- Mapper ops -------- */
    const addMapper = () => {
        const next = [...structuredClone(mapper), { key: "", value: "" }];
        setMapper(next);
        emit({ map: next });
    };

    const updateMapper = (
        index: number,
        field: "key" | "value",
        val: string
    ) => {
        const next = structuredClone(mapper);
        next[index] = { ...next[index], [field]: val };
        setMapper(next);
        emit({ map: next });
    };

    const removeMapper = (index: number) => {
        const next = mapper.filter((_, i) => i !== index);
        setMapper(next);
        emit({ map: next });
    };

    /* -------- UI -------- */
    return (
        <div className="space-y-2">
            {/* MODE SELECT */}
            <select
                className="w-full rounded border border-gray-700 px-3 py-2 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={mode}
                onChange={(e) => changeMode(e.target.value as any)}
            >
                <option value="payloadSource">Payload Source</option>
                <option value="payloadExpression">Payload Expression</option>
                <option value="mapper">Object Mapper</option>
            </select>

            <label className="block text-sm text-gray-300">Values</label>

            {/* PAYLOAD SOURCE */}
            {mode === "payloadSource" && (
                <select
                    className="w-full rounded border border-gray-700 px-3 py-2 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={payloadSource}
                    onChange={(e) => {
                        setPayloadSource(e.target.value);
                        emit({ payloadSource: e.target.value });
                    }}
                >
                    <option value="body">Body only</option>
                    <option value="headers">Headers only</option>
                    <option value="query">Query params</option>
                    <option value="all">Full request</option>
                </select>
            )}

            {/* PAYLOAD EXPRESSION */}
            {mode === "payloadExpression" && (
                <input
                    type="text"
                    placeholder="{{body.message}}"
                    className="w-full rounded border border-gray-700 px-3 py-2 bg-gray-900 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={payloadExpression}
                    onChange={(e) => {
                        setPayloadExpression(e.target.value);
                        emit({ payloadExpression: e.target.value });
                    }}
                />
            )}

            {/* OBJECT MAPPER */}
            {mode === "mapper" && (
                <div className="space-y-2">
                    {mapper.length === 0 && (
                        <p className="text-gray-500 text-sm text-center py-4">
                            No mappings yet. Click below to add one.
                        </p>
                    )}

                    {mapper.map((item, index) => (
                        <div
                            key={index}
                            className="flex gap-2 items-start"
                        >
                            <input
                                className="flex-1 min-w-0 rounded border border-gray-700 px-3 py-2 bg-gray-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Key"
                                value={item.key}
                                onChange={(e) =>
                                    updateMapper(index, "key", e.target.value)
                                }
                            />
                            <input
                                className="flex-[1.5] min-w-0 rounded border border-gray-700 px-3 py-2 bg-gray-900 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="{{body.phone}}"
                                value={item.value}
                                onChange={(e) =>
                                    updateMapper(index, "value", e.target.value)
                                }
                            />
                            <button
                                type="button"
                                onClick={() => removeMapper(index)}
                                className="shrink-0 px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors font-bold"
                            >
                                ×
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addMapper}
                        className="w-full border-2 border-dashed border-gray-700 py-3 text-sm text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors rounded"
                    >
                        + Add Mapping
                    </button>
                </div>
            )}
        </div>
    );
};
