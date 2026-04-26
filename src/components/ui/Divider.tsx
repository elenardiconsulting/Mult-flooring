import * as React from "react";
import { cn } from "@/lib/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  color?: string;
}

const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ color, className, style, ...props }, ref) => {
    return (
      <hr
        ref={ref}
        className={cn("w-full border-0 border-t", className)}
        style={{
          borderTopColor: color ?? "var(--color-border)",
          ...style,
        }}
        {...props}
      />
    );
  },
);

Divider.displayName = "Divider";

export default Divider;
export { Divider };
