import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Your Firebase config file
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [appUser, setAppUser] = useState(null); // State for MongoDB profile
  const [loading, setLoading] = useState(true);

  /**
   * Syncs user to backend. Used for first-time sign-up 
   * (e.g., Google login or after email sign-up with a name).
   */
  const syncUserToBackend = async (firebaseUser, name) => {
    try {
      const token = await firebaseUser.getIdToken();
      const res = await axios.post('http://localhost:5001/api/users/register-sync',
        { name: name || firebaseUser.displayName }, // Pass name from form or Google
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppUser(res.data); // SET the appUser state
      console.log('User synced to backend:', res.data);
    } catch (error) {
      console.error('Error syncing user to backend:', error);
    }
  };

  // --- Firebase Auth Functions ---

  /**
   * Creates a new user in Firebase.
   * The `useEffect` hook will then sync this new user to the backend.
   */
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  /**
   * Logs in an existing user and fetches their MongoDB profile.
   */
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // After login, fetch the MongoDB profile
    try {
      const token = await userCredential.user.getIdToken();
      const res = await axios.post('http://localhost:5001/api/users/register-sync',
        {}, // Send empty body, route will find existing user
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppUser(res.data); // SET profile on login
      return userCredential;
    } catch (error) {
      console.error("Error fetching app user on login", error);
      setAppUser(null);
      return userCredential; // Still return user credential even if profile fetch fails
    }
  };

  /**
   * Logs in a user with Google and syncs their profile.
   */
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    // After Google login, sync to backend (this also sets appUser)
    await syncUserToBackend(userCredential.user);
    return userCredential;
  };

  /**
   * Logs out the user from Firebase and clears local profiles.
   */
  const logout = () => {
    setAppUser(null); // CLEAR profile on logout
    return signOut(auth);
  };

  // Listens for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // User is logged in, fetch/sync their MongoDB profile
        try {
          const token = await user.getIdToken();
          const res = await axios.post('http://localhost:5001/api/users/register-sync',
            {}, // Empty body, just sync/get existing user
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setAppUser(res.data); // SET profile on app load/auth change
        } catch (error) {
          console.error("Error fetching app user profile", error);
          setAppUser(null);
        }
      } else {
        setAppUser(null); // CLEAR profile if user is null (logged out)
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    appUser, // Expose MongoDB profile
    signup,
    login,
    loginWithGoogle,
    logout,
    syncUserToBackend, // Expose for manual calls (e.g., after signup)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}