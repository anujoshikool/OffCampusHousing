import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/Authapi"; // API call

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams(); // Extract token from URL
  const navigate = useNavigate();
  const hasRun = useRef(false); // Prevent duplicate execution

  const token = searchParams.get("token"); // Extract token from query params

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true; // Prevent multiple runs
      if (!token) {
        setMessage("Invalid or missing token.");
      }
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword({ token, newPassword: password });
      setMessage(response.message || "Password has been successfully reset.");
    } catch (err) {
      setMessage(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  // Redirect to login after 3 seconds, but only for success messages
  useEffect(() => {
    if (!loading && message) {
      const timer = setTimeout(() => {
        if (message === "Password has been successfully reset.") {
          // Redirect to login page on success
          navigate("/", { state: { showLogin: true } });
        }
      }, 3000); // Redirect after 3 seconds

      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [loading, message, navigate]); // Run when loading or message changes

  return (
    <div className="flex justify-center items-center min-h-screen">
      {message ? (
        <div
          className={`p-6 shadow-md rounded-lg w-full max-w-md text-center transition-all transform ${
            loading ? "translate-y-16 opacity-0" : "translate-y-0 opacity-100"
          }`}
          style={{
            backgroundColor: message === "Passwords do not match!" ? "red" : "green",
          }}
        >
          <h1 className="text-xl font-semibold text-white">Reset Password</h1>
          <p className="mt-4 text-white">{message || "No message available."}</p>
          {message === "Password has been successfully reset." && (
            <p className="mt-2 text-white text-sm">Redirecting to login page in 3 seconds...</p>
          )}
        </div>
      ) : (
        <div className="w-full max-w-md p-6 shadow-md rounded-lg bg-white">
          <h2 className="text-xl font-semibold text-center">Reset Password</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <input
              type="password"
              placeholder="New Password"
              className="p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="p-2 border rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
