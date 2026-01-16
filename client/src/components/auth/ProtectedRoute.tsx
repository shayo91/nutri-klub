import { Redirect, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePremium?: boolean;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requirePremium = false,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isPremium, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show loading spinner while checking auth
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login
    return <Redirect to="/login" />;
  }

  if (requireAdmin && !isAdmin) {
    // Redirect to dashboard if trying to access admin route without admin role
    return <Redirect to="/dashboard" />;
  }

  if (requirePremium && !isPremium && !isAdmin) {
    // Redirect to upgrade page if trying to access premium route without premium
    return <Redirect to="/dashboard?upgrade=true" />;
  }

  return <>{children}</>;
}
