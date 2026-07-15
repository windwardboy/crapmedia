import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/icon.png"
      alt=""
      width={36}
      height={36}
      className={className}
      unoptimized
    />
  );
}
