import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../config/firebase';
import { Spinner } from 'react-bootstrap';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if there's a Firebase user
        const user = auth.currentUser;

        if (user) {
          // Get a fresh token
          await user.getIdToken(true);
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthenticated(false);
      } finally {
        setChecking(false);
      }
    };

    if (!loading) {
      checkAuth();
    }
  }, [loading]);

  if (loading || checking) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
        <p className="ms-3 mb-0">Checking authentication...</p>
      </div>
    );
  }

  return (isAuthenticated() || authenticated) ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
