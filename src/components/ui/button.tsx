import React from "react";

type Variant = "primary" | "outline";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  outline: "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", children, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={`px-4 py-2 rounded disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";