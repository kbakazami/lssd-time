import { supabase } from "../lib/supabaseClient";
import type { Heure } from "../domain/models/Heure";

export const getHeuresBetween = async (start: string, end: string): Promise<Heure[]> => {
    const { data, error } = await supabase
        .from("heures")
        .select("*")
        .gte("date", start)
        .lte("date", end);
    if (error) throw error;
    return data || [];
};

export const saveHeure = async (h: { agent_id: string; date: string; heures: number }) => {
    const { data } = await supabase
        .from("heures")
        .select("id")
        .eq("agent_id", h.agent_id)
        .eq("date", h.date)
        .maybeSingle();

    if (data?.id) {
        await supabase.from("heures").update({ heures: h.heures }).eq("id", data.id);
    } else {
        await supabase.from("heures").insert([h]);
    }
};