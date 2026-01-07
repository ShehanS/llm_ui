import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

type Props = {
    data: {
        color: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        label?: string;
    };
    isConnectable: boolean;
};

const handleStyle = {
    width: 10,
    height: 10,
    background: '#6366f1', // indigo
    border: '2px solid white',
};

export default memo(({ data, isConnectable }: Props) => {
    return (
        <div className="rounded-xl bg-white shadow-lg border border-gray-200 min-w-[180px]">

            {/* Header */}
            <div className="rounded-t-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-2 text-white text-sm font-semibold">
                🎨 Color Selector
            </div>

            {/* Content */}
            <div className="p-3 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Selected Color</span>
                    <span
                        className="text-xs font-mono px-2 py-0.5 rounded"
                        style={{ background: data.color, color: '#fff' }}
                    >
            {data.color}
          </span>
                </div>

                <input
                    type="color"
                    className="nodrag w-full h-9 cursor-pointer rounded border"
                    defaultValue={data.color}
                    onChange={data.onChange}
                />
            </div>

            {/* Handles */}
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                style={handleStyle}
            />

            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                style={handleStyle}
            />
        </div>
    );
});
