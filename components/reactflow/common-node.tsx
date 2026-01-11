import React from "react";
import {Handle, Position} from "@xyflow/react";

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

const CommonNode: React.FC<CommonNodeProps> = ({ data }) => {
    return (
        <>
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
                    fontWeight: 400,
                    textAlign: "center",
                    position: "relative",
                    boxShadow: data.isSelected
                        ? `0 0 0 2px ${data.color}`
                        : "none",
                }}
            >
                {data.label}

                {data.inputs.map((input) => (
                    <Handle
                        key={input.id}
                        id={input.id}
                        type="target"
                        position={Position.Left}
                        style={{
                            top: `${SIZE / 2}px`,
                            background: data.color,
                        }}
                    />
                ))}

                {data.outputs.map((output) => (
                    <Handle
                        key={output.id}
                        id={output.id}
                        type="source"
                        position={Position.Right}
                        style={{
                            top: `${SIZE / 2}px`,
                            background: data.color,
                        }}
                    />
                ))}
            </div>
        </>
    );
};

export default CommonNode;
