import { useEffect, useState } from "react";
import { getAllAgents } from "../../infrastructure/supabaseAgentRepository";
import { getHeuresBetween } from "../../infrastructure/supabaseHeureRepository";
import type { Agent } from "../../domain/models/Agent";
import type { Heure } from "../../domain/models/Heure";
import AdminWeekTable from "../components/AdminWeekTable";
import { formatWeekRange, getWeekRangeFromDate } from "../../shared/weekUtils";
import LogoutButton from "../components/LogoutButton.tsx";
import EditableWeekHoursTable from "../components/EditableWeekHoursTable";
import IbanForm from "../components/IbanForm";
import {supabase} from "../../lib/supabaseClient.ts";
// import CreateUserForm from "../components/CreateUserForm.tsx";

export default function AdminDashboard() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [heures, setHeures] = useState<Heure[]>([]);
    const [weekDate, setWeekDate] = useState(new Date());

    const [start, end] = getWeekRangeFromDate(weekDate);

    const reload = async () => {
        const data = await getHeuresBetween(start, end);
        setHeures(data);
    };

    useEffect(() => {
        (async () => {
            const a = await getAllAgents();
            const h = await getHeuresBetween(start, end);
            setAgents(a);
            setHeures(h);
        })();
    }, [start, end]);

    const handlePrevWeek = () => {
        const d = new Date(weekDate);
        d.setDate(d.getDate() - 7);
        setWeekDate(d);
    };

    const handleNextWeek = () => {
        const d = new Date(weekDate);
        d.setDate(d.getDate() + 7);
        setWeekDate(d);
    };

    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setCurrentUserId(data.user?.id || null);
        };
        getUser();
    }, []);

    if (!currentUserId) return null;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Semaine : {formatWeekRange(weekDate)}</h1>
                <div className="flex gap-2">
                    <button className="btn btn-sm" onClick={handlePrevWeek}>⬅️ Précédente</button>
                    <button className="btn btn-sm" onClick={handleNextWeek}>Suivante ➡️</button>
                    <LogoutButton />
                </div>
            </div>

            {/*<CreateUserForm onUserCreated={reload} />*/}
            <AdminWeekTable agents={agents} heures={heures} onReload={reload} />
            <div className="mb-8">
                <h2 className="text-lg font-bold mb-2">Ma fiche personnelle</h2>
                <IbanForm />
                <EditableWeekHoursTable
                    agentId={currentUserId}
                    heures={heures.filter((h) => h.agent_id === currentUserId)}
                    onReload={reload}
                />
            </div>
        </div>
    );
}
