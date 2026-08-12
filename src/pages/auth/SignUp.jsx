import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Dumbbell, Mail, Lock, User, Target, ArrowLeft, Sun, Moon, Flame, Loader2
} from "lucide-react";
import { supabase } from "../../services/supabaseClient";
import "./Signup.css";

const Signup = () => {
    const navigate = useNavigate();

    // Theme State (Default Dark)
    const [theme, setTheme] = useState("dark");

    // Form Input States
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        primaryGoal: "muscle",
        acceptTerms: false,
    });

    // Auth & Error States
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Sync Theme attribute
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);

        localStorage.getItem("fitplan_user_data") ? navigate("/dashboard") : navigate("/signup")

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

    // Real Supabase Signup Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (!formData.acceptTerms) {
            setErrorMsg("Please accept the Terms & Conditions to proceed.");
            return;
        }

        setLoading(true);

        try {
            // Step 1: Create user in Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        primary_goal: formData.primaryGoal,
                    },
                },
            });

            if (error) {
                setErrorMsg(error.message);
                setLoading(false);
                return;
            }

            // Step 2: Clear local cache if any old session exists
            localStorage.removeItem("fitplan_user_data");

            // Step 3: Redirect to Onboarding Wizard
            navigate("/onboarding");
        } catch (err) {
            console.error("Signup Error:", err);
            setErrorMsg("Something went wrong during account creation. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            {/* Top Header */}
            <header className="signup-header">
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

            {/* Main Signup Card */}
            <main className="signup-content">
                <div className="signup-card-wrapper">
                    <div className="signup-card">
                        <div className="signup-title-box">
                            <div className="logo" style={{ justifyContent: "center", marginBottom: "0.5rem" }}>
                                <Dumbbell size={32} />
                                FITPLAN <span className="orange-glow">AI</span>
                            </div>
                            <h2>JOIN THE ARENA</h2>
                            <p>Start your AI-powered hypertrophy journey today</p>
                        </div>

                        {/* Error Display */}
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

                        <form className="signup-form" onSubmit={handleSubmit}>
                            {/* Full Name */}
                            <div className="input-group">
                                <label htmlFor="fullName">Full Name</label>
                                <div className="input-wrapper">
                                    <User size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        placeholder="Satoru Gojo"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Address */}
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

                            {/* Password & Primary Goal Grid */}
                            <div className="form-row-grid">
                                {/* Password */}
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

                                {/* Primary Goal */}
                                <div className="input-group">
                                    <label htmlFor="primaryGoal">Primary Goal</label>
                                    <div className="input-wrapper">
                                        <Target size={18} className="input-icon" />
                                        <select
                                            id="primaryGoal"
                                            name="primaryGoal"
                                            value={formData.primaryGoal}
                                            onChange={handleChange}
                                        >
                                            <option value="muscle">Muscle Gain (Hypertrophy)</option>
                                            <option value="fatloss">Fat Loss (Cut)</option>
                                            <option value="maintenance">Body Recomp / Maintain</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Terms Checkbox */}
                            <label className="terms-checkbox">
                                <input
                                    type="checkbox"
                                    name="acceptTerms"
                                    checked={formData.acceptTerms}
                                    onChange={handleChange}
                                    required
                                />
                                <span>
                                    I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
                                </span>
                            </label>

                            {/* Submit Button */}
                            <button type="submit" className="signup-submit-btn" disabled={loading}>
                                {loading ? (
                                    <>
                                        CREATING ACCOUNT... <Loader2 size={18} className="spin-icon" />
                                    </>
                                ) : (
                                    <>
                                        START HYPERTROPHY <Flame size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="signup-footer-text">
                            Already have an account?{" "}
                            <Link to="/login" className="login-link">
                                LOG IN HERE
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="footer" style={{ border: "none", background: "transparent" }}>
                <p>© {new Date().getFullYear()} FITPLAN AI — ALL RIGHTS RESERVED</p>
            </footer>
        </div>
    );
};

export default Signup;