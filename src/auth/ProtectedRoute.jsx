import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, requiredRole, requiredPermission }) => {

  const { auth, hasPermission, loading } = useAuth();

// wait until auth check completes
if (loading) {
  return <div>Loading...</div>;
}

// if no token -> redirect
if (!auth?.token) {
  return <Navigate to="/login" replace />;
}
  // const { auth, hasPermission } = useAuth();

  // if (!auth.token) {
  //   return <Navigate to="/login" replace />;
  // }

  if (requiredRole && auth.user?.role?.name !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (
    requiredPermission &&
    (!auth.user || !hasPermission(...requiredPermission))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
