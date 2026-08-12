import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Dumbbell, Mail, Lock, ArrowLeft, Sun, Moon, Flame, Loader2 
} from "lucide-react";
import { supabase } from "../../services/supabaseClient";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  // 1. Theme State (Default Dark)
  const [theme, setTheme] = useState("dark");

  // 2. Form Input States
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // 3. Auth States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Sync Theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    localStorage.getItem("fitplan_user_data")? navigate("/dashboard") : navigate("/login")

  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Real Supabase Login Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // Step 1: Real Supabase Sign-in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      const user = data.user;

      // Step 2: Check if profile exists in Supabase DB 
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_data")
        .eq("id", user.id)
        .single();

      if (profile?.user_data) {
        localStorage.setItem("fitplan_user_data", JSON.stringify(profile.user_data));
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    } catch (err) {
      console.error("Login Exception:", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <header className="login-header">
        <Link to="/" className="back-home-link">
          <ArrowLeft size={18} /> Back to Home
        </Link>

        <button 
          className="theme-toggle-btn" 
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={20} color="#ffb700" /> : <Moon size={20} color="#7e22ce" />}
        </button>
      </header>

      <main className="login-content">
        <div className="login-card-wrapper">
          <div className="login-card">
            <div className="login-title-box">
              <div className="logo" style={{ justifyContent: "center", marginBottom: "0.5rem" }}>
                <Dumbbell size={32} />
                FITPLAN <span className="orange-glow">AI</span>
              </div>
              <h2>WELCOME BACK</h2>
              <p>Enter your credentials to access your hypertrophy plan</p>
            </div>

            {/* Error Message Display */}
            {errorMsg && (
              <div style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid #ef4444",
                color: "#ef4444",
                padding: "0.75rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                marginBottom: "1rem",
                textAlign: "center"
              }}>
                {errorMsg}
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="gymbro@fitplan.ai"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Form Extra Options */}
              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    LOGGING IN... <Loader2 size={18} className="spin-icon" />
                  </>
                ) : (
                  <>
                    LOG IN <Flame size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="login-footer-text">
              Don't have an account?{" "}
              <Link to="/signup" className="signup-link">
                ENTER GYM NOW
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="footer" style={{ border: "none", background: "transparent" }}>
        <p>© {new Date().getFullYear()} FITPLAN AI — ALL RIGHTS RESERVED</p>
      </footer>
    </div>
  );
};

export default Login;