import {useState, useEffect} from "react";
import type {Agent} from "../../domain/models/Agent";
import type {Heure} from "../../domain/models/Heure";
import {saveHeure} from "../../infrastructure/supabaseHeureRepository";
import {toISODate} from "../../shared/weekUtils";
import {computePrime} from "../../domain/services/primeService";
import {sumHeures} from "../../domain/services/heuresService";
import Toast from "./Toast";
import { days } from "../../shared/weeksDay.ts";

type Props = {
    agents: Agent[];
    heures: Heure[];
    onReload: () => void;
    startDate: Date; // 🆕 reçu en props
};

export default function AdminEditableWeekTable({agents, heures, onReload, startDate}: Props) {
    const [editing, setEditing] = useState(false);
    const [local, setLocal] = useState<Record<string, number[]>>({}); // clé : agentId → [heures sur 7 jours]
    const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

    // Init local state à chaque changement de semaine ou données
    useEffect(() => {
        const weekDates = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            return toISODate(d);
        });

        const newState: Record<string, number[]> = {};

        agents.forEach((agent) => {
            newState[agent.id] = weekDates.map((dateStr) => (
                heures.find((h) => h.agent_id === agent.id && h.date === dateStr)?.heures || 0
            ));
        });

        setLocal(newState);
    }, [heures, agents, startDate]);

    const handleSave = async () => {
        const weekDates = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            return toISODate(d);
        });

        for (const agent of agents) {
            const heuresAgent = local[agent.id] || [];

            for (let i = 0; i < 7; i++) {
                const dateStr = weekDates[i];

                const existing = heures.find(
                    (h) => h.agent_id === agent.id && h.date === dateStr
                );
                const oldValue = existing?.heures ?? null;
                const newValue = heuresAgent[i];

                if (oldValue === null && newValue === 0) continue;

                if (oldValue === null && newValue > 0) {
                    await saveHeure({ agent_id: agent.id, date: dateStr, heures: newValue });
                    continue;
                }

                if (oldValue !== null && oldValue !== newValue) {
                    await saveHeure({ agent_id: agent.id, date: dateStr, heures: newValue });
                }
            }
        }

        await onReload();
        setEditing(false);
        setToastMsg({text: "Heures enregistrées avec succès ✅", type: "success"});
    };

    const statsByAgent = agents.map((agent) => {
        const heuresAgent = local[agent.id] || new Array(7).fill(0);
        const total = sumHeures(heuresAgent);
        const primes = computePrime(total);
        return { agent, heuresAgent, total, primes };
    });
    const totalPrimes = statsByAgent.reduce((s, a) => s + a.primes, 0);
    const totalHeures = heures.reduce((s, h) => s + h.heures, 0);

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button
                    className="btn btn-sm btn-accent"
                    onClick={editing ? handleSave : () => setEditing(true)}
                >
                    {editing ? "Enregistrer" : "Modifier"}
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="table w-full table-zebra">
                    <thead>
                    <tr>
                        <th>Matricule</th>
                        <th>Prénom Nom</th>
                        {days.map((day) => (
                            <th key={day}>{day}</th>
                        ))}
                        <th>IBAN</th>
                        <th>Total</th>
                        <th>Primes</th>
                    </tr>
                    </thead>
                    <tbody>
                    {statsByAgent.map(({ agent, heuresAgent, total, primes }) => (
                        <tr key={agent.id}>
                            <td>{agent.matricule}</td>
                            <td>{agent.prenom} {agent.nom}</td>
                            {days.map((_, i) => (
                                <td key={i}>
                                    <input
                                        type="number"
                                        className="input input-sm input-bordered w-20"
                                        value={heuresAgent[i]}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || 0;
                                            setLocal((prev) => ({
                                                ...prev,
                                                [agent.id]: prev[agent.id].map((h, j) => (j === i ? val : h)),
                                            }));
                                        }}
                                        disabled={!editing}
                                        min={0}
                                    />
                                </td>
                            ))}
                            <td>{agent.iban}</td>
                            <td>{total}</td>
                            <td>{primes.toLocaleString()} 💵</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div>
                    <p className="text-sm text-gray-500 mt-2">
                        Total des heures : {totalHeures} heures
                    </p>
                    <p className="text-sm text-gray-500">
                        Total des primes :  {totalPrimes.toLocaleString()} 💰
                    </p>
                </div>
            </div>

            {toastMsg && <Toast message={toastMsg.text} type={toastMsg.type}/>}
        </div>
    );
}
