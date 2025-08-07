"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;
  const role = user?.role; // Assumes your user object has a 'role' field

  return (
    <nav className="w-full border-b bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-3">
        <Link href="/" className="font-bold text-blue-700 text-xl">EstateEase</Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {!user && (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/auth/register">Register</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/auth/login">Login</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}
            {user && (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                {role === "admin" && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href="/admin">Admin Panel</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
                <NavigationMenuItem>
                  <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
                    Logout
                  </Button>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
