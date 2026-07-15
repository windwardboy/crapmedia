import Link from "next/link";
import { Logo } from "@/components/logo";
import { playerUrl, siteName } from "@/lib/config";

export function SiteHeader() {
  return (
    <header className="border-b border-cm-border/60">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="h-9 w-9 shrink-0" />
          <span className="text-lg font-bold">{siteName}</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/about"
            className="hidden text-cm-text-muted hover:text-cm-text sm:inline"
          >
            About
          </Link>
          <a
            href={playerUrl}
            className="cm-btn-primary px-5 py-2.5"
          >
            Open Player
          </a>
        </nav>
      </div>
    </header>
  );
}
