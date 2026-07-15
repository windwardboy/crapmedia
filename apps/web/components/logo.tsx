export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="36" height="36" rx="10" fill="var(--cm-accent)" />
      <path
        d="M10 18.5c0-3.5 2.5-6 6-6 1.8 0 3.2.7 4.2 2"
        stroke="var(--cm-accent-on, #fff)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M26 18.5c0-3.5-2.5-6-6-6-1.8 0-3.2.7-4.2 2"
        stroke="var(--cm-accent-on, #fff)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="14"
        y="22"
        width="8"
        height="3"
        rx="1.5"
        fill="var(--cm-accent-on, #fff)"
      />
    </svg>
  );
}
