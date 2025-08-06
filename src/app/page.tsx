
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="max-w-xl w-full text-center p-10 bg-white/80 rounded-2xl shadow-2xl border border-blue-100">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4 tracking-tight drop-shadow-lg">
          EstateEase
        </h1>
        <p className="text-lg md:text-xl text-blue-900 mb-8 font-medium">
          Effortless Real Estate Management for Modern Agents &amp; Homeowners
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/auth/login" passHref legacyBehavior>
            <Button className="w-full md:w-auto text-lg px-8 py-3 shadow-md" variant="primary">
              Login
            </Button>
          </Link>
          <Link href="/auth/signup" passHref legacyBehavior>
            <Button className="w-full md:w-auto text-lg px-8 py-3 shadow-md" variant="outline">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
