/**
 * AuthContext.jsx
 * 
 * Provides authentication state and functions (login, register, logout)
 * to the entire application using Firebase Authentication.
 * 
 * @author Fredrik Fordelsen - Full AuthContext with login/register/logout
 * @version 1.2
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Register new user
    const register = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Login user
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Logout user
    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{
            currentUser,
            loading,
            register,
            login,
            logout
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

/**
 * Custom hook to access auth context
 */
export const useAuth = () => useContext(AuthContext);