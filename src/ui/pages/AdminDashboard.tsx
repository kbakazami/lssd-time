import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { getAllAgents } from "../../infrastructure/supabaseAgentRepository";
import { getHeuresBetween } from "../../infrastructure/supabaseHeureRepository";
import type { Agent } from "../../domain/models/Agent";
import type { Heure } from "../../domain/models/Heure";
import LogoutButton from "../components/LogoutButton";
import { supabase } from "../../lib/supabaseClient";
import { WeekSelector } from "../components/WeekSelector";
import {getWeekRangeFromSaturday, formatWeekRangeFromSaturday, getSaturday} from "../../shared/weekUtils";

export type AdminDashboardContext = {
    agents: Agent[];
    heures: Heure[];
    startDate: Date;
    currentUserId: string | null;
    reload: (start: Date) => Promise<void>;
};

export default function AdminDashboard() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [heures, setHeures] = useState<Heure[]>([]);
    const [startDate, setStartDate] = useState<Date>(getSaturday(new Date()));
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

            <nav className="mb-4 flex gap-2">
                <Link to="table" className="btn btn-sm btn-secondary">Tableau</Link>
                <Link to="profile" className="btn btn-sm btn-secondary">Ma fiche</Link>
            </nav>

            <Outlet context={{ agents, heures, startDate, currentUserId, reload }} />
        </div>
    );
}
