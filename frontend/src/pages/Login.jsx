import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Backend API URL
  // Local -> http://localhost:8081
  // Production -> Railway backend URL through VITE_API_BASE_URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // =========================
  // LOGIN
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      alert("Please enter your email and password!");
      return;
    }

    setLoading(true);

    try {
      // =========================
      // 1. FIREBASE LOGIN
      // =========================

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

      const firebaseUser = userCredential.user;

      console.log(
        "Firebase login successful:",
        firebaseUser.uid
      );

      // =========================
      // 2. CHECK EMAIL VERIFICATION
      // =========================

      if (!firebaseUser.emailVerified) {
        alert(
          "Your email address is not verified yet.\n\n" +
            "Please check your email and click the verification link."
        );

        await signOut(auth);
        return;
      }

      // =========================
      // 3. CHECK API URL
      // =========================

      if (!API_BASE_URL) {
        console.error(
          "VITE_API_BASE_URL is not configured."
        );

        await signOut(auth);

        alert(
          "Application configuration error. Please try again later."
        );

        return;
      }

      // =========================
      // 4. SYNC USER WITH MYSQL
      // =========================

      const response = await fetch(
        `${API_BASE_URL}/users`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            name:
              firebaseUser.displayName ||
              firebaseUser.email.split("@")[0],
          }),
        }
      );

      // =========================
      // 5. BACKEND SUCCESS
      // =========================

      if (response.ok) {
        const user = await response.json();

        console.log(
          "Backend user sync successful:",
          user
        );

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        navigate("/dashboard");

        return;
      }

      // =========================
      // 6. BACKEND ERROR
      // =========================

      const errorText = await response.text();

      console.error(
        "Backend user sync failed:",
        errorText
      );

      await signOut(auth);

      alert(
        errorText ||
          "Unable to connect your account with the application."
      );
    } catch (error) {
      console.error("Login error:", error);

      switch (error.code) {
        case "auth/invalid-email":
          alert(
            "Please enter a valid email address."
          );
          break;

        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          alert(
            "Invalid email or password!"
          );
          break;

        case "auth/user-disabled":
          alert(
            "This account has been disabled."
          );
          break;

        case "auth/too-many-requests":
          alert(
            "Too many unsuccessful attempts. Please try again later."
          );
          break;

        case "auth/network-request-failed":
          alert(
            "Network error. Please check your internet connection."
          );
          break;

        default:
          alert(
            "Unable to login. Please try again."
          );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FORGOT PASSWORD
  // =========================

  const handleForgotPassword = async () => {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      alert(
        "Please enter your email address first."
      );
      return;
    }

    setResetLoading(true);

    try {
      await sendPasswordResetEmail(
        auth,
        cleanEmail
      );

      alert(
        "Password reset email sent!\n\n" +
          "Please check your Inbox, Spam, or Promotions folder."
      );
    } catch (error) {
      console.error(
        "Password reset error:",
        error
      );

      switch (error.code) {
        case "auth/invalid-email":
          alert(
            "Please enter a valid email address."
          );
          break;

        case "auth/user-not-found":
          alert(
            "No account exists with this email address."
          );
          break;

        case "auth/network-request-failed":
          alert(
            "Network error. Please check your internet connection."
          );
          break;

        default:
          alert(
            "Unable to send password reset email."
          );
      }
    } finally {
      setResetLoading(false);
    }
  };

  // =========================
  // RESEND VERIFICATION EMAIL
  // =========================

  const handleResendVerification = async () => {
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      alert(
        "Enter your email and password first."
      );
      return;
    }

    setLoading(true);

    try {
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

      const firebaseUser =
        userCredential.user;

      if (firebaseUser.emailVerified) {
        alert(
          "Your email is already verified. Please login."
        );

        await signOut(auth);
        return;
      }

      await sendEmailVerification(
        firebaseUser
      );

      await signOut(auth);

      alert(
        "A new verification email has been sent to your email address."
      );
    } catch (error) {
      console.error(
        "Verification email error:",
        error
      );

      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          alert(
            "Invalid email or password!"
          );
          break;

        case "auth/network-request-failed":
          alert(
            "Network error. Please check your internet connection."
          );
          break;

        default:
          alert(
            "Unable to resend verification email."
          );
      }
    } finally {
      setLoading(false);
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

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Login to ExpenseAI 🚀
        </h2>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Email */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>

          {/* Password */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>

          {/* Forgot Password */}
          <div className="text-right">

            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetLoading}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400"
            >
              {resetLoading
                ? "Sending..."
                : "Forgot Password?"}
            </button>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition duration-300"
          >
            {loading
              ? "Signing In..."
              : "Login"}
          </button>

        </form>

        {/* Resend Verification */}
        <div className="text-center mt-4">

          <button
            type="button"
            onClick={handleResendVerification}
            disabled={loading}
            className="text-sm text-gray-500 hover:text-blue-600"
          >
            Resend verification email
          </button>

        </div>

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