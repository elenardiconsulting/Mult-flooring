import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionLabelProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

const SectionLabel = React.forwardRef<HTMLSpanElement, SectionLabelProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "block mb-3 text-[11px] font-normal uppercase tracking-[0.12em] text-text-muted",
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);

SectionLabel.displayName = "SectionLabel";

export default SectionLabel;
export { SectionLabel };
