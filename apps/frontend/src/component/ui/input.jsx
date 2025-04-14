// File: apps/frontend/src/components/ui/input.jsx
import React from "react";
import clsx from "clsx";

export function Input({ className, ...props }) {
    const baseStyles = "px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

    return (
        <input
            className={clsx(baseStyles, className)}
            {...props}
        />
    );
}