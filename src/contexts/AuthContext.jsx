import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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
      console.log('Attempting to login with email:', email);

      try {
        // Call backend to login user
        console.log('Calling backend login API...');
        const response = await authAPI.login({ email, password });
        console.log('Login API response:', response.data);

        // Get the custom token from the response
        const customToken = response.data.token;
        if (!customToken) {
          console.error('No token received from backend');
          throw new Error('No authentication token received from server');
        }

        console.log('Received token from backend, signing in with Firebase...');
        // Sign in with the custom token
        await signInWithCustomToken(auth, customToken);
        console.log('Firebase sign in successful');

        // Save token to localStorage
        localStorage.setItem('token', customToken);
        setToken(customToken);

        // Set current user
        const userData = response.data.user;
        console.log('Setting current user:', userData);
        setCurrentUser(userData);

        toast.success('Logged in successfully!');
        return userData;
      } catch (backendError) {
        console.error('Backend login failed, trying direct Firebase login:', backendError);

        // Try direct Firebase authentication as fallback
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get ID token from Firebase
        const idToken = await user.getIdToken(true);
        console.log('Got ID token directly from Firebase');

        // Save token to localStorage
        localStorage.setItem('token', idToken);
        setToken(idToken);

        // Create user object
        const userData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || email.split('@')[0],
          emailVerified: user.emailVerified
        };

        setCurrentUser(userData);
        toast.success('Logged in successfully (direct Firebase)');
        return userData;
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error details:', error.response?.data);
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

      // First, check if we're returning from a redirect
      try {
        // Get redirect result (if any)
        const result = await getRedirectResult(auth);

        if (result && result.user) {
          console.log('Returned from Google redirect, processing login');

          // Get Firebase ID token from the user
          const idToken = await result.user.getIdToken(true);
          console.log('Got ID token from Firebase after redirect');

          // Use the Firebase ID token directly
          localStorage.setItem('token', idToken);
          setToken(idToken);

          // Create a user object
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
            // Call backend to register the Google login
            await authAPI.googleAuth(idToken);
            toast.success('Logged in with Google successfully!');
          } catch (backendError) {
            console.error('Backend Google auth error:', backendError);
            toast.success('Logged in with Google (some features may be limited)');
          }

          return userObj;
        }
      } catch (redirectError) {
        console.error('Error processing redirect result:', redirectError);
      }

      // If we're not returning from a redirect, start a new sign-in flow
      console.log('Starting new Google sign-in flow');

      // Configure Google provider
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');

      try {
        // Try popup first (works on most browsers)
        console.log('Attempting popup sign-in');
        const result = await signInWithPopup(auth, provider);
        console.log('Google popup sign-in successful');

        // Get Firebase ID token
        const idToken = await result.user.getIdToken(true);
        console.log('Got ID token from Firebase');

        // Use the Firebase ID token directly
        localStorage.setItem('token', idToken);
        setToken(idToken);

        // Create a user object
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
          // Call backend to register the Google login
          await authAPI.googleAuth(idToken);
          toast.success('Logged in with Google successfully!');
        } catch (backendError) {
          console.error('Backend Google auth error:', backendError);
          toast.success('Logged in with Google (some features may be limited)');
        }

        return userObj;
      } catch (popupError) {
        // If popup fails (e.g., due to unauthorized domain), try redirect
        console.error('Popup sign-in failed, trying redirect:', popupError);

        if (popupError.code === 'auth/unauthorized-domain') {
          toast.error('This domain is not authorized for authentication. Please add it to your Firebase project.');
          toast.info('Trying redirect authentication instead...');

          // Use redirect method instead
          await signInWithRedirect(auth, provider);
          // The page will reload and we'll handle the result above
          return null;
        }

        // If it's not an unauthorized domain error, rethrow
        throw popupError;
      }
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

  // Effect to listen for auth state changes and handle redirect results
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        // Check if we're returning from a redirect
        const result = await getRedirectResult(auth);

        if (result && result.user) {
          console.log('Detected redirect result on page load');

          // Get Firebase ID token
          const idToken = await result.user.getIdToken(true);

          // Use the Firebase ID token directly
          localStorage.setItem('token', idToken);
          setToken(idToken);

          // Create a user object
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
            // Call backend to register the Google login
            await authAPI.googleAuth(idToken);
            toast.success('Logged in with Google successfully!');
          } catch (backendError) {
            console.error('Backend Google auth error on redirect:', backendError);
            toast.success('Logged in with Google (some features may be limited)');
          }
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
      }
    };

    // Handle redirect result first
    handleRedirectResult();

    // Then set up the auth state listener
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
