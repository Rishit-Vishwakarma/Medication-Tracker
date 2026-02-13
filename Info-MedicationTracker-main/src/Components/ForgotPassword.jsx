import { useState } from "react";
import api from "../api";
import "./Login.css"; // Reuse login styles for consistency

export default function ForgotPassword({ backToLogin }) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/password-reset/request-otp", { email });
      setStep(2);
      setMessage("OTP sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/password-reset/verify-otp", { email, otp });
      setStep(3);
      setMessage("OTP verified. Enter your new password.");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/password-reset/reset", { email, otp, newPassword });
      setMessage("✅ Password reset successful! Redirecting to login...");
      setTimeout(() => backToLogin(), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-brand-side">
          <div className="brand-logo">🏥</div>
          <h1 className="brand-title">Reset Password</h1>
          <p className="brand-subtitle">Securely recover your account access.</p>
        </div>

        <div className="login-form-side">
          <div className="form-header">
            <h2>{step === 1 ? "Forgot Password?" : step === 2 ? "Verify OTP" : "New Password"}</h2>
            <p>
              {step === 1 ? "Enter your email to receive a reset code." : 
               step === 2 ? `We've sent a code to ${email}` : 
               "Create a strong new password."}
            </p>
          </div>

          {error && <div className="error-msg"><span>⚠️</span> {error}</div>}
          {message && <div className="success-msg" style={{color: 'green', marginBottom: '1rem'}}><span>✅</span> {message}</div>}

          {step === 1 && (
            <form onSubmit={handleRequestOtp}>
              <div className="input-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@example.com" />
                </div>
              </div>
              <button type="submit" className="login-btn" disabled={loading}>{loading ? "Sending..." : "Send OTP"}</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <div className="input-group">
                <label>Enter 6-Digit OTP</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔢</span>
                  <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="000000" maxLength="6" />
                </div>
              </div>
              <button type="submit" className="login-btn" disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <div className="input-group">
                <label>New Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="Min 8 characters" />
                </div>
              </div>
              <button type="submit" className="login-btn" disabled={loading}>{loading ? "Resetting..." : "Update Password"}</button>
            </form>
          )}

          <p className="switch-text">
            Remembered? <span onClick={backToLogin}>Back to Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}
