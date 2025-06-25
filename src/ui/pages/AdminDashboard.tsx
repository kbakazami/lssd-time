import { useEffect, useState } from "react";
import { getAllAgents } from "../../infrastructure/supabaseAgentRepository";
import { getHeuresBetween } from "../../infrastructure/supabaseHeureRepository";
import type { Agent } from "../../domain/models/Agent";
import type { Heure } from "../../domain/models/Heure";
import AdminWeekTable from "../components/AdminWeekTable";
import LogoutButton from "../components/LogoutButton";
import EditableWeekHoursTable from "../components/EditableWeekHoursTable";
import IbanForm from "../components/IbanForm";
import { supabase } from "../../lib/supabaseClient";
import { WeekSelector } from "../components/WeekSelector";
import { getWeekRangeFromSaturday, formatWeekRangeFromSaturday } from "../../shared/weekUtils";

export default function AdminDashboard() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [heures, setHeures] = useState<Heure[]>([]);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const reload = async (start: Date) => {
        const [startRange, endRange] = getWeekRangeFromSaturday(start);
        const heures = await getHeuresBetween(startRange, endRange);
        setHeures(heures);
    };

    useEffect(() => {
        const init = async () => {
            const a = await getAllAgents();
            setAgents(a);

            const { data } = await supabase.auth.getUser();
            setCurrentUserId(data.user?.id || null);
        };
        init();
    }, []);

    // recharger les heures à chaque changement de semaine
    useEffect(() => {
        reload(startDate);
    }, [startDate]);

    if (!currentUserId) return null;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">
                    Semaine : {formatWeekRangeFromSaturday(startDate)}
                </h1>
                <div className="flex gap-2">
                    <WeekSelector onChange={(d) => setStartDate(d)} />
                    <LogoutButton />
                </div>
            </div>

            <AdminWeekTable startDate={startDate} agents={agents} heures={heures} onReload={() => reload(startDate)} />

            <div className="mb-8">
                <h2 className="text-lg font-bold mb-2">Ma fiche personnelle</h2>
                <IbanForm />
                <EditableWeekHoursTable
                    agentId={currentUserId}
                    heures={heures.filter((h) => h.agent_id === currentUserId)}
                    onReload={() => reload(startDate)}
                    startDate={startDate}
                />
            </div>
        </div>
    );
}
