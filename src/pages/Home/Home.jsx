import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Dumbbell, ArrowRight, Zap, Flame, Trophy, ShieldCheck,
  Utensils, DollarSign, CheckCircle2, Calculator, UserCheck,
  Menu, X, Sun, Moon
} from "lucide-react";
import hero from "../images/hero.png";
import push from "../images/pushups.png";
import bench_press from "../images/bench-press.png";
import shoulder_press from "../images/shoulder-press.png";
import "./Home.css";

const Home = () => {
  const [theme, setTheme] = useState("dark");
  const navigate = useNavigate()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("workout");
  const [userWeight, setUserWeight] = useState(75);
  const [userGoal, setUserGoal] = useState("muscle");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    localStorage.getItem("fitplan_user_data")? navigate("/dashboard") : navigate("/")
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const estimatedCalories = userGoal === "muscle"
    ? Math.round(userWeight * 33 + 400)
    : Math.round(userWeight * 33 - 500);

  return (
    <div className="homepage-container">
      <nav className="navbar">
        <div className="logo">
          <Dumbbell size={30} />
          FITPLAN <span>AI</span>
        </div>

        <div className="nav-controls">
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle Light/Dark Theme"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? <Sun size={20} color="#ffb700" /> : <Moon size={20} color="#7e22ce" />}
          </button>

          {/* Desktop Nav Links */}
          <div className="desktop-links">
            <Link to="/login" className="login-btn">
              LOGIN
            </Link>
            <Link to="/signup" className="get-started-btn">
              ENTER GYM
              <Flame size={16} />
            </Link>
          </div>

          {/* Mobile Menu Icon Toggle */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="mobile-dropdown-menu">
            <Link
              to="/login"
              className="login-btn"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              LOGIN
            </Link>
            <Link
              to="/signup"
              className="get-started-btn"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ENTER GYM <Flame size={16} />
            </Link>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-text">
          <div className="hero-badge">
            <Zap size={15} /> GOJO x NARUTO GYM MODE ACTIVE
          </div>
          <h1>
            NO EXCUSES. <br />
            <span className="cyan-glow">ZERO LIMITS.</span> <br />
            <span className="orange-glow">PURE HYPERTROPHY.</span>
          </h1>
          <p className="hero-description">
            Scientific Mifflin-St Jeor BMR calculations combined with medical-grade budget diet AI and automated gym splits tailored to your specific equipment.
          </p>

          {/* Trust Badges */}
          <div className="trust-badges-row">
            <div className="trust-item">
              <CheckCircle2 size={18} className="cyan-glow" />
              <span>Budget Aware</span>
            </div>
            <div className="trust-item">
              <ShieldCheck size={18} className="orange-glow" />
              <span>Equipment Guard</span>
            </div>
            <div className="trust-item">
              <DollarSign size={18} style={{ color: "var(--gold-accent)" }} />
              <span>Zero Template AI</span>
            </div>
            <div className="trust-item">
              <UserCheck size={18} style={{ color: "var(--purple-accent)" }} />
              <span>Progress Logged</span>
            </div>
          </div>

          <Link to="/signup" className="hero-cta">
            <Flame size={20} />
            BUILD YOUR HYPERTROPHY PLAN
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* HERO IMAGE CONTAINER */}
        <div className="hero-image-wrapper">
          <div className="hero-image-container">
            <img
              src={hero}
              alt="Gym Hero"
              className="hero-image"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO & CALCULATOR SECTION */}
      <section className="demo-section">
        <div className="demo-container">
          <h2 className="section-title">
            TEST THE <span className="cyan-glow">AI ENGINE</span>
          </h2>
          <p className="section-subtitle">
            See how our algorithm calculates exact nutrition and training variables live.
          </p>

          <div className="demo-toggle-buttons">
            <button
              className={`toggle-btn ${activeTab === "workout" ? "active" : ""}`}
              onClick={() => setActiveTab("workout")}
            >
              <Dumbbell size={18} /> Workout Split AI
            </button>
            <button
              className={`toggle-btn ${activeTab === "meal" ? "active" : ""}`}
              onClick={() => setActiveTab("meal")}
            >
              <Utensils size={18} /> Budget Meal AI
            </button>
            <button
              className={`toggle-btn ${activeTab === "bmr" ? "active" : ""}`}
              onClick={() => setActiveTab("bmr")}
            >
              <Calculator size={18} /> BMR / TDEE Calculator
            </button>
          </div>

          {activeTab === "workout" && (
            <div className="demo-card">
              <div className="demo-grid">
                <div className="demo-item-box">
                  <div className="demo-item-title">Push Day A (Chest/Shoulders/Triceps)</div>
                  <div className="demo-item-detail">Incline Dumbbell Press: 4 Sets x 8-10 Reps</div>
                </div>
                <div className="demo-item-box">
                  <div className="demo-item-title">Pull Day A (Back/Rear Delts/Biceps)</div>
                  <div className="demo-item-detail">Lat Pulldowns: 4 Sets x 10-12 Reps</div>
                </div>
                <div className="demo-item-box">
                  <div className="demo-item-title">Leg Day A (Quads/Hamstrings/Calves)</div>
                  <div className="demo-item-detail">Barbell Squats: 4 Sets x 6-8 Reps</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "meal" && (
            <div className="demo-card">
              <div className="demo-grid">
                <div className="demo-item-box" style={{ borderLeftColor: "var(--cyan-accent)" }}>
                  <div className="demo-item-title">Breakfast (High Protein)</div>
                  <div className="demo-item-detail">4 Egg Whites + Oats + Peanut Butter (45g Protein)</div>
                </div>
                <div className="demo-item-box" style={{ borderLeftColor: "var(--cyan-accent)" }}>
                  <div className="demo-item-title">Post-Workout Meal</div>
                  <div className="demo-item-detail">200g Chicken Breast + White Rice + Veggies</div>
                </div>
                <div className="demo-item-box" style={{ borderLeftColor: "var(--cyan-accent)" }}>
                  <div className="demo-item-title">Budget Grocery Optimisation</div>
                  <div className="demo-item-detail">Auto-calculated weekly budget target matched exactly</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "bmr" && (
            <div className="demo-card">
              <div className="bmr-widget">
                <div className="bmr-input-group">
                  <label>Current Weight (kg)</label>
                  <input
                    type="number"
                    value={userWeight}
                    onChange={(e) => setUserWeight(Number(e.target.value))}
                  />
                </div>
                <div className="bmr-input-group">
                  <label>Primary Goal</label>
                  <select value={userGoal} onChange={(e) => setUserGoal(e.target.value)}>
                    <option value="muscle">Muscle Gain (Hypertrophy)</option>
                    <option value="fatloss">Fat Loss (Cut)</option>
                  </select>
                </div>
                <div className="bmr-result-box">
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Target Daily Calories</span>
                  <span className="bmr-val">{estimatedCalories} kcal</span>
                </div>
                <div className="bmr-result-box" style={{ borderColor: "var(--purple-accent)" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Target Daily Protein</span>
                  <span className="bmr-val" style={{ color: "var(--purple-accent)" }}>{userWeight * 2}g</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="gallery-section">
        <div className="gallery-container">
          <h2 className="section-title">
            THE <span className="orange-glow">HALL OF GAINS</span>
          </h2>
          <p className="section-subtitle">
            Engineered routines for maximum pump, progressive overload, and elite conditioning.
          </p>

          <div className="gallery-grid">
            {[
              {
                id: 1,
                tag: "HEAVY COMPOUND SPLITS",
                imgSrc: push // Import ki hui local image variable pass ki hai
              },
              {
                id: 2,
                tag: "PRECISION MACRO DIETS",
                imgSrc: bench_press // Public folder se path ya Online URL
              },
              {
                id: 3,
                tag: "HYPERTROPHY TARGETING",
                imgSrc: shoulder_press
              }
            ].map((item) => (
              <div key={item.id} className="gallery-card">
                {/* Main Card Image */}
                <img
                  src={item.imgSrc}
                  alt={item.tag}
                  className="hero-image"
                  onError={(e) => {
                    // Image na load hone par hide hogi taaki placeholder dikhe
                    e.target.style.display = "none";
                  }}
                />


                {/* Overlay Tag */}
                <div className="card-overlay-tag">
                  <Trophy size={18} style={{ color: "var(--gold-accent)" }} />
                  <span>{item.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} FITPLAN AI — TRAIN LIKE A HOKAGE. THINK LIKE GOJO.</p>
      </footer>
    </div>
  );
};

export default Home;