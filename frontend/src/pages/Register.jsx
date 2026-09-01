import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  deleteUser,
} from "firebase/auth";

import { auth } from "../firebase";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Local Spring Boot backend
  const API_BASE_URL = "http://localhost:8081";

  // =========================
  // HANDLE INPUT CHANGES
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // HANDLE REGISTRATION
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all fields!");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    let firebaseUser = null;

    try {
      // =========================
      // 1. CREATE FIREBASE ACCOUNT
      // =========================

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          formData.email.trim(),
          formData.password
        );

      firebaseUser = userCredential.user;

      console.log(
        "Firebase account created:",
        firebaseUser.uid
      );

      // =========================
      // 2. SEND VERIFICATION EMAIL
      // =========================

      await sendEmailVerification(firebaseUser);

      console.log("Verification email sent.");

      // =========================
      // 3. SAVE USER IN SPRING BOOT
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
            name: formData.fullName.trim(),
          }),
        }
      );

      // =========================
      // 4. BACKEND SUCCESS
      // =========================

      if (response.ok) {
        const savedUser = await response.json();

        console.log(
          "User saved in MySQL:",
          savedUser
        );

        // Clear form
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        alert(
          "Account created successfully!\n\n" +
            "A verification email has been sent to your email address.\n\n" +
            "Please verify your email before logging in."
        );

        navigate("/");
      }

      // =========================
      // 5. BACKEND ERROR
      // =========================

      else {
        const errorText = await response.text();

        console.error(
          "Spring Boot user save failed:",
          errorText
        );

        // Delete Firebase account if MySQL save fails
        if (firebaseUser) {
          try {
            await deleteUser(firebaseUser);

            console.log(
              "Firebase account removed because backend save failed."
            );
          } catch (deleteError) {
            console.error(
              "Failed to delete Firebase account:",
              deleteError
            );
          }
        }

        alert(
          errorText ||
            "Unable to save your account. Please try again."
        );
      }
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      // =========================
      // FIREBASE ERRORS
      // =========================

      switch (error.code) {
        case "auth/email-already-in-use":
          alert(
            "This email is already registered. Please login instead."
          );
          break;

        case "auth/invalid-email":
          alert(
            "Please enter a valid email address."
          );
          break;

        case "auth/weak-password":
          alert(
            "Password is too weak. Please use at least 6 characters."
          );
          break;

        case "auth/operation-not-allowed":
          alert(
            "Email/Password authentication is not enabled in Firebase."
          );
          break;

        case "auth/network-request-failed":
          alert(
            "Network error. Please check your internet connection."
          );
          break;

        default:
          alert(
            "Registration failed. Please try again."
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
            Create Your Account
          </p>

        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Join ExpenseAI 🚀
        </h2>

        {/* Registration Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Full Name */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>

          {/* Email */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>

          {/* Password */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-3 text-xl"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>

            </div>

            <p className="text-xs text-gray-400 mt-1">
              Minimum 6 characters
            </p>

          </div>

          {/* Confirm Password */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>

            <div className="relative">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-4 top-3 text-xl"
              >
                {showConfirmPassword
                  ? "🙈"
                  : "👁️"}
              </button>

            </div>

          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition duration-300"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* Login Link */}
        <p className="text-center text-gray-600 mt-6">

          Already have an account?

          <Link
            to="/"
            className="text-blue-600 font-semibold hover:text-blue-700 ml-2"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;