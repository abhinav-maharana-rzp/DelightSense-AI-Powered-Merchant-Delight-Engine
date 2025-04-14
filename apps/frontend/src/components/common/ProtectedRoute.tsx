// src/components/common/ProtectedRoute.tsx
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

// Replace this with your actual authentication logic or context
const isAuthenticated = false; // Example: get from localStorage or auth context

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;