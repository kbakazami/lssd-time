import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { getCurrentWeekRange } from "../../shared/dateUtils";
import { getHeuresBetween } from "../../infrastructure/supabaseHeureRepository";
import type { Heure } from "../../domain/models/Heure";
import EditableWeekHoursTable from "../components/EditableWeekHoursTable";
import LogoutButton from "../components/LogoutButton.tsx";
import IbanForm from "../components/IbanForm";

export default function AgentDashboard() {
    const [heures, setHeures] = useState<Heure[]>([]);
    const [agentId, setAgentId] = useState<string | null>(null);

    const [start, end] = getCurrentWeekRange();

    const reload = async () => {
        if (!agentId) return;
        const all = await getHeuresBetween(start, end);
        setHeures(all.filter((h) => h.agent_id === agentId));
    };

    useEffect(() => {
        (async () => {
            const { data: userData } = await supabase.auth.getUser();
            const id = userData?.user?.id;
            if (!id) return;
            setAgentId(id);
            const all = await getHeuresBetween(start, end);
            setHeures(all.filter((h) => h.agent_id === id));
        })();
    }, [start]);

    if (!agentId) return <div className="p-4">Chargement...</div>;

    return (
        <div className="p-4 max-w-3xl mx-auto space-y-4">
            <h1 className="text-xl font-bold text-center">Mes heures de la semaine</h1>
            <EditableWeekHoursTable agentId={agentId} heures={heures} onReload={reload} />
            <IbanForm />
            <LogoutButton />
        </div>
    );
}
