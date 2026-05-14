import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUserProfile } from "../hooks/useUserProfile";

/**
 * ProtectedRoute component that restricts access to authenticated users.
 * It waits for BOTH auth and profile to fully load before making any routing decision.
 */
export const ProtectedRoute: React.FC = () => {
  const { session } = useAuth();
  const { profile, loading } = useUserProfile();

  // loading is true until auth resolves AND profile is fetched from Supabase
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F8F5FF]">
        <div className="relative flex items-center justify-center">
            <div className="absolute animate-ping h-16 w-16 rounded-full bg-primary/20"></div>
            <div className="relative h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
        </div>
        <p className="mt-6 text-sm font-medium text-primary animate-pulse">
            Shining your aura...
        </p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!profile.onboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};
