import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Register with email and password
  const register = async (name, email, password) => {
    try {
      setLoading(true);

      // Call backend to register user - we're now handling Firebase auth on the backend
      const response = await authAPI.register({ name, email, password });

      // Get the custom token from the response
      const customToken = response.data.token;

      // Sign in with the custom token
      await signInWithCustomToken(auth, customToken);

      // Save token to localStorage
      localStorage.setItem('token', customToken);
      setToken(customToken);

      setCurrentUser(response.data.user);
      toast.success('Account created successfully!');
      return response.data.user;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      setLoading(true);

      // Call backend to login user
      const response = await authAPI.login({ email, password });

      // Get the custom token from the response
      const customToken = response.data.token;

      // Sign in with the custom token
      await signInWithCustomToken(auth, customToken);

      // Save token to localStorage
      localStorage.setItem('token', customToken);
      setToken(customToken);

      setCurrentUser(response.data.user);
      toast.success('Logged in successfully!');
      return response.data.user;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      setLoading(true);

      // Configure Google provider
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');

      // Sign in with popup
      const result = await signInWithPopup(auth, provider);
      console.log('Google sign in successful');

      // Get Firebase ID token from the user
      const idToken = await result.user.getIdToken(true);
      console.log('Got ID token from Firebase');

      // IMPORTANT: Use the Firebase ID token directly for all API calls
      // This ensures we're using a token that the backend can verify
      localStorage.setItem('token', idToken);
      setToken(idToken);

      // Create a user object from the Firebase user
      const user = result.user;
      const userObj = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'Google User',
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      };

      setCurrentUser(userObj);

      try {
        // Call backend to register the Google login (but we already have the token)
        await authAPI.googleAuth(idToken);
        toast.success('Logged in with Google successfully!');
      } catch (backendError) {
        console.error('Backend Google auth error:', backendError);
        // We can still continue since we have the Firebase token
        toast.success('Logged in with Google (some features may be limited)');
      }

      return userObj;
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to login with Google');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      await authAPI.logout();

      // Remove token from localStorage
      localStorage.removeItem('token');
      setToken(null);

      setCurrentUser(null);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to logout');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      await authAPI.forgotPassword(email);
      toast.success('Password reset email sent!');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send password reset email');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser && !!token;
  };

  // Effect to listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get fresh token
          const idToken = await user.getIdToken(true);
          console.log('Auth state changed, got fresh token');

          // Always use the Firebase ID token directly
          localStorage.setItem('token', idToken);
          setToken(idToken);

          // Create a user object from the Firebase user
          const userObj = {
            uid: user.uid,
            email: user.email,
            name: user.displayName || 'User',
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
          };

          setCurrentUser(userObj);

          try {
            // Try to get user data from backend, but don't fail if it doesn't work
            const response = await authAPI.getCurrentUser();
            if (response.data && response.data.user) {
              setCurrentUser(response.data.user);
            }
          } catch (backendError) {
            console.error('Error getting user from backend:', backendError);
            // We can continue with the Firebase user object
          }
        } catch (error) {
          console.error('Error getting ID token:', error);
          setCurrentUser(null);
          localStorage.removeItem('token');
          setToken(null);
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem('token');
        setToken(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    token,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
