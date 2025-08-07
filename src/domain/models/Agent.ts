export type Agent = {
    id: string;
    pseudo: string;
    nom: string;
    prenom: string;
    matricule: string;
    role: "admin" | "agent";
    iban?: string | null;
};

export type CreateAgent = {
    pseudo: string;
    password: string;
    nom: string;
    prenom: string;
    matricule: string;
    role: "admin" | "agent";
}