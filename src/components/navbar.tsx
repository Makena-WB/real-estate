import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex gap-4 mb-4 border-b pb-2">
      <Link href="/">Home</Link>
      <Link href="/auth/register">Register</Link>
      <Link href="/auth/login">Login</Link>
      <Link href="/dashboard">Dashboard</Link>
    </nav>
  );
}
