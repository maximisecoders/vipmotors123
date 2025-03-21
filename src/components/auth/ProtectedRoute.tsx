import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false);
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminToken');
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const isAdmin = localStorage.getItem('adminAuthenticated') === 'true';
      setIsAuthenticated(!!session && isAdmin);
      
      if (!session) {
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminToken');
      }
    } catch (error) {
      setIsAuthenticated(false);
      localStorage.removeItem('adminAuthenticated');
      localStorage.removeItem('adminToken');
    }
  };

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
