import Link from "next/link";

interface GameButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

const variants = {
  primary: "bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 hover:from-yellow-300 hover:to-orange-400 shadow-lg shadow-orange-500/30",
  secondary: "bg-white/15 text-white hover:bg-white/25 border border-white/20",
  danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-400",
  success: "bg-gradient-to-r from-green-400 to-emerald-600 text-slate-900 hover:from-green-300",
};

const sizes = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-6 py-3 text-base rounded-2xl",
  lg: "px-8 py-4 text-lg rounded-2xl font-black",
};

export function GameButton({
  href,
  onClick,
  children,
  variant = "primary",
  size = "md",
  disabled,
  className = "",
}: GameButtonProps) {
  const cls = `inline-flex items-center justify-center font-bold transition transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
