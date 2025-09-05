import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        // Validate token with your backend
        const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsSignedIn(true);
        } else {
          // Invalid token, remove it and redirect to signin
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          setUser(null);
          setIsSignedIn(false);
          
          // Only redirect if we're not already on public pages
          const currentPath = window.location.pathname;
          const publicPaths = ['/signin', '/signup', '/pricing', '/contactus', '/aboutus'];
          if (!publicPaths.includes(currentPath)) {
            window.location.href = '/signin';
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      setUser(null);
      setIsSignedIn(false);
      
      // Only redirect if we're not already on public pages
      const currentPath = window.location.pathname;
      const publicPaths = ['/signin', '/signup', '/pricing', '/contactus', '/aboutus'];
      if (!publicPaths.includes(currentPath)) {
        window.location.href = '/signin';
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        setUser(data.user);
        setIsSignedIn(true);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      console.error('Sign in failed:', error);
      return { success: false, error: 'Sign in failed. Please try again.' };
    }
  };

  const signUp = async (email, password, firstName, lastName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        setUser(data.user);
        setIsSignedIn(true);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      console.error('Sign up failed:', error);
      return { success: false, error: 'Sign up failed. Please try again.' };
    }
  };

  const signOut = (navigate = null) => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setIsSignedIn(false);
    
    // If navigate function is provided, redirect to signin
    if (navigate) {
      navigate('/signin');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setIsSignedIn(false);
    window.location.href = '/signin';
  };

  const signInWithOAuth = (provider) => {
    // Redirect to OAuth provider
    const authUrl = `${API_BASE_URL}/api/auth/${provider}`;
    window.location.href = authUrl;
  };

  const value = {
    user,
    isSignedIn,
    isLoading,
    signIn,
    signUp,
    signOut,
    logout,
    signInWithOAuth,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
