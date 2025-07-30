import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithPseudo } from "../../services/authService";

export default function Login() {
    const [pseudo, setPseudo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const role = await loginWithPseudo(pseudo, password);
            if (role === "admin") {
                navigate("/admin");
            } else {
                navigate("/agent");
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Erreur de connexion");
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-base-200">
            <form onSubmit={handleLogin} className="card w-96 bg-base-100 shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-4">Connexion LSSD</h2>
                {error && <p className="text-error mb-2">{error}</p>}
                <input
                    type="text"
                    placeholder="Pseudo"
                    className="input input-bordered w-full mb-3"
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    className="input input-bordered w-full mb-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="btn btn-primary w-full">Se connecter</button>
            </form>
        </div>
    );
}
