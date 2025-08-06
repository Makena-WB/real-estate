import { LogIn, UserPlus, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Index = () => {
  return (
    <section className="overflow-hidden py-20 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen flex items-center">
      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-12 items-center justify-center">
          <div className="relative flex flex-col gap-8 items-center">
            <div
              style={{ transform: "translate(-50%, -50%)" }}
              className="absolute top-1/2 left-1/2 -z-10 mx-auto size-[800px] rounded-full border border-blue-200/30 [mask-image:linear-gradient(to_top,transparent,transparent,white,white,white,transparent,transparent)] p-16 md:size-[1300px] md:p-32"
            >
              <div className="size-full rounded-full border border-blue-200/20 p-16 md:p-32">
                <div className="size-full rounded-full border border-blue-200/10"></div>
              </div>
            </div>
            
            {/* Bigger house icon with better spacing */}
            <span className="mx-auto flex size-28 items-center justify-center rounded-full border border-blue-200 md:size-32 bg-white/90 shadow-lg backdrop-blur-sm">
              <Home className="size-16 text-blue-700 md:size-20" />
            </span>
            
            {/* Title with more spacing */}
            <div className="text-center space-y-6">
              <h1 className="mx-auto max-w-5xl text-center text-4xl font-extrabold text-blue-700 md:text-7xl lg:text-8xl tracking-tight drop-shadow-lg">
                EstateEase
              </h1>
              <p className="mx-auto max-w-3xl text-center text-blue-900 md:text-xl lg:text-2xl font-medium leading-relaxed">
                Effortless Real Estate Management for Modern Agents, Homeowners, and Renters. <br className="hidden md:block" />
                Discover, list, and manage properties with ease and security.
              </p>
            </div>
            
            {/* Buttons with better spacing */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 pb-16">
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="flex items-center gap-3 min-w-[140px]">
                  <LogIn className="size-5" /> Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="default" size="lg" className="flex items-center gap-3 min-w-[140px]">
                  <UserPlus className="size-5" /> Sign Up
                </Button>
              </Link>
            </div>
            
            <div className="text-sm text-blue-600 font-semibold opacity-80">
              Trusted by agents and homeowners across the country
            </div>
          </div>
          
          {/* Image with better spacing */}
          <div className="w-full max-w-4xl">
            <img
              src="/landing.jpg"
              alt="Modern real estate"
              className="mx-auto h-full max-h-[500px] w-full rounded-3xl object-cover shadow-2xl border border-blue-200/50"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
