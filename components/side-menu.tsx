"use client";

import Link from "next/link";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function SideMenu() {
    return (
        <aside className="w-full">
            <Accordion type="single" collapsible defaultValue="settings">
                {/* Options */}
                <AccordionItem value="options">
                    <AccordionTrigger>Options</AccordionTrigger>
                    <AccordionContent>
                        <nav className="flex flex-col gap-2 pl-2">
                            <Link
                                href="/options/general"
                                className="rounded px-2 py-1 hover:bg-muted"
                            >
                                General
                            </Link>
                            <Link
                                href="/options/notifications"
                                className="rounded px-2 py-1 hover:bg-muted"
                            >
                                Notifications
                            </Link>
                            <Link
                                href="/options/security"
                                className="rounded px-2 py-1 hover:bg-muted"
                            >
                                Security
                            </Link>
                        </nav>
                    </AccordionContent>
                </AccordionItem>

                {/* Settings */}
                <AccordionItem value="settings">
                    <AccordionTrigger>Settings</AccordionTrigger>
                    <AccordionContent>
                        <nav className="flex flex-col gap-2 pl-2">
                            <Link
                                href="/settings/profile"
                                className="rounded px-2 py-1 hover:bg-muted"
                            >
                                Profile
                            </Link>
                            <Link
                                href="/settings/account"
                                className="rounded px-2 py-1 hover:bg-muted"
                            >
                                Account
                            </Link>
                            <Link
                                href="/settings/billing"
                                className="rounded px-2 py-1 hover:bg-muted"
                            >
                                Billing
                            </Link>
                        </nav>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </aside>
    );
}
