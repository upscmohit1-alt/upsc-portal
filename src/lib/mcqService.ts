import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export interface MCQ {
  question: string;
  options: string[]; // Assuming options is an array of strings
  correct_answer_index: number;
  explanation?: string;
  date: string; // ISO date string, e.g., '2026-04-18'
}

export interface InsertedMCQ extends MCQ {
  id: number;
}

/**
 * Inserts an array of MCQ objects into the daily_mcqs table.
 * @param mcqs Array of MCQ objects to insert
 * @returns Promise that resolves to the inserted data or throws an error
 */
export async function insertDailyMCQs(mcqs: MCQ[]): Promise<InsertedMCQ[]> {
  try {
    const { data, error } = await supabase
      .from('daily_mcqs')
      .insert(mcqs)
      .select();

    if (error) {
      throw new Error(`Failed to insert MCQs: ${error.message}`);
    }

    return data as InsertedMCQ[];
  } catch (err) {
    console.error('Error inserting daily MCQs:', err);
    throw err; // Re-throw to let caller handle
  }
}