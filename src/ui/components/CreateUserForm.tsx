import { useState } from "react";
import { createNewUser } from "../../services/createUserService";
import type { NewUser } from "../../domain/models/NewUser";

export default function CreateUserForm({ onUserCreated }: { onUserCreated?: () => void }) {
    const [form, setForm] = useState<NewUser>({
        pseudo: "",
        nom: "",
        prenom: "",
        matricule: "",
        password: "",
        role: "agent",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            await createNewUser(form);
            setMessage("✅ Utilisateur créé avec succès !");
            if (onUserCreated) onUserCreated();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setMessage("❌ " + err.message);
            } else {
                setMessage("❌ An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card bg-base-100 shadow p-4 max-w-md space-y-2">
            <h2 className="text-xl font-bold">Créer un utilisateur</h2>
            <input name="pseudo" placeholder="Pseudo" className="input input-bordered w-full" onChange={handleChange} required />
            <input name="prenom" placeholder="Prénom" className="input input-bordered w-full" onChange={handleChange} required />
            <input name="nom" placeholder="Nom" className="input input-bordered w-full" onChange={handleChange} required />
            <input name="matricule" placeholder="Matricule" className="input input-bordered w-full" onChange={handleChange} required />
            <input name="password" type="password" placeholder="Mot de passe" className="input input-bordered w-full" onChange={handleChange} required />
            <select name="role" className="select select-bordered w-full" onChange={handleChange}>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
            </select>
            <button className="btn btn-primary w-full" disabled={loading}>
                {loading ? "Création..." : "Créer l'utilisateur"}
            </button>
            {message && <div className="text-sm">{message}</div>}
        </form>
    );
}
