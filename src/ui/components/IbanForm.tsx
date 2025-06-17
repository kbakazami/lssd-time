import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function IbanForm() {
    const [iban, setIban] = useState("");
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    useEffect(() => {
        const fetchIban = async () => {
            const { data: user } = await supabase.auth.getUser();
            const { data } = await supabase
                .from("agents")
                .select("iban")
                .eq("id", user.user?.id)
                .single();

            if (data?.iban) setIban(data.iban);
            setLoading(false);
        };
        fetchIban();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        const { data: user } = await supabase.auth.getUser();
        const { error } = await supabase
            .from("agents")
            .update({ iban })
            .eq("id", user.user?.id);

        if (error) {
            setToast({ type: "error", message: "Erreur lors de la mise à jour de l'IBAN ❌" });
        } else {
            setToast({ type: "success", message: "IBAN mis à jour avec succès ✅" });
        }

        setLoading(false);
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="space-y-2 mt-6 relative">
            <label className="label font-semibold">IBAN pour virement</label>
            <input
                type="text"
                className="input input-bordered w-full"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                disabled={loading}
                placeholder="415698745 ..."
            />
            <button className="btn btn-sm btn-primary mt-2" onClick={handleSave} disabled={loading}>
                Enregistrer
            </button>

            {/* Toast */}
            {toast && (
                <div className="toast toast-top toast-end z-50">
                    <div className={`alert alert-${toast.type}`}>
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
