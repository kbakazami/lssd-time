import { supabase } from "../lib/supabaseClient";
import { pseudoToEmail } from "../lib/authHelpers";
import type {NewUser} from "../domain/models/NewUser.ts";

export const createNewUser = async (user: NewUser) => {
    const email = pseudoToEmail(user.pseudo);

    // 1. Créer dans auth
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password: user.password,
        email_confirm: true,
    });

    if (error || !data.user) {
        throw new Error("Erreur à la création du compte : " + error?.message);
    }

    // 2. Ajouter dans `agents`
    const agentData = {
        id: data.user.id,
        pseudo: user.pseudo,
        nom: user.nom,
        prenom: user.prenom,
        matricule: user.matricule,
        role: user.role,
    };

    const { error: insertError } = await supabase.from("agents").insert([agentData]);

    if (insertError) {
        throw new Error("Utilisateur créé, mais erreur dans la table agents : " + insertError.message);
    }

    return true;
};
