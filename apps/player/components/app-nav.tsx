import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/", label: "Home" },
  { href: "/drive", label: "Drive" },
  { href: "/settings", label: "Settings" },
];

export function AppNav() {
  return (
    <header className="border-b border-cm-border bg-cm-bg-elevated">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/icon.png" alt="" width={28} height={28} />
          <span>CrapMedia</span>
        </Link>
        <nav className="flex gap-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-cm-text-muted hover:bg-cm-bg-subtle hover:text-cm-text"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
