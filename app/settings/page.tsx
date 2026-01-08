import { FC } from "react";
import { Button } from "@/components/ui/button";
import {SideMenu} from "@/components/SideMenu";
import Agents from "@/app/components/agents";

const Page: FC = () => {
    return (
        <div className="min-h-screen">
            <div className="grid min-h-screen grid-cols-1 gap-4 md:grid-cols-4">
                <aside className="md:col-span-1  p-4 text-white flex items-center justify-center">

                </aside>

                <main className="md:col-span-3  p-4 text-white flex mt-[5%]">
                   <Agents/>
                </main>
            </div>
        </div>
    );
};

export default Page;
