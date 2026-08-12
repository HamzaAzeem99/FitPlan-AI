import { fetchIngredientsFromSupabase, fetchExercisesFromSupabase } from './adminService';

// Mifflin-St Jeor BMR & TDEE Grounding Formula
export const calculateBMRandTDEE = (userData) => {
  const { weight = 70, height = 170, age = 22, gender = "male", activityLevel = "moderately active", goal = "muscle gain" } = userData;
  
  let bmr = 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age);
  bmr = gender === "male" ? bmr + 5 : bmr - 161;

  const activityMultipliers = {
    sedentary: 1.2,
    "lightly active": 1.375,
    "moderately active": 1.55,
    "very active": 1.725
  };

  const tdee = Math.round(bmr * (activityMultipliers[activityLevel] || 1.375));

  let targetCalories = tdee;
  if (goal === "fat loss" || goal === "fatloss") targetCalories -= 500;
  if (goal === "muscle gain" || goal === "muscle") targetCalories += 400;

  const targetProtein = Math.round(Number(weight) * 2);

  return { targetCalories, targetProtein, tdee, bmr };
};

// Groq AI Integration Function
export const fetchGroqAiPlan = async (userData) => {
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    console.error("VITE_GROQ_API_KEY missing");
    return null;
  }

  // 1. Real Budget Calculation (Daily Budget = Weekly Budget / 7)
  const weeklyBudget = Number(userData.weeklyBudget) || 3500;
  const dailyBudget = Math.round(weeklyBudget / 7);

  // 2. Fetch Filtered Ingredients from Supabase (Strictly <= Daily Budget)
  const ingredientsContext = await fetchIngredientsFromSupabase(dailyBudget);
  const exercisesContext = await fetchExercisesFromSupabase();

  const { targetCalories, targetProtein } = calculateBMRandTDEE(userData);

  // 3. Fallback text validation if Admin hasn't added items within budget
  let budgetWarningText = "";
  if (ingredientsContext.length === 0) {
    budgetWarningText = `Note: Admin has not added any single ingredient below PKR ${dailyBudget}. Using generic Pakistani budget estimates.`;
  }

  const prompt = `
    You are FitPlan AI engine. Generate a structured 7-day fitness plan for a user in Pakistan.
    Strict Constraint: Daily meal plan cost MUST NOT exceed PKR ${dailyBudget}.

    User Profile:
    - Daily Target Calories: ${targetCalories} kcal
    - Daily Target Protein: ${targetProtein} g
    - Daily Meals Budget Limit: PKR ${dailyBudget}
    - Available Equipment: ${userData.equipment ? userData.equipment.join(", ") : "dumbbells"}
    
    Database Available Ingredients (Filtered <= PKR ${dailyBudget}): ${JSON.stringify(ingredientsContext)}
    Database Exercise Library: ${JSON.stringify(exercisesContext)}

    Return STRICTLY JSON format:
    {
      "splitName": "string",
      "budgetNote": "${budgetWarningText}",
      "days": {
        "Day 1": {
          "exercises": [{"name": "string", "sets": 4, "reps": "8-10", "restSec": 60}],
          "meals": [{"title": "Breakfast/Lunch/Dinner", "name": "string", "calories": 500, "costPKR": 150}]
        }
      },
      "groceryList": [{"item": "string", "qty": "string", "estCostPKR": 300}]
    }
  `;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error("Groq AI Error:", error);
    return null;
  }
};