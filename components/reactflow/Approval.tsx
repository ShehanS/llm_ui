import { Switch } from "@/components/ui/switch"

type ApprovalService = {
    service: string
}

type DefaultValues = {
    name: string
    value: string
}

type ApprovalProps = {
    value?: unknown
    values?: DefaultValues[]
    onChange: (name: string, value: ApprovalService[]) => void
}

const normalizeServices = (value: unknown): ApprovalService[] => {
    if (!Array.isArray(value)) return []
    return value.filter(
        (v): v is ApprovalService =>
            typeof v === "object" && v !== null && "service" in v
    )
}

const normalizeValues = (values?: DefaultValues[]): DefaultValues[] => {
    if (!Array.isArray(values)) return []
    return values
}

const Approval = ({ value, values, onChange }: ApprovalProps) => {
    const services = normalizeServices(value)
    const availableValues = normalizeValues(values)

    const isEnabled = (service: string) =>
        services.some((v) => v.service === service)

    const toggleService = (service: string, enabled: boolean) => {
        const updated = enabled
            ? isEnabled(service)
                ? services
                : [...services, { service }]
            : services.filter((v) => v.service !== service)

        onChange("approval", updated)
    }

    return (
        <div className="space-y-3 pt-4 border-t border-slate-800 mt-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                Approval By
            </label>

            {availableValues.map((item) => (
                <div
                    key={item.value}
                    className="flex items-center justify-between mt-3"
                >
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                        {item.name}
                    </label>
                    <Switch
                        id={item.value}
                        name={item.value}
                        checked={isEnabled(item.value)}
                        onCheckedChange={(v) => toggleService(item.value, v)}
                    />
                </div>
            ))}
        </div>
    )
}

export default Approval
