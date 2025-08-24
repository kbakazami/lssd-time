import { supabase } from "../lib/supabaseClient";
import type {Agent, CreateAgent} from "../domain/models/Agent";

export const getAllAgents = async (): Promise<Agent[]> => {
    const { data, error } = await supabase.from("agents").select("*");
    if (error) throw error;
    return data || [];
};

export const createAgent = async (agent: CreateAgent): Promise<void> => {
    const { data, error } = await supabase.auth.signUp({
        email: `${agent.pseudo}@lssd.local`,
        password: agent.password, // Assuming matricule is used as password
    });

    if (error || !data.user) {
        throw new Error(`Erreur création utilisateur: ${error?.message}`);
    }

    const userId = data.user.id;

    const { error: insertError } = await supabase.from("agents").insert({
        id: userId,
        pseudo: agent.pseudo,
        nom: agent.nom,
        prenom: agent.prenom,
        matricule: agent.matricule,
        role: agent.role,
    });

    if (insertError) {
        throw new Error(`Erreur insertion agent: ${insertError.message}`);
    }
}