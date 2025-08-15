"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function LogoutButton() {
  return (
    <Button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="group relative overflow-hidden px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 font-semibold rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-lg backdrop-blur-sm text-sm sm:text-base flex items-center justify-center gap-2"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <LogOut className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
      <span className="relative z-10">Logout</span>
    </Button>
  )
}
