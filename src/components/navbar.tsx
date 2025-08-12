"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Home, LogOut, User, Settings } from "lucide-react"

export default function Navbar() {
  const { data: session } = useSession()
  const user = session?.user
  const role = user?.role // Assumes your user object has a 'role' field

  return (
    <nav className="w-full border-b border-slate-600/30 bg-slate-800/90 backdrop-blur-md sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Enhanced Logo */}
        <Link href="/" className="flex items-center gap-3 group transition-all duration-200 hover:scale-105">
          <div className="flex size-10 items-center justify-center rounded-full border border-slate-600/50 bg-slate-700/50 group-hover:bg-slate-600/50 transition-colors">
            <Home className="size-5 text-slate-300" />
          </div>
          <span className="font-extrabold text-slate-100 text-xl tracking-tight">EstateEase</span>
        </Link>

        {/* Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-2">
            {/* Home Link */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className="px-4 py-2 rounded-lg text-slate-300 font-medium hover:bg-slate-700/50 hover:text-slate-200 transition-all duration-200 text-sm border border-transparent hover:border-slate-600/30"
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
                      className="px-4 py-2 rounded-lg text-slate-300 font-medium hover:bg-slate-700/50 hover:text-slate-200 transition-all duration-200 text-sm border border-transparent hover:border-slate-600/30"
                    >
                      Register
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="ml-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-md border border-slate-500/30"
                  >
                    <Link href="/auth/login">Login</Link>
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
                      className="px-4 py-2 rounded-lg text-slate-300 font-medium hover:bg-slate-700/50 hover:text-slate-200 transition-all duration-200 text-sm border border-transparent hover:border-slate-600/30"
                    >
                      Dashboard
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/properties"
                      className="px-4 py-2 rounded-lg text-slate-300 font-medium hover:bg-slate-700/50 hover:text-slate-200 transition-all duration-200 text-sm border border-transparent hover:border-slate-600/30"
                    >
                      Properties
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/favorites"
                      className="px-4 py-2 rounded-lg text-slate-300 font-medium hover:bg-slate-700/50 hover:text-slate-200 transition-all duration-200 text-sm border border-transparent hover:border-slate-600/30"
                    >
                      Favorites
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Admin Panel Link */}
                {role === "ADMIN" && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/admin"
                        className="px-4 py-2 rounded-lg text-slate-300 font-medium hover:bg-slate-700/50 hover:text-slate-200 transition-all duration-200 text-sm flex items-center gap-2 border border-transparent hover:border-slate-600/30"
                      >
                        <Settings className="size-4" />
                        Admin Panel
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}

                {/* User Profile Indicator */}
                <NavigationMenuItem>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/30 backdrop-blur-sm">
                    <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-r from-slate-600 to-slate-700 text-white text-sm font-semibold border border-slate-500/30">
                      {user.name?.charAt(0).toUpperCase() || <User className="size-4" />}
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-slate-200">{user.name || "User"}</p>
                      <p className="text-xs text-slate-400 capitalize">
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
                    className="ml-2 border-slate-600/50 bg-slate-700/30 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 hover:text-slate-200 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
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
  )
}
