import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "dark";
type Size = "md" | "lg" | "xl";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-alert text-white border border-alert hover:bg-alert-strong active:bg-alert-strong disabled:bg-line-strong disabled:border-line-strong",
  dark: "bg-ink text-white border border-ink hover:bg-ink-2 active:bg-ink-2 disabled:bg-line-strong disabled:border-line-strong",
  secondary:
    "bg-surface text-ink border border-line-strong hover:border-ink active:bg-sunken disabled:text-ink-3 disabled:border-line",
  ghost: "bg-transparent text-ink-2 border border-transparent hover:bg-sunken active:bg-sunken disabled:text-ink-3",
};

const SIZES: Record<Size, string> = {
  md: "min-h-[44px] px-4 text-[15px] gap-2 rounded-lg",
  lg: "min-h-[52px] px-6 text-[17px] gap-2.5 rounded-lg",
  xl: "min-h-[64px] px-9 text-[20px] gap-3 rounded-xl",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", className = "", type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`inline-flex select-none items-center justify-center font-semibold tracking-[-0.005em] transition-colors duration-150 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    />
  );
});

export default Button;
