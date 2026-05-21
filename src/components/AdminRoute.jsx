/**
 * AdminRoute.jsx
 *
 * Protected route that only allows users with role "admin" to access the page.
 *
 * @author Fredrik Fordelsen
 * @version 1.0
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { currentUser } = useAuth();

  // Not logged in → redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Not admin → redirect to home
  if (currentUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // User is admin → allow access
  return children;
}

export default AdminRoute;
