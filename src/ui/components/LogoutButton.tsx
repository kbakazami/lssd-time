import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/", { replace: true });
    };

    return (
        <button className="btn btn-sm btn-error" onClick={handleLogout}>
            Déconnexion
        </button>
    );
}
