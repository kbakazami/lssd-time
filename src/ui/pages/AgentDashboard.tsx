import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {formatWeekRangeFromSaturday, getSaturday, toISODate} from "../../shared/weekUtils";
import { getHeuresBetween } from "../../infrastructure/supabaseHeureRepository";
import type { Heure } from "../../domain/models/Heure";
import EditableWeekHoursTable from "../components/EditableWeekHoursTable";
import LogoutButton from "../components/LogoutButton.tsx";
import IbanForm from "../components/IbanForm";
import {WeekSelector} from "../components/WeekSelector.tsx";

export default function AgentDashboard() {
    const [heures, setHeures] = useState<Heure[]>([]);
    const [agentId, setAgentId] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date>(getSaturday(new Date()));

    const reload = async () => {
        if (!agentId || !startDate) return;

        const all = await getHeuresBetween(
            toISODate(startDate),
            toISODate(new Date(startDate.getTime() + 6 * 86400 * 1000))
        );
        setHeures(all.filter((h) => h.agent_id === agentId));
    };


    useEffect(() => {
        (async () => {
            const { data: userData } = await supabase.auth.getUser();
            const id = userData?.user?.id;
            if (!id) return;

            setAgentId(id);

            const all = await getHeuresBetween(
                toISODate(startDate),
                toISODate(new Date(startDate.getTime() + 6 * 86400 * 1000))
            );
            setHeures(all.filter((h) => h.agent_id === id));
        })();
    }, [startDate]);


    if (!agentId) return <div className="p-4">Chargement...</div>;

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
            <div className="p-4 max-w-3xl mx-auto space-y-4">
                <EditableWeekHoursTable
                    agentId={agentId}
                    heures={heures}
                    onReload={reload}
                    startDate={startDate}
                />
                <IbanForm />
                <LogoutButton />
            </div>
        </div>
    );
}
