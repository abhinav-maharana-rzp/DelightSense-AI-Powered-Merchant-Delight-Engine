// File: apps/frontend/src/components/ui/button.jsx
import React from "react";
import clsx from "clsx";

export function Button({ children, className, variant = "default", ...props }) {
    const baseStyles = "px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
        secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400",
    };

    return (
        <button
            className={clsx(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
}