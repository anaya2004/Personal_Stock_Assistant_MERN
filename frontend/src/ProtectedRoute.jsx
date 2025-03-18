import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("googleAuthToken");
  const location = useLocation();

  if (!isAuthenticated) {
    console.log("Redirecting to /free/login"); // 🔹 Debug log
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;