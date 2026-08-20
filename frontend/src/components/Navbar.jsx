import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {

    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    // Remove logged-in user
    localStorage.removeItem("user");

    // Go to Login page
    navigate("/");
  };

  return (

    <nav
      style={{
        padding: "15px 30px",
        background: "#2c3e50",
        display: "flex",
        alignItems: "center",
        gap: "25px",
      }}
    >

      {/* Logo */}

      <Link
        to="/dashboard"
        style={{
          color: "white",
          textDecoration: "none",
          fontSize: "22px",
          fontWeight: "bold",
          marginRight: "20px",
        }}
      >
        💰 ExpenseAI
      </Link>


      {/* Dashboard */}

      <Link
        to="/dashboard"
        style={{
          color: "white",
          textDecoration: "none",
          fontWeight: "500",
        }}
      >
        Dashboard
      </Link>


      {/* Expenses */}

      <Link
        to="/expenses"
        style={{
          color: "white",
          textDecoration: "none",
          fontWeight: "500",
        }}
      >
        Expenses
      </Link>


      {/* Logged-in User */}

      {user && (
        <span
          style={{
            color: "#ecf0f1",
            marginLeft: "auto",
            fontSize: "14px",
          }}
        >
          Hi, {user.name} 👋
        </span>
      )}


      {/* Logout */}

      <button
        onClick={handleLogout}
        style={{
          background: "#e74c3c",
          color: "white",
          border: "none",
          padding: "9px 18px",
          borderRadius: "7px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Logout
      </button>

    </nav>
  );
}

export default Navbar;