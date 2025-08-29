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
import { Home, LogOut, User, Settings, Menu, X, FileText } from "lucide-react"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { useState } from "react"

export default function Navbar() {
  const { data: session } = useSession()
  const user = session?.user
  const role = user?.role
  const [isOpen, setIsOpen] = useState(false)

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

        {/* Desktop Navigation */}
        <div className="hidden md:flex">
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

                  {/* Applications Link for Users */}
                  {role === "USER" && (
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/applications"
                          className="px-4 py-2 rounded-lg text-slate-300 font-medium hover:bg-slate-700/50 hover:text-slate-200 transition-all duration-200 text-sm border border-transparent hover:border-slate-600/30 flex items-center gap-2"
                        >
                          <FileText className="size-4" />
                          Applications
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )}

                  {/* My Properties Link for Agents/Landlords */}
                  {role && ["AGENT", "LANDLORD"].includes(role) && (
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/my-properties"
                          className="px-4 py-2 rounded-lg text-slate-300 font-medium hover:bg-slate-700/50 hover:text-slate-200 transition-all duration-200 text-sm border border-transparent hover:border-slate-600/30"
                        >
                          My Properties
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )}

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
                      <div className="hidden lg:block">
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
                      <span className="hidden lg:inline">Logout</span>
                    </Button>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Enhanced Mobile Hamburger Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-300 hover:text-slate-200 hover:bg-slate-700/50 transition-all duration-200"
              >
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-slate-800/95 backdrop-blur-md border-slate-600/30 p-0">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-600/30">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full border border-slate-600/50 bg-slate-700/50">
                      <Home className="size-4 text-slate-300" />
                    </div>
                    <span className="font-bold text-slate-100 text-lg">EstateEase</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-slate-300 hover:text-slate-200 hover:bg-slate-700/50"
                  >
                    <X className="size-5" />
                  </Button>
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-2">
                    <Link
                      href="/"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-slate-200 transition-all duration-200 font-medium"
                    >
                      <Home className="size-5" />
                      Home
                    </Link>

                    {!user && (
                      <>
                        <Link
                          href="/auth/register"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-slate-200 transition-all duration-200 font-medium"
                        >
                          <User className="size-5" />
                          Register
                        </Link>
                        <Link
                          href="/auth/login"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 py-3 px-4 rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800 transition-all duration-200 font-medium shadow-lg"
                        >
                          <LogOut className="size-5" />
                          Login
                        </Link>
                      </>
                    )}

                    {user && (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-slate-200 transition-all duration-200 font-medium"
                        >
                          <User className="size-5" />
                          Dashboard
                        </Link>
                        <Link
                          href="/properties"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-slate-200 transition-all duration-200 font-medium"
                        >
                          <Home className="size-5" />
                          Properties
                        </Link>
                        <Link
                          href="/favorites"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-slate-200 transition-all duration-200 font-medium"
                        >
                          <Home className="size-5" />
                          Favorites
                        </Link>

                        {/* Applications Link for Users */}
                        {role === "USER" && (
                          <Link
                            href="/applications"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-slate-200 transition-all duration-200 font-medium"
                          >
                            <FileText className="size-5" />
                            Applications
                          </Link>
                        )}

                        {/* My Properties Link for Agents/Landlords */}
                        {role && ["AGENT", "LANDLORD"].includes(role) && (
                          <Link
                            href="/my-properties"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-slate-200 transition-all duration-200 font-medium"
                          >
                            <Home className="size-5" />
                            My Properties
                          </Link>
                        )}

                        {role === "ADMIN" && (
                          <Link
                            href="/admin"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-slate-200 transition-all duration-200 font-medium"
                          >
                            <Settings className="size-5" />
                            Admin Panel
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Mobile User Profile & Logout */}
                {user && (
                  <div className="border-t border-slate-600/30 p-6">
                    <div className="flex items-center gap-3 mb-4 p-3 bg-slate-700/30 rounded-xl border border-slate-600/20">
                      <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold border border-slate-500/30">
                        {user.name?.charAt(0).toUpperCase() || <User className="size-5" />}
                      </div>
                      <div>
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
                    <Button
                      onClick={() => {
                        setIsOpen(false)
                        signOut({ callbackUrl: "/" })
                      }}
                      variant="outline"
                      className="w-full border-slate-600/50 bg-slate-700/30 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 hover:text-slate-200 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
