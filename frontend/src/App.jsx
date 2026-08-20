import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import ProtectedRoute from "./ProtectedRoute";

function App() {

  const location = useLocation();

  const showNavbar =
    location.pathname === "/dashboard" ||
    location.pathname === "/expenses";

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Register */}
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Expenses */}
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}

export default App;