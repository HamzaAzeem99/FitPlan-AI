import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dumbbell, Target, ShieldCheck, DollarSign, 
  ArrowRight, ArrowLeft, Sun, Moon, Flame, Check, Calendar, Loader2, 
  Wallet
} from "lucide-react";
import { supabase } from "../../services/supabaseClient";
import "./Onboarding.css";

const Onboarding = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("dark");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Full User Inputs State (Project Brief Aligned)
  const [userData, setUserData] = useState({
    gender: "male",
    age: 22,
    weight: 75, // in kg
    height: 175, // in cm
    activityLevel: "moderately active", // sedentary, lightly active, moderately active, very active
    trainingDays: 4, // 3, 4, 5, 6 days/week
    experience: "intermediate", // beginner, intermediate, advanced
    goal: "muscle gain", // muscle gain, fat loss, maintenance
    equipment: ["dumbbells", "barbell"], // dumbbells, barbell, cables, bodyweight
    dietType: "non-veg", // veg, non-veg, vegan
    weeklyBudget: 3500, // PKR / Local Currency
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    localStorage.getItem("fitplan_user_data")? navigate("/dashboard") : navigate("/onboarding")

  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEquipmentToggle = (item) => {
    setUserData((prev) => {
      const exists = prev.equipment.includes(item);
      if (exists) {
        return { ...prev, equipment: prev.equipment.filter((i) => i !== item) };
      } else {
        return { ...prev, equipment: [...prev.equipment, item] };
      }
    });
  };

  const handleNextStep = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        // 1. Save locally for client state access
        localStorage.setItem("fitplan_user_data", JSON.stringify(userData));

        // 2. Sync to Supabase Profiles Table if authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase.from("profiles").upsert({
            id: user.id,
            user_data: userData,
            updated_at: new Date()
          });

          if (error) console.error("Supabase Profile Sync Error:", error.message);
        }

        // 3. Navigate to Dashboard
        navigate("/dashboard");
      } catch (err) {
        console.error("Onboarding submission error:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="onboarding-container">
      <header className="onboarding-header">
        <div className="logo">
          <Dumbbell size={28} /> FITPLAN <span>AI</span>
        </div>
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === "dark" ? <Sun size={20} color="#ffb700" /> : <Moon size={20} color="#7e22ce" />}
        </button>
      </header>

      <main className="onboarding-content">
        <div className="onboarding-card-wrapper">
          <div className="onboarding-card">
            
            {/* Steps Progress Bar */}
            <div className="step-progress-bar">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className={`step-indicator ${step === i ? "active" : ""} ${step > i ? "completed" : ""}`}
                >
                  {step > i ? <Check size={18} /> : i}
                </div>
              ))}
            </div>

            {/* STEP 1: BODY METRICS & ACTIVITY */}
            {step === 1 && (
              <div>
                <h2 className="section-title" style={{ textAlign: "left" }}>
                  BODY <span className="cyan-glow">METRICS</span>
                </h2>
                <p className="section-subtitle" style={{ textAlign: "left", marginBottom: "1.5rem" }}>
                  Used for scientific Mifflin-St Jeor BMR & calorie calculations.
                </p>

                <div className="signup-form">
                  <div className="form-row-grid">
                    <div className="input-group">
                      <label>Gender</label>
                      <div className="input-wrapper">
                        <select 
                          value={userData.gender} 
                          onChange={(e) => handleInputChange("gender", e.target.value)}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Age (Years)</label>
                      <div className="input-wrapper">
                        <input 
                          type="number" 
                          value={userData.age} 
                          onChange={(e) => handleInputChange("age", Number(e.target.value))} 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row-grid">
                    <div className="input-group">
                      <label>Weight (kg)</label>
                      <div className="input-wrapper">
                        <input 
                          type="number" 
                          value={userData.weight} 
                          onChange={(e) => handleInputChange("weight", Number(e.target.value))} 
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Height (cm)</label>
                      <div className="input-wrapper">
                        <input 
                          type="number" 
                          value={userData.height} 
                          onChange={(e) => handleInputChange("height", Number(e.target.value))} 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Activity Level</label>
                    <div className="input-wrapper">
                      <select 
                        value={userData.activityLevel} 
                        onChange={(e) => handleInputChange("activityLevel", e.target.value)}
                      >
                        <option value="sedentary">Sedentary (Little or no exercise)</option>
                        <option value="lightly active">Lightly Active (1-3 days/week)</option>
                        <option value="moderately active">Moderately Active (3-5 days/week)</option>
                        <option value="very active">Very Active (6-7 days/week)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: GOAL & TRAINING DAYS */}
            {step === 2 && (
              <div>
                <h2 className="section-title" style={{ textAlign: "left" }}>
                  PRIMARY <span className="orange-glow">TARGET</span>
                </h2>
                <p className="section-subtitle" style={{ textAlign: "left", marginBottom: "1.5rem" }}>
                  Select your goal and workout availability per week.
                </p>

                <label style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: "0.5rem", display: "block" }}>Fitness Goal</label>
                <div className="option-grid" style={{ marginBottom: "1.5rem" }}>
                  {[
                    { id: "muscle gain", label: "Muscle Hypertrophy", icon: <Flame color="var(--orange-accent)" /> },
                    { id: "fat loss", label: "Fat Loss (Cut)", icon: <Target color="var(--cyan-accent)" /> },
                    { id: "maintenance", label: "Body Recomp", icon: <ShieldCheck color="var(--purple-accent)" /> },
                  ].map((item) => (
                    <div 
                      key={item.id} 
                      className={`option-box ${userData.goal === item.id ? "selected" : ""}`}
                      onClick={() => handleInputChange("goal", item.id)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="signup-form">
                  <div className="form-row-grid">
                    <div className="input-group">
                      <label>Training Days / Week</label>
                      <div className="input-wrapper">
                        <select 
                          value={userData.trainingDays} 
                          onChange={(e) => handleInputChange("trainingDays", Number(e.target.value))}
                        >
                          <option value={3}>3 Days (Full Body Split)</option>
                          <option value={4}>4 Days (Upper / Lower Split)</option>
                          <option value={5}>5 Days (Push / Pull / Legs + UL)</option>
                          <option value={6}>6 Days (Push / Pull / Legs x2)</option>
                        </select>
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Experience Level</label>
                      <div className="input-wrapper">
                        <select 
                          value={userData.experience} 
                          onChange={(e) => handleInputChange("experience", e.target.value)}
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: EQUIPMENT AVAILABILITY */}
            {step === 3 && (
              <div>
                <h2 className="section-title" style={{ textAlign: "left" }}>
                  GYM <span className="cyan-glow">EQUIPMENT</span>
                </h2>
                <p className="section-subtitle" style={{ textAlign: "left", marginBottom: "1.5rem" }}>
                  Select equipment you have access to. AI will generate splits accordingly.
                </p>

                <div className="option-grid">
                  {[
                    { id: "dumbbells", label: "Dumbbells" },
                    { id: "barbell", label: "Barbell & Plates" },
                    { id: "cables", label: "Cable Machine" },
                    { id: "bodyweight", label: "Calisthenics / Bodyweight" },
                  ].map((item) => (
                    <div 
                      key={item.id} 
                      className={`option-box ${userData.equipment.includes(item.id) ? "selected" : ""}`}
                      onClick={() => handleEquipmentToggle(item.id)}
                    >
                      <Dumbbell size={24} color={userData.equipment.includes(item.id) ? "var(--cyan-accent)" : "var(--text-muted)"} />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: DIET & BUDGET */}
            {step === 4 && (
              <div>
                <h2 className="section-title" style={{ textAlign: "left" }}>
                  DIET & <span className="orange-glow">BUDGET</span>
                </h2>
                <p className="section-subtitle" style={{ textAlign: "left", marginBottom: "1.5rem" }}>
                  Grounding constraints for AI meal plan generation.
                </p>

                <div className="signup-form">
                  <div className="input-group">
                    <label>Dietary Preference</label>
                    <div className="input-wrapper">
                      <select 
                        value={userData.dietType} 
                        onChange={(e) => handleInputChange("dietType", e.target.value)}
                      >
                        <option value="non-veg">High Protein Non-Veg (Eggs, Chicken, Mutton)</option>
                        <option value="veg">Vegetarian (Paneer, Tofu, Milk, Lentils)</option>
                        <option value="vegan">100% Vegan (Plant Based)</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Weekly Grocery Budget (PKR)</label>
                    <div className="input-wrapper">
                      <Wallet size={18} className="input-icon" />
                      <input 
                        type="number" 
                        value={userData.weeklyBudget} 
                        onChange={(e) => handleInputChange("weeklyBudget", Number(e.target.value))} 
                        placeholder="e.g. 3500"
                      />
                    </div>
                    <small style={{ color: "var(--cyan-accent)", marginTop: "0.3rem", fontSize: "0.8rem" }}>
                      Daily Budget Limit: ~Rs {Math.round(userData.weeklyBudget / 7)} / day
                    </small>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="onboarding-navigation">
              {step > 1 && (
                <button className="prev-btn" onClick={handlePrevStep} disabled={loading}>
                  <ArrowLeft size={16} /> Back
                </button>
              )}
              <button className="next-btn" onClick={handleNextStep} disabled={loading}>
                {loading ? (
                  <>SAVING... <Loader2 size={16} className="spin-icon" /></>
                ) : (
                  <>{step === 4 ? "GENERATE PLAN" : "NEXT"} <ArrowRight size={16} /></>
                )}
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;