import React from "react";
import { Handle, Position } from "@xyflow/react";

type Port = {
    id: string;
    label: string;
    position: "left" | "right";
};

type CommonNodeProps = {
    data: {
        label: string;
        color: string;
        inputs: Port[];
        outputs: Port[];
        isSelected?: boolean;
    };
};

const SIZE = 60;


const getHandleColor = (id: string, defaultColor: string) => {
    if (id === "error") return "#ef4444";
    if (id === "default") return "#349bff";
};

const CommonNode: React.FC<CommonNodeProps> = ({ data }) => {
    return (
        <div
            style={{
                width: SIZE,
                height: SIZE,
                borderRadius: 8,
                background: "#020617",
                border: `2px solid ${data.color}`,
                color: "#e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 8,
                textAlign: "center",
                position: "relative",
                boxShadow: data.isSelected
                    ? `0 0 0 2px ${data.color}`
                    : "none",
            }}
        >
            {data.label}


            {data.inputs.map((input, index) => {
                const top = ((index + 1) * SIZE) / (data.inputs.length + 1);

                return (
                    <React.Fragment key={input.id}>
                        <Handle
                            id={input.id}
                            type="target"
                            position={Position.Left}
                            style={{
                                top,
                                background: getHandleColor(input.id, data.color),
                                width: 8,
                                height: 8,
                            }}
                        />

                        <div
                            style={{
                                position: "absolute",
                                left: -42,
                                top: top - 6,
                                fontSize: 8,
                                color: "#cbd5f5",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {input.label}
                        </div>
                    </React.Fragment>
                );
            })}

            {data.outputs.map((output, index) => {
                const top = ((index + 1) * SIZE) / (data.outputs.length + 1);
                const color = getHandleColor(output.id, data.color);

                return (
                    <React.Fragment key={output.id}>
                        <Handle
                            id={output.id}
                            type="source"
                            position={Position.Right}
                            style={{
                                top,
                                background: color,
                                width: 8,
                                height: 8,
                            }}
                        />

                        {/* OUTPUT LABEL */}
                        <div
                            style={{
                                position: "absolute",
                                right: -42,
                                top: top - 6,
                                fontSize: 8,
                                color,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {output.label}
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default CommonNode;
