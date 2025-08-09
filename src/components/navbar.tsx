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
import { Home, LogOut, User, Settings } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;
  const role = user?.role; // Assumes your user object has a 'role' field

  return (
    <nav className="w-full border-b border-blue-200/30 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Enhanced Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-3 group transition-all duration-200 hover:scale-105"
        >
          <div className="flex size-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50 group-hover:bg-blue-100 transition-colors">
            <Home className="size-5 text-blue-700" />
          </div>
          <span className="font-extrabold text-blue-700 text-xl tracking-tight">
            EstateEase
          </span>
        </Link>

        {/* Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-2">
            {/* Home Link */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link 
                  href="/" 
                  className="px-4 py-2 rounded-lg text-blue-700 font-medium hover:bg-blue-50 hover:text-blue-800 transition-all duration-200 text-sm"
                >
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Unauthenticated User Links */}
            {!user && (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/auth/register" 
                      className="px-4 py-2 rounded-lg text-blue-700 font-medium hover:bg-blue-50 hover:text-blue-800 transition-all duration-200 text-sm"
                    >
                      Register
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button asChild variant="default" size="sm" className="ml-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                    <Link href="/auth/login">
                      Login
                    </Link>
                  </Button>
                </NavigationMenuItem>
              </>
            )}

            {/* Authenticated User Links */}
            {user && (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/dashboard" 
                      className="px-4 py-2 rounded-lg text-blue-700 font-medium hover:bg-blue-50 hover:text-blue-800 transition-all duration-200 text-sm"
                    >
                      Dashboard
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Admin Panel Link */}
                {role === "ADMIN" && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link 
                        href="/admin" 
                        className="px-4 py-2 rounded-lg text-blue-700 font-medium hover:bg-blue-50 hover:text-blue-800 transition-all duration-200 text-sm flex items-center gap-2"
                      >
                        <Settings className="size-4" />
                        Admin Panel
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}

                {/* User Profile Indicator */}
                <NavigationMenuItem>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex size-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-semibold">
                      {user.name?.charAt(0).toUpperCase() || <User className="size-4" />}
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-blue-900">
                        {user.name || 'User'}
                      </p>
                      <p className="text-xs text-blue-600 capitalize">
                        {role === "ADMIN" && "Admin"}
                        {role === "LANDLORD" && "Landlord"}
                        {role === "AGENT" && "Agent"}
                        {role === "USER" && "Renter"}
                        {!role && "Member"}
                      </p>
                    </div>
                  </div>
                </NavigationMenuItem>

                {/* Logout Button */}
                <NavigationMenuItem>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="ml-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 flex items-center gap-2"
                  >
                    <LogOut className="size-4" />
                    <span className="hidden sm:inline">Logout</span>
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
