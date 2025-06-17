export type NewUser = {
    pseudo: string;
    nom: string;
    prenom: string;
    matricule: string;
    password: string;
    role: "agent" | "admin";
}