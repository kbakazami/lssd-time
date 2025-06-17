import { supabase } from "../lib/supabaseClient";
import type {Agent} from "../domain/models/Agent";

export const getAllAgents = async (): Promise<Agent[]> => {
    const { data, error } = await supabase.from("agents").select("*");
    if (error) throw error;
    return data || [];
};
