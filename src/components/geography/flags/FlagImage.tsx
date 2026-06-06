import { flagUrl } from "@/lib/geography/flagsGame";

export function FlagImage({
  code,
  alt,
  size = "w320",
  className = "",
}: {
  code: string;
  alt: string;
  size?: "w160" | "w320" | "w640";
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={flagUrl(code, size)}
      alt={alt}
      className={`rounded-xl border border-white/20 shadow-lg object-cover ${className}`}
      loading="lazy"
    />
  );
}
