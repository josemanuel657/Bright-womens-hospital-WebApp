import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useMemo } from "react";

// @ts-expect-error roles and children are fine
const ProtectedRoute = ({ roles, children }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  // Memoize the calculation of userRoles
  const userRoles = useMemo(() => {
    return user ? user["http://localhost:3000/roles"] : [];
  }, [user]);

  const isAllowed =
    isAuthenticated &&
    userRoles &&
    userRoles.some((role: string) => roles.includes(role));

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isAllowed) {
      navigate(-1);
      alert("You are not permitted to access this page");
    }
  }, [isLoading, isAuthenticated, navigate, isAllowed]);

  // If the user object is still loading, render a loading message
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If the user object is loaded, render the children if the user is allowed
  return isAllowed ? children : null;
};

export default ProtectedRoute;
