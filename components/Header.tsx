import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-hogent-black text-hogent-white">
      <nav className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          PrgStemt
        </Link>
        <Link
          href="/admin"
          className="text-sm text-white/70 transition-colors hover:text-white"
        >
          Admin
        </Link>
      </nav>
    </header>
  );
}
