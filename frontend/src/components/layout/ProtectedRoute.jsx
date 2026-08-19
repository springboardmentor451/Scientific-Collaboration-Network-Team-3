import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-surface-bright">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect based on their role if they try to access something they shouldn't
    switch (role) {
      case 'System Admin': return <Navigate to="/dashboard/admin" replace />;
      case 'Institution Admin': return <Navigate to="/dashboard/institution" replace />;
      case 'Reviewer': return <Navigate to="/dashboard/reviewer" replace />;
      case 'Researcher': 
      default: return <Navigate to="/dashboard/researcher" replace />;
    }
  }

  return <Outlet />;
}
