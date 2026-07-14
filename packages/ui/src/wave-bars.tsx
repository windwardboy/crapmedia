export function WaveBars({ className = "" }: { className?: string }) {
  return (
    <div
      className={`wave-bars ${className}`.trim()}
      aria-hidden="true"
      role="presentation"
    >
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}
