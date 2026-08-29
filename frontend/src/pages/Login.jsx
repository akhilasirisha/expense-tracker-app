import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://expense-tracker-app-production-ea6e.up.railway.app/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {

        const user = await response.json();

        console.log("Login successful:", user);

        // Store logged-in user
        localStorage.setItem("user", JSON.stringify(user));

        // Go to dashboard
        navigate("/dashboard");

      } else {
        alert("Invalid email or password!");
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to server!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        {/* Logo */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-gray-800">
            💰 ExpenseAI
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome Back
          </p>

        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Login to ExpenseAI 🚀
        </h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300"
          >
            Login
          </button>

        </form>

        {/* Register Link */}
        <p className="text-center text-gray-600 mt-6">

          Don't have an account?

          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:text-blue-700 ml-2"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;