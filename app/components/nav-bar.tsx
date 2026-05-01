"use client";

import React, { FC, useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const NavBar: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();

    const handleLogout = async () => {
        await signOut({ redirect: false });

        const issuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER;
        const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_ID;
        const redirectUri = window.location.origin;

        if (issuer && clientId) {
            const url = `${issuer}/protocol/openid-connect/logout?client_id=${clientId}&post_logout_redirect_uri=${encodeURIComponent(redirectUri)}`;
            window.location.replace(url);
        }
    };
    return (
        <nav className="fixed top-0 z-20 w-full border-b border-border bg-black text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center">

                    <Link
                        href="/"
                        className="z-10 text-2xl font-bold hover:text-gray-300 transition-colors"
                    >
                        TEST FLOW
                    </Link>

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

                    <div className="ml-auto flex items-center gap-4">
                        <div className="hidden md:block">
                            {session ? (
                                <button onClick={handleLogout} className="text-sm font-medium hover:text-gray-300">
                                    Logout ({session.user?.name || "User"})
                                </button>
                            ) : (
                                <Link href="/signin" className="text-sm font-medium hover:text-gray-300">Login</Link>
                            )}
                        </div>

                        <div className="md:hidden">
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
            </div>

            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
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

                    <div className="border-t border-gray-800 pt-2">
                        {session ? (
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="block w-full text-left py-2 hover:text-gray-300"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => signIn("keycloak")}
                                className="block w-full text-left py-2 hover:text-gray-300"
                            >
                                Login
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default NavBar;
