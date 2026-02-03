import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [suggestedPassword, setSuggestedPassword] = useState("");
  const [showSuggested, setShowSuggested] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: "" });
    setSuccess("");
  };

  const generatePassword = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*()";
    const all = upper + lower + numbers + special;
    let password = "";
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    for (let i = 4; i < 12; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    return password;
  };

  const handleMouseEnter = () => {
    if (!showGenerate) {
      setShowGenerate(true);
      setSuggestedPassword(generatePassword());
      setShowSuggested(false);
    }
  };

  const useSuggestedPassword = () => {
    setFormData({ ...formData, password: suggestedPassword, confirmPassword: "" });
    setShowGenerate(false);
    setSuggestedPassword("");
    setShowSuggested(false);
  };

  const closeSuggestion = () => {
    setShowGenerate(false);
    setSuggestedPassword("");
    setShowSuggested(false);
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = "Full Name is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    } else if (getPasswordStrength(formData.password) < 5) {
      newErrors.password = "Password is too weak.";
    }
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.terms) newErrors.terms = "You must accept the terms and conditions.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess("Signup successful! Welcome aboard.");
      console.log("Signup Data:", formData);
      
      // Store user data and authenticate
      const userData = {
        name: formData.name,
        email: formData.email,
        role: "User"
      };
      login(userData);
      
      // Redirect to dashboard after success
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setErrors({ general: "Signup failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(formData.password);
  const isFormValid = formData.name && formData.email && formData.password && formData.confirmPassword && formData.terms;

  return (
    <div className="signup-container">
      <div className="brand-header">
        <h1 className="brand-title">MediCose</h1>
        <p className="brand-subtitle">Your Healthcare Companion</p>
      </div>
      <form className="signup-box" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        {success && <div className="success-message">{success}</div>}
        {errors.general && <div className="error-message">{errors.general}</div>}

        <div>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "error-input" : ""}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error-input" : ""}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="password-container">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            onMouseEnter={handleMouseEnter}
            className={errors.password ? "error-input" : ""}
          />
          <span
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
          {showGenerate && suggestedPassword && (
            <div className="password-suggestion" onMouseLeave={closeSuggestion}>
              <div className="suggestion-text">
                <span>{showSuggested ? suggestedPassword : '••••••••'}</span>
                <button
                  type="button"
                  className="suggestion-toggle"
                  onClick={() => setShowSuggested(!showSuggested)}
                >
                  {showSuggested ? '👁️' : '🔒'}
                </button>
              </div>
              <button type="button" className="suggestion-use-btn" onClick={useSuggestedPassword}>Use</button>
            </div>
          )}
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="confirm-password-container">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? "error-input" : ""}
          />
          <span
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </span>
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>

        <div className="checkbox-container">
          <input
            id="terms"
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
          />
          <label htmlFor="terms">
            I accept the <button type="button" className="terms-link" onClick={() => setShowTermsModal(true)}>Terms & Conditions</button>
          </label>
          {errors.terms && <span className="error">{errors.terms}</span>}
        </div>

        <button type="submit" disabled={!isFormValid || loading} className="signup-btn">
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        {success && <p className="success">{success}</p>}

        <p className="login-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="terms-modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="terms-modal" onClick={(e) => e.stopPropagation()}>
            <div className="terms-modal-header">
              <h2>Terms & Conditions</h2>
              <button className="close-btn" onClick={() => setShowTermsModal(false)}>&times;</button>
            </div>
            <div className="terms-modal-body">
              <section>
                <h3>1. Acceptance of Terms</h3>
                <p>
                  By accessing and using the MediCose platform, you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h3>2. Use License</h3>
                <p>
                  Permission is granted to temporarily download one copy of the materials (information or software) on MediCose for personal, 
                  non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul>
                  <li>Modifying or copying the materials</li>
                  <li>Using the materials for any commercial purpose or for any public display</li>
                  <li>Attempting to decompile or reverse engineer any software contained on MediCose</li>
                  <li>Removing any copyright or other proprietary notations from the materials</li>
                  <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
                </ul>
              </section>

              <section>
                <h3>3. Disclaimer</h3>
                <p>
                  The materials on MediCose are provided on an 'as is' basis. MediCose makes no warranties, expressed or implied, 
                  and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions 
                  of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section>
                <h3>4. Limitations</h3>
                <p>
                  In no event shall MediCose or its suppliers be liable for any damages (including, without limitation, damages for loss of data 
                  or profit, or due to business interruption) arising out of the use or inability to use the materials on MediCose, 
                  even if MediCose or an authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </section>

              <section>
                <h3>5. Accuracy of Materials</h3>
                <p>
                  The materials appearing on MediCose could include technical, typographical, or photographic errors. 
                  MediCose does not warrant that any of the materials on the website are accurate, complete, or current. 
                  MediCose may make changes to the materials contained on the website at any time without notice.
                </p>
              </section>

              <section>
                <h3>6. Links</h3>
                <p>
                  MediCose has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. 
                  The inclusion of any link does not imply endorsement by MediCose of the site. Use of any such linked website is at the user's own risk.
                </p>
              </section>

              <section>
                <h3>7. Modifications</h3>
                <p>
                  MediCose may revise these terms of service for the website at any time without notice. 
                  By using the website, you are agreeing to be bound by the then current version of these terms of service.
                </p>
              </section>

              <section>
                <h3>8. Governing Law</h3>
                <p>
                  These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which MediCose operates, 
                  and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                </p>
              </section>

              <section>
                <h3>9. User Responsibilities</h3>
                <p>
                  You agree that you are responsible for maintaining the confidentiality of your account information and password and for all activities 
                  that occur under your account. You agree to notify MediCose immediately of any unauthorized use of your account.
                </p>
              </section>

              <section>
                <h3>10. Medical Disclaimer</h3>
                <p>
                  The information provided on MediCose is for informational purposes only and should not be considered as professional medical advice. 
                  Always consult with a qualified healthcare provider before making any medical decisions. MediCose is not liable for any medical decisions 
                  made based on information provided through the platform.
                </p>
              </section>
            </div>
            <div className="terms-modal-footer">
              <button className="agree-btn" onClick={() => {
                setFormData({ ...formData, terms: true });
                setShowTermsModal(false);
              }}>I Agree</button>
              <button className="cancel-btn" onClick={() => setShowTermsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;