import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkAuthStatus } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Store the token
      localStorage.setItem('auth_token', token);
      
      // Trigger auth status check to update the user state
      checkAuthStatus().then(() => {
        // Redirect to dashboard
        navigate('/dashboard');
      });
    } else {
      // If no token, redirect to signin
      navigate('/signin');
    }
  }, [searchParams, navigate, checkAuthStatus]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
