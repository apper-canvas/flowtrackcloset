import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  type = "text", 
  className, 
  disabled,
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-surface-800 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400 dark:placeholder:text-gray-500",
        error 
          ? "border-red-300 dark:border-red-600 focus:ring-red-500" 
          : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500",
        className
      )}
      disabled={disabled}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;