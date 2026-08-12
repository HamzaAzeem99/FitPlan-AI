import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dumbbell, Flame, Utensils, Zap, ShoppingCart, 
  Timer, RefreshCw, CheckCircle2, Sparkles, LogOut, AlertCircle 
} from "lucide-react";
import { supabase } from "../../services/supabaseClient";
import { calculateBMRandTDEE, fetchGroqAiPlan } from "../../services/groqService";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [aiPlan, setAiPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // UI Tabs & Day State
  const [activeTab, setActiveTab] = useState("workout");
  const [activeDay, setActiveDay] = useState("Day 1");

  // Rest-Timer Client State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      // 1. Supabase Auth Check
      const { data: { user } } = await supabase.auth.getUser();
      
      const savedData = localStorage.getItem("fitplan_user_data");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setUserData(parsed);
        loadPlan(parsed);
      } else if (user) {
        // Fetch profile from Supabase
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_data")
          .eq("id", user.id)
          .single();

        if (profile?.user_data) {
          setUserData(profile.user_data);
          loadPlan(profile.user_data);
        } else {
          navigate("/onboarding");
        }
      } else {
        navigate("/login");
      }
    };

    initApp();
  }, []);

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startRestTimer = (seconds) => {
    setTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("fitplan_user_data");
    navigate("/login");
  };

  const loadPlan = async (user) => {
    setLoading(true);
    const response = await fetchGroqAiPlan(user);
    if (response) {
      setAiPlan(response);
    }
    setLoading(false);
  };

  const metrics = userData ? calculateBMRandTDEE(userData) : { targetCalories: 2500, targetProtein: 150 };
  const dailyBudget = userData ? Math.round(Number(userData.weeklyBudget || 3500) / 7) : 500;
  const availableDays = aiPlan?.days ? Object.keys(aiPlan.days) : ["Day 1"];

  return (
    <div className="dashboard-container">
      {/* NAVBAR */}
      <nav className="dashboard-nav">
        <div className="logo"><Dumbbell size={28} className="cyan-glow" /> FITPLAN HQ</div>
        <button className="login-btn" onClick={handleLogout}><LogOut size={16} /> LOGOUT</button>
      </nav>

      <main className="dashboard-main">
        {/* STATS OVERVIEW */}
        <div className="stats-grid">
          <div className="stat-card">
            <Flame color="var(--orange-accent)" size={26} />
            <div>
              <h4>Target Calories</h4>
              <p>{metrics.targetCalories} <span>kcal</span></p>
            </div>
          </div>

          <div className="stat-card">
            <Zap color="var(--cyan-accent)" size={26} />
            <div>
              <h4>Daily Protein</h4>
              <p>{metrics.targetProtein}g <span>/ day</span></p>
            </div>
          </div>

          <div className="stat-card">
            <span className="pkr-badge">PKR</span>
            <div>
              <h4>Daily Budget Limit</h4>
              <p className="pkr-value">Rs {dailyBudget} <span>/ day</span></p>
            </div>
          </div>
        </div>

        {/* ADMIN BUDGET WARNING FALLBACK TEXT */}
        {aiPlan?.budgetNote && (
          <div className="budget-alert-box">
            <AlertCircle size={20} color="#f59e0b" />
            <span>{aiPlan.budgetNote}</span>
          </div>
        )}

        {/* CONTROLS BAR */}
        <div className="dashboard-controls-bar">
          <div className="dashboard-tabs">
            <button className={`tab-btn ${activeTab === "workout" ? "active" : ""}`} onClick={() => setActiveTab("workout")}>
              <Dumbbell size={18} /> Workouts
            </button>
            <button className={`tab-btn ${activeTab === "diet" ? "active" : ""}`} onClick={() => setActiveTab("diet")}>
              <Utensils size={18} /> Meals
            </button>
            <button className={`tab-btn ${activeTab === "grocery" ? "active" : ""}`} onClick={() => setActiveTab("grocery")}>
              <ShoppingCart size={18} /> Grocery List
            </button>
          </div>

          <div className="rest-timer-box">
            <Timer size={18} className={isTimerRunning ? "pulse-anim" : ""} />
            <span>Rest Timer: <strong>{timerSeconds}s</strong></span>
            {!isTimerRunning && (
              <div className="timer-presets">
                <button onClick={() => startRestTimer(60)}>60s</button>
                <button onClick={() => startRestTimer(90)}>90s</button>
              </div>
            )}
          </div>
        </div>

        {/* DAY SELECTOR */}
        {activeTab !== "grocery" && availableDays.length > 0 && (
          <div className="day-selector-bar">
            {availableDays.map((day) => (
              <button 
                key={day} 
                className={`day-btn ${activeDay === day ? "active" : ""}`}
                onClick={() => setActiveDay(day)}
              >
                {day}
              </button>
            ))}
          </div>
        )}

        {/* CONTENT CARD */}
        {loading ? (
          <div className="loading-card">
            <RefreshCw size={32} className="spin-icon" />
            <h3>Generating PKR Plan Filtered Under Daily Budget Rs {dailyBudget}...</h3>
          </div>
        ) : (
          <div className="dash-card">
            {/* WORKOUT TAB */}
            {activeTab === "workout" && (
              <div className="workout-list">
                {aiPlan?.days?.[activeDay]?.exercises?.map((ex, idx) => (
                  <div className="workout-item" key={idx}>
                    <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
                      <CheckCircle2 size={18} color="var(--cyan-accent)" />
                      <div>
                        <strong>{ex.name}</strong>
                        <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{ex.sets} Sets x {ex.reps} Reps</div>
                      </div>
                    </div>
                    <button className="timer-start-badge" onClick={() => startRestTimer(ex.restSec || 60)}>
                      Rest {ex.restSec || 60}s
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* MEALS TAB */}
            {activeTab === "diet" && (
              <div className="meal-list">
                {aiPlan?.days?.[activeDay]?.meals?.length > 0 ? (
                  aiPlan?.days?.[activeDay]?.meals?.map((meal, idx) => (
                    <div className="meal-item" key={idx}>
                      <div>
                        <strong>{meal.title}:</strong> {meal.name}
                        <div style={{ fontSize: "0.8rem", color: "var(--cyan-accent)" }}>{meal.calories} kcal</div>
                      </div>
                      <span className="meal-price">Rs {meal.costPKR}</span>
                    </div>
                  ))
                ) : (
                  <div className="empty-text">
                    No admin meals available under daily budget Rs {dailyBudget}. Please increase your budget in onboarding.
                  </div>
                )}
              </div>
            )}

            {/* GROCERY TAB */}
            {activeTab === "grocery" && (
              <table className="grocery-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Est. Price</th>
                  </tr>
                </thead>
                <tbody>
                  {aiPlan?.groceryList?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.item}</td>
                      <td>{item.qty}</td>
                      <td style={{ color: "#10b981", fontWeight: "700" }}>Rs {item.estCostPKR}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;