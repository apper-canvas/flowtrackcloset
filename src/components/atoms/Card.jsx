import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  variant = "default",
  className, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white dark:bg-surface-800 border border-gray-200 dark:border-gray-700",
    glass: "glass dark:glass-dark",
    elevated: "bg-white dark:bg-surface-800 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;