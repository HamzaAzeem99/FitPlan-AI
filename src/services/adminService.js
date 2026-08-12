import { supabase } from './supabaseClient';

// Admin ke Ingredients fetch karna (Budget Filter ke liye)
export const fetchIngredientsFromSupabase = async (maxPricePKR) => {
  try {
    let query = supabase.from('ingredients').select('*');
    if (maxPricePKR) {
      query = query.lte('price_pkr', maxPricePKR);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching ingredients:", err.message);
    return [];
  }
};

// Admin ki Exercise Library fetch karna
export const fetchExercisesFromSupabase = async () => {
  try {
    const { data, error } = await supabase.from('exercise_library').select('*');
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching exercises:", err.message);
    return [];
  }
};