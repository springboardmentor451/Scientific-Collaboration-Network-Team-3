import { useState } from 'react';
import Login from './pages/auth/Login';
import ResearcherDashboard from './pages/dashboard/ResearcherDashboard';

// Root component — mounts AppRoutes inside layout + AuthProvider
// For now, toggle between Login and Dashboard for preview.
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn ? (
    <ResearcherDashboard onLogout={() => setIsLoggedIn(false)} />
  ) : (
    <Login onLogin={() => setIsLoggedIn(true)} />
  );
}
