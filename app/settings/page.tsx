import { FC } from "react";
import { OrchestratorManager } from "@/components/reactflow/agent-config/routing_config";

const Page: FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center mt-[2%]">
            <OrchestratorManager />
        </div>
    );
};

export default Page;
