import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

export interface BrandButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-6 py-2.5 text-[13px]",
  md: "px-8 py-[13px] text-sm",
  lg: "px-10 py-4 text-sm",
};

// Secondary uses a 1px border, so we trim 1px of padding to keep
// the visual bounding box identical to the primary variant.
const sizeStylesSecondary: Record<ButtonSize, string> = {
  sm: "px-[23px] py-[9px] text-[13px]",
  md: "px-[31px] py-[12px] text-sm",
  lg: "px-[39px] py-[15px] text-sm",
};

const Button = React.forwardRef<HTMLButtonElement, BrandButtonProps>(
  (
    { variant = "primary", size = "md", className, children, ...props },
    ref,
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-medium tracking-[0.02em] rounded-sm " +
      "transition-colors duration-base ease-expo active:scale-[0.98] " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 " +
      "focus-visible:ring-offset-[var(--color-bg-base)] disabled:opacity-50 disabled:pointer-events-none";

    const variantStyles =
      variant === "primary"
        ? "bg-accent text-white hover:bg-accent-hover"
        : "bg-transparent text-accent border border-accent hover:bg-[rgba(122,79,30,0.07)]";

    const sizing =
      variant === "secondary" ? sizeStylesSecondary[size] : sizeStyles[size];

    return (
      <button
        ref={ref}
        className={cn(base, variantStyles, sizing, className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "BrandButton";

export default Button;
export { Button };
