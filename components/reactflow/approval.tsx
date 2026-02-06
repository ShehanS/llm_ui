import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type ApprovalService = {
    service: string;
};

type DefaultValues = {
    name: string;
    value: string;
};

type ApprovalProps = {
    name: string;
    value?: unknown;
    values?: DefaultValues[];
    onChange: (name: string, value: ApprovalService[]) => void;
};

const normalizeServices = (value: unknown): ApprovalService[] => {
    if (!Array.isArray(value)) return [];
    return value.filter(
        (v): v is ApprovalService =>
            typeof v === "object" && v !== null && "service" in v
    );
};

const normalizeValues = (values?: DefaultValues[]): DefaultValues[] => {
    if (!Array.isArray(values)) return [];
    return values;
};

const Approval = ({ name, value, values, onChange }: ApprovalProps) => {
    const services = normalizeServices(value);
    const availableValues = normalizeValues(values);

    const isEnabled = (service: string) =>
        services.some((v) => v.service === service);

    const toggleService = (service: string, enabled: boolean) => {
        const updated = enabled
            ? isEnabled(service)
                ? services
                : [...services, { service }]
            : services.filter((v) => v.service !== service);

        onChange(name, updated);
    };

    return (
        <div className="space-y-3 pt-4 border-t border-slate-800 mt-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                Approval By
            </label>

            {availableValues.map((item) => (
                <div
                    key={item.value}
                    className="flex items-center justify-between mt-3 px-1"
                >
                    <label className={cn(
                        "text-[10px] font-bold uppercase tracking-widest transition-colors",
                        isEnabled(item.value) ? "text-emerald-500" : "text-slate-500"
                    )}>
                        {item.name}
                    </label>
                    <Switch
                        id={item.value}
                        checked={isEnabled(item.value)}
                        onCheckedChange={(v) => toggleService(item.value, v)}
                    />
                </div>
            ))}
        </div>
    );
};

export default Approval;
