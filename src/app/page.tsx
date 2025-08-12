import { LogIn, UserPlus, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const Index = () => {
  return (
    <section className="overflow-hidden py-20 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 min-h-screen flex items-center">
      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-12 items-center justify-center">
          <div className="relative flex flex-col gap-8 items-center">
            <div
              style={{ transform: "translate(-50%, -50%)" }}
              className="absolute top-1/2 left-1/2 -z-10 mx-auto size-[800px] rounded-full border border-slate-600/30 [mask-image:linear-gradient(to_top,transparent,transparent,white,white,white,transparent,transparent)] p-16 md:size-[1300px] md:p-32"
            >
              <div className="size-full rounded-full border border-slate-600/20 p-16 md:p-32">
                <div className="size-full rounded-full border border-slate-600/10"></div>
              </div>
            </div>

            {/* Bigger house icon with better spacing */}
            <span className="mx-auto flex size-28 items-center justify-center rounded-full border border-slate-600/50 md:size-32 bg-slate-800/90 shadow-lg backdrop-blur-sm">
              <Home className="size-16 text-slate-300 md:size-20" />
            </span>

            {/* Title with more spacing */}
            <div className="text-center space-y-6">
              <h1 className="mx-auto max-w-5xl text-center text-4xl font-extrabold text-slate-100 md:text-7xl lg:text-8xl tracking-tight drop-shadow-lg">
                EstateEase
              </h1>
              <p className="mx-auto max-w-3xl text-center text-slate-300 md:text-xl lg:text-2xl font-medium leading-relaxed">
                Effortless Real Estate Management for Modern Agents, Homeowners, and Renters.{" "}
                <br className="hidden md:block" />
                Discover, list, and manage properties with ease and security.
              </p>
            </div>

            {/* Enhanced sophisticated buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 pb-16">
              <Link href="/auth/login">
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-slate-700/80 backdrop-blur-sm border-2 border-slate-600/60 text-slate-200 hover:text-slate-100 hover:bg-slate-700/90 hover:border-slate-500/80 transition-all duration-300 ease-out shadow-lg hover:shadow-xl min-w-[160px] h-14 text-lg font-semibold rounded-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <LogIn className="size-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                  <span className="relative z-10">Login</span>
                </Button>
              </Link>

              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 text-white hover:from-slate-700 hover:via-slate-800 hover:to-slate-900 transition-all duration-300 ease-out shadow-lg hover:shadow-2xl hover:shadow-slate-500/25 min-w-[160px] h-14 text-lg font-semibold rounded-2xl border-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  <UserPlus className="size-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                  <span className="relative z-10">Sign Up</span>
                </Button>
              </Link>
            </div>

            <div className="text-sm text-slate-400 font-semibold opacity-80">
              Trusted by agents and homeowners across the country
            </div>
          </div>

          {/* Image with better spacing */}
          <div className="w-full max-w-4xl">
            <img
              src="/landing.jpg"
              alt="Modern real estate"
              className="mx-auto h-full max-h-[500px] w-full rounded-3xl object-cover shadow-2xl border border-slate-600/50"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Index
