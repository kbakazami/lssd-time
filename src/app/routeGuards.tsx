import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

type GuardProps = {
    children: React.ReactNode;
    allowedRoles?: ("admin" | "agent")[]; // Optionnel
};

export function ProtectedRoute({ children, allowedRoles }: GuardProps) {
    const [authorized, setAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const check = async () => {
            const { data: authData } = await supabase.auth.getUser();
            const user = authData?.user;

            if (!user) return setAuthorized(false);

            if (!allowedRoles) return setAuthorized(true); // Pas de restriction

            const { data: agentData } = await supabase
                .from("agents")
                .select("role")
                .eq("id", user.id)
                .single();

            if (!agentData?.role || !allowedRoles.includes(agentData.role)) {
                return setAuthorized(false);
            }

            setAuthorized(true);
        };

        check();
    }, [allowedRoles]);

    if (authorized === null) return <div className="p-4">Chargement...</div>;

    return authorized ? <>{children}</> : <Navigate to="/" replace />;
}
