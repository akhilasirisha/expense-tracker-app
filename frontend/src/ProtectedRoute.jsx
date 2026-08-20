import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.id) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;