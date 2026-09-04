import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layouts
import AppShell from '../components/layout/AppShell';
import ProtectedRoute from '../components/layout/ProtectedRoute';

// Pages - Auth
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import OTPVerification from '../pages/auth/OTPVerification';
import OtpChallengeRoute from '../components/layout/OtpChallengeRoute';

// Pages - Dashboards
import ResearcherDashboard from '../pages/dashboard/ResearcherDashboard';
import InstitutionDashboard from '../pages/dashboard/InstitutionDashboard';
import ReviewerDashboard from '../pages/dashboard/ReviewerDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';

// Pages - Researcher
import ResearcherList from '../pages/researcher/ResearcherList';
import ResearcherProfile from '../pages/researcher/ResearcherProfile';

// Pages - Publication
import PublicationList from '../pages/publication/PublicationList';
import PublicationForm from '../pages/publication/PublicationForm';

// Pages - Collaboration
import CollaborationBoard from '../pages/collaboration/CollaborationBoard';
import TeamManagement from '../pages/collaboration/TeamManagement';

// Pages - Conference
import ConferenceList from '../pages/conference/ConferenceList';
import ConferenceSchedule from '../pages/conference/ConferenceSchedule';

// Pages - Citation
import CitationManager from '../pages/citation/CitationManager';

// Pages - Reports
import ReportsHome from '../pages/reports/ReportsHome';

// Pages - Admin
import UserManagement from '../pages/admin/UserManagement';
import AuditLog from '../pages/admin/AuditLog';

export default function AppRoutes() {
  const { user, role, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/verify-otp"
        element={
          <OtpChallengeRoute>
            <OTPVerification />
          </OtpChallengeRoute>
        }
      />
      
      {/* Root redirect based on role */}
      <Route path="/" element={
        user ? (
          <Navigate to={`/dashboard/${role === 'Institution Admin' ? 'institution' : role === 'System Admin' ? 'admin' : role.toLowerCase()}`} replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      {/* Protected routes wrapped in AppShell */}
      <Route element={<AppShell />}>
        {/* Dashboards - specific to each role */}
        <Route element={<ProtectedRoute allowedRoles={['Researcher']} />}>
          <Route path="/dashboard/researcher" element={<ResearcherDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['Institution Admin']} />}>
          <Route path="/dashboard/institution" element={<InstitutionDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['Reviewer']} />}>
          <Route path="/dashboard/reviewer" element={<ReviewerDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['System Admin']} />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/audit-log" element={<AuditLog />} />
        </Route>

        {/* Shared features with specific access control */}
        <Route element={<ProtectedRoute allowedRoles={['Researcher', 'Institution Admin', 'System Admin']} />}>
          <Route path="/researchers" element={<ResearcherList />} />
          <Route path="/researchers/:id" element={<ResearcherProfile />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['Researcher', 'Institution Admin', 'Reviewer']} />}>
          <Route path="/publications" element={<PublicationList />} />
          <Route path="/publications/new" element={<PublicationForm />} />
          <Route path="/publications/:id/edit" element={<PublicationForm />} />
          
          <Route path="/conferences" element={<ConferenceList />} />
          <Route path="/conferences/schedule" element={<ConferenceSchedule />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['Researcher', 'Institution Admin']} />}>
          <Route path="/collaborations" element={<CollaborationBoard />} />
          <Route path="/collaborations/teams" element={<TeamManagement />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['Researcher']} />}>
          <Route path="/citations" element={<CitationManager />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['Researcher', 'Institution Admin', 'System Admin']} />}>
          <Route path="/reports" element={<ReportsHome />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
