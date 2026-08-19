import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { hasOtpPending } from '../../utils/otpSession';

export default function OtpChallengeRoute({ children }) {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-surface-bright">Loading...</div>;
  }

  if (user && token) {
    return <Navigate to="/" replace />;
  }

  if (!hasOtpPending()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
