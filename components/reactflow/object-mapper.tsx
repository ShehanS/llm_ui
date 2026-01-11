import React, {useEffect, useState} from "react";

type MapperItem = {
    key: string;
    value: string;
};


type Input = {
    name: string;
    value: string;
};

type ObjectMapperProps = {
    value?: any;
    onChange: (name: string | any, value: string | MapperItem[] | any) => void;
};

export const ObjectMapper: React.FC<ObjectMapperProps> = ({
                                                              value,
                                                              onChange,
                                                          }) => {


    const currentMode =
        (Object.keys(value?.value ?? {})[0] as
            | "payloadSource"
            | "payloadExpression"
            | "mapper") ?? "payloadSource";

    const [mode, setMode] = useState<"payloadSource" | "payloadExpression" | "mapper">(currentMode);
    const [payloadSource, setPayloadSource] = useState<Input>({
        name: "payloadSource",
        value: "body",
    });

    const [payloadExpression, setPayloadExpression] = useState<Input>({
        name: "payloadExpression",
        value: "",
    });

    const [mapper, setMapper] = useState<MapperItem[]>([]);

    useEffect(() => {
        if (!value) return;
        setPayloadSource({
            name: "payloadSource",
            value: value.payloadSource ?? "body",
        });
        setPayloadExpression({
            name: "payloadExpression",
            value: value.payloadExpression ?? "",
        });

        setMapper(value.value?.map ?? []);

        if (currentMode === "map"){
            setMode("mapper");
        }else if(currentMode === "payloadExpression"){
            setMode("payloadExpression");
        }else {
            setMode("payloadSource");
        }
    }, [value]);

    const emitChange = (
        currentMode: string,
        newPayloadSource: Input,
        newPayloadExpression: Input,
        newMapper: MapperItem[]
    ) => {
        if (currentMode === "payloadSource") {
            const mapper = {
                name: "mapper",
                type: "payloadSource"
            }
            onChange(mapper, newPayloadSource.value as any);
        } else if (currentMode === "payloadExpression") {
            const mapper = {
                name: "mapper",
                type: "payloadExpression"
            }
            onChange(mapper, newPayloadExpression.value as any);
        } else {
            const mapper = {
                name: "mapper",
                type: "map"
            }
            onChange(mapper, newMapper as any);
        }
    };


    const addMapper = () => {
        const base = Array.isArray(value.value?.map) ? value.value?.map : [];

        const next = [...base, {key: "", value: ""}];

        setMapper(next);
        emitChange(mode, payloadSource, payloadExpression, next);
    };

    const updateMapper = (
        index: number,
        field: "key" | "value",
        val: string
    ) => {
        const next = [...value.value?.map];
        next[index] = {...next[index], [field]: val};
        setMapper(next);
        emitChange(mode, payloadSource, payloadExpression, next);
    };

    const removeMapper = (index: number) => {
        const next = value.value?.map?.filter((_, i) => i !== index);
        setMapper(next);
        emitChange(mode, payloadSource, payloadExpression, next);
    };

    return (
        <div>
        <div className="space-y-2">
                <label className="block text-sm text-gray-300">
                    Mapper
                </label>
            <select
                className="w-full rounded border border-gray-700 px-3 py-2 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={mode}
                onChange={(e) => {

                    setMode(e.target.value as any);
                    if (e.target.value === "payloadSource") {
                        const type = {
                            payloadSource: ""
                        }
                        onChange("mapper", type);
                    } else if (e.target.value === "payloadExpression") {
                        const type = {
                            payloadExpression: ""
                        }
                        onChange("mapper", type);
                    } else {
                        const type = {
                            map: [{"key": "", "value": ""}]
                        }
                        onChange("mapper", type);
                    }

                }}
            >
                <option value="payloadSource">Payload Source</option>
                <option value="payloadExpression">Payload Expression</option>
                <option value="mapper">Object Mapper</option>
            </select>
            <label className="block text-sm text-gray-300">
                Values
            </label>
            {mode === "payloadSource" && (
                <select
                    className="w-full rounded border border-gray-700 px-3 py-2 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={value?.value?.payloadSource ?? ""}
                    onChange={(e) => {
                        const newPayloadSource = {
                            name: "payloadSource",
                            value: e.target.value,
                        };
                        setPayloadSource(newPayloadSource);
                        emitChange(mode, newPayloadSource, payloadExpression, mapper);
                    }}
                >
                    <option value="body">Body only</option>
                    <option value="headers">Headers only</option>
                    <option value="query">Query params</option>
                    <option value="all">Full request</option>
                    <option value="expression">Expression</option>
                </select>
            )}


            {mode === "payloadExpression" && (
                <input
                    type="text"
                    placeholder="{{body.message}}"
                    className="w-full rounded border border-gray-700 px-3 py-2 bg-gray-900 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={value?.value?.payloadExpression ?? ""}
                    onChange={(e) => {
                        const newPayloadExpression = {
                            name: "payloadExpression",
                            value: e.target.value,
                        };
                        setPayloadExpression(newPayloadExpression);
                        emitChange(mode, payloadSource, newPayloadExpression, mapper);
                    }}
                />
            )}


            {mode === "mapper" && (
                <div className="space-y-2">

                    {(!value.value?.map || value.value?.map?.length === 0) && (
                        <p className="text-gray-500 text-sm text-center py-4">
                            No mappings yet. Click below to add one.
                        </p>
                    )}


                    {value.value?.map?.map((item, index) => (
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
                                onClick={() => removeMapper(index)}
                                className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors font-bold"
                            >
                                ×
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={addMapper}
                        className="w-full border-2 border-dashed border-gray-700 py-3 text-sm text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors rounded"
                    >
                        + Add Mapping
                    </button>
                </div>
            )}
        </div>
        </div>
    );
};
