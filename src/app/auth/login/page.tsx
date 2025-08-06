"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    // Redirect to dashboard on success
    router.push("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <Input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
