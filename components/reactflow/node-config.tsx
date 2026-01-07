type Props = {
    node: any;
    onChange: (name: string, value: any) => void;
};

export const NodeConfigForm: React.FC<Props> = ({ node, onChange }) => {
    if (!node?.data?.inputProps?.length) {
        return <p className="text-gray-400">No configuration</p>;
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">{node.data.label}</h3>

            {node.data.inputProps.map((prop: any) => {
                switch (prop.type) {
                    case "text":
                        return (
                            <div key={prop.name}>
                                <label className="block text-sm mb-1">
                                    {prop.displayName}
                                </label>
                                <input
                                    className="w-full rounded border px-2 py-1 bg-black text-white"
                                    value={prop.value ?? ""}
                                    onChange={e => onChange(prop.name, e.target.value)}
                                />
                            </div>
                        );

                    case "number":
                        return (
                            <div key={prop.name}>
                                <label className="block text-sm mb-1">
                                    {prop.displayName}
                                </label>
                                <input
                                    type="number"
                                    className="w-full rounded border px-2 py-1 bg-black text-white"
                                    value={prop.value ?? 0}
                                    onChange={e => onChange(prop.name, Number(e.target.value))}
                                />
                            </div>
                        );

                    case "select":
                        return (
                            <div key={prop.name}>
                                <label className="block text-sm mb-1">
                                    {prop.displayName}
                                </label>
                                <select
                                    className="w-full rounded border px-2 py-1 bg-black text-white"
                                    value={prop.value?.value ?? ""}
                                    onChange={e => {
                                        const selected = prop.values.find(
                                            (v: any) => v.value === e.target.value
                                        );
                                        onChange(prop.name, selected);
                                    }}
                                >
                                    {prop.values.map((v: any) => (
                                        <option key={v.value} value={v.value}>
                                            {v.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        );

                    case "checkBox":
                        return (
                            <label key={prop.name} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={!!prop.value}
                                    onChange={e => onChange(prop.name, e.target.checked)}
                                />
                                {prop.displayName}
                            </label>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
};
