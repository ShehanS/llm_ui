"use client";

import React, { FC, useState } from "react";
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const NavBar: FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 z-20 w-full border-b border-border bg-black text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center">

                    {/* Left - Logo */}
                    <Link
                        href="/"
                        className="z-10 text-2xl font-bold hover:text-gray-300 transition-colors"
                    >
                        LLM
                    </Link>

                    {/* Center - Menu */}
                    <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
                        <NavigationMenu>
                            <NavigationMenuList className="flex gap-2">

                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        <Link href="/settings">Settings</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        <Link href="/about">About</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        <Link href="/flow">Flow</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Right - Mobile Toggle */}
                    <div className="ml-auto md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="rounded-md p-2 hover:bg-gray-800"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? "✕" : "☰"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="space-y-2 px-4 pb-4 pt-2">

                    <Link
                        href="/settings"
                        className="block py-2 hover:text-gray-300"
                        onClick={() => setIsOpen(false)}
                    >
                        Settings
                    </Link>

                    <Link
                        href="/about"
                        className="block py-2 hover:text-gray-300"
                        onClick={() => setIsOpen(false)}
                    >
                        About
                    </Link>

                    <Link
                        href="/flow"
                        className="block py-2 hover:text-gray-300"
                        onClick={() => setIsOpen(false)}
                    >
                        Flow
                    </Link>

                </div>
            </div>
        </nav>
    );
};

export default NavBar;
