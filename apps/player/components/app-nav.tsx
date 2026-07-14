"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/", label: "Home" },
  { href: "/playlists", label: "Playlists" },
  { href: "/drive", label: "Drive" },
  { href: "/settings", label: "Settings" },
];

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden
      >
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    );
  }

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function AppNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-cm-border bg-cm-bg-elevated">
      <div className="mx-auto max-w-3xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold"
            onClick={() => setOpen(false)}
          >
            <Image src="/icon.png" alt="" width={28} height={28} />
            <span>CrapMedia</span>
          </Link>

          <nav className="hidden gap-1 text-sm md:flex">
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

          <button
            type="button"
            className="cm-btn cm-btn-ghost -mr-1 h-10 w-10 rounded-full md:hidden"
            aria-expanded={open}
            aria-controls="app-nav-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <MenuIcon open={open} />
          </button>
        </div>

        {open ? (
          <nav
            id="app-nav-menu"
            className="mt-3 flex flex-col gap-1 border-t border-cm-border pt-3 text-sm md:hidden"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-cm-text-muted hover:bg-cm-bg-subtle hover:text-cm-text"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
