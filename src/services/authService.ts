import { supabase } from "../lib/supabaseClient";
import { pseudoToEmail } from "../lib/authHelpers";

export const loginWithPseudo = async (pseudo: string, password: string) => {
    const email = pseudoToEmail(pseudo);

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) throw new Error("Utilisateur introuvable");

    const { data: roleData, error: roleError } = await supabase
        .from("agents")
        .select("role")
        .eq("id", userId)
        .single();

    if (roleError || !roleData) throw new Error("Impossible de récupérer le rôle");

    return roleData.role as "admin" | "agent";
};
