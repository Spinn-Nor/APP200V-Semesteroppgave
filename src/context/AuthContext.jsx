/**
 * AuthContext.jsx
 * 
 * Provides authentication state (currentUser) to the entire application.
 * Uses Firebase Authentication to track who is logged in.
 * 
 * @author Fredrik Fordelsen - Created AuthContext to support CartContext and future protected routes
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/config';           // Din Firebase auth config
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        // Cleanup subscription when component unmounts
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

/**
 * Custom hook to easily access the current logged-in user from anywhere.
 */
export const useAuth = () => useContext(AuthContext);