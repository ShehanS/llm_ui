import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";

const positionMap = {
    left: Position.Left,
    right: Position.Right,
    top: Position.Top,
    bottom: Position.Bottom,
};

export default memo(({ data, isConnectable }: any) => {
    return (
        <div className="rounded-xl bg-white shadow-lg border border-gray-200 min-w-[220px]">

            {/* Header */}
            <div
                className="rounded-t-xl px-3 py-2 text-white text-sm font-semibold"
                style={{ background: data.color || "#4f46e5" }}
            >
                {data.label}
            </div>

            {/* Body */}
            <div className="p-3 text-xs text-gray-600">
                JSON driven dynamic node
            </div>

            {/* INPUT HANDLES */}
            {data.inputs?.map((input: any, index: number) => (
                <Handle
                    key={input.id}
                    id={input.id}
                    type="target"
                    position={positionMap[input.position]}
                    isConnectable={isConnectable}
                    style={{
                        top: 45 + index * 22,
                        width: 10,
                        height: 10,
                        background: "#22c55e",
                        border: "2px solid white",
                    }}
                />
            ))}

            {/* OUTPUT HANDLES */}
            {data.outputs?.map((output: any, index: number) => (
                <Handle
                    key={output.id}
                    id={output.id}
                    type="source"
                    position={positionMap[output.position]}
                    isConnectable={isConnectable}
                    style={{
                        top: 45 + index * 22,
                        width: 10,
                        height: 10,
                        background: "#ef4444",
                        border: "2px solid white",
                    }}
                />
            ))}
        </div>
    );
});
