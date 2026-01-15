"use client";

import {FC, useEffect, useState} from "react";
import {useConfigStore} from "@/components/reactflow/agent-config/data_service";
import {BaseSelect} from "@/app/components/base-select";
import {Bot, Loader} from "lucide-react";

type RouteAgentSelectorProps = {
    value: any,
    onChange: (value: string, name: string) => void;
}

const RouteAgentSelector: FC<RouteAgentSelectorProps> = ({value, onChange}) => {
    const {
        routingConfigs,
        fetchInitialData,
        loading
    } = useConfigStore();

    const [selectedRoute, setSelectedRoute] = useState(value?.value ?? "");

    useEffect(() => {
        fetchInitialData();
    }, []);

    const handleRouteChange = async (routeName: string) => {
        setSelectedRoute(routeName);
        emit(routeName);
    };
    const emit = (next: any) => {
        onChange("routeAgent", next);
    };

    return (
        <BaseSelect
            onClick={fetchInitialData}
            value={selectedRoute}
            onChange={(e) => handleRouteChange(e.target.value)}
            disabled={loading}
            rightIcon={loading ? <Loader size={14}/> : <Bot size={14}/>}
        >
            <option value="">Select Route...</option>
            {routingConfigs.map((rc) => (
                <option key={rc.id} value={rc.routeName}>
                    {rc.routeName}
                </option>
            ))}
        </BaseSelect>
    );
};

export default RouteAgentSelector;
