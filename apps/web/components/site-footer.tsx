import Link from "next/link";
import { githubUrl, siteName } from "@/lib/config";

export function SiteFooter() {
  return (
    <footer className="border-t border-cm-border mt-auto">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-10 text-sm text-cm-text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {siteName} · MIT licensed · Open source
        </p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/about" className="hover:text-cm-text">
            About
          </Link>
          <Link href="/privacy" className="hover:text-cm-text">
            Privacy
          </Link>
          <a
            href={githubUrl}
            className="hover:text-cm-text"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
