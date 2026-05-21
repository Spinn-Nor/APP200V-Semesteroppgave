/**
 * AuthContext.jsx
 *
 * Provides authentication state and functions (login, register, logout)
 * to the entire application using Firebase Authentication.
 *
 * @author Fredrik Fordelsen & Bendik Viken Wangen - Full AuthContext with login/register/logout
 * @version 1.3
 */

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/config";

import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { ref, get, set } from "firebase/database";
import { db } from "../firebase/config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val() || {};

        setCurrentUser({
          ...user,
          role: userData.role || "customer",
          displayName: userData.displayName || user.displayName,
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Registrer new user - automatic "customer"
  const register = async (email, password, firstName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: firstName });

      await set(ref(db, `users/${user.uid}`), {
        uid: user.uid,
        email: user.email,
        displayName: firstName,
        role: "customer",
        createdAt: new Date().toISOString(),
      });

      return user;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        register,
        login,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
