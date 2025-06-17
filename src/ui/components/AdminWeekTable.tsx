import { useState, useEffect } from "react";
import type { Agent } from "../../domain/models/Agent";
import type { Heure } from "../../domain/models/Heure";
import { getLundi } from "../../shared/dateUtils";
import { saveHeure } from "../../infrastructure/supabaseHeureRepository";
import Toast from "./Toast";


type Props = {
    agents: Agent[];
    heures: Heure[];
    onReload: () => void;
};

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function AdminEditableWeekTable({ agents, heures, onReload }: Props) {
    const lundi = getLundi();
    const [editing, setEditing] = useState(false);
    const [local, setLocal] = useState<Record<string, number[]>>({}); // clé : agentId → [lundi..dimanche]
    const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);


    // Init local state
    useEffect(() => {
        const newState: Record<string, number[]> = {};

        agents.forEach((agent) => {
            newState[agent.id] = jours.map((_, i) => {
                const date = new Date(lundi);
                date.setDate(date.getDate() + i);
                const dateStr = date.toISOString().split("T")[0];
                return heures.find(
                    (h) => h.agent_id === agent.id && h.date === dateStr
                )?.heures || 0;
            });
        });

        setLocal(newState);
    }, [heures, agents]);

    const handleSave = async () => {
        console.log("💾 Admin - sauvegarde en cours...");

        for (const agent of agents) {
            const heuresAgent = local[agent.id] || [];

            for (let i = 0; i < 7; i++) {
                const date = new Date(lundi);
                date.setDate(date.getDate() + i);
                const dateStr = date.toISOString().split("T")[0];

                const existing = heures.find(
                    (h) => h.agent_id === agent.id && h.date === dateStr
                );
                const oldValue = existing?.heures ?? null;
                const newValue = heuresAgent[i];

                if (oldValue === null && newValue === 0) continue;
                if (oldValue === null && newValue > 0) {
                    console.log(`🟢 INSERT [${agent.pseudo}] ${dateStr} : ${newValue}h`);
                    await saveHeure({ agent_id: agent.id, date: dateStr, heures: newValue });
                    continue;
                }
                if (oldValue !== null && oldValue !== newValue) {
                    console.log(`✏️ UPDATE [${agent.pseudo}] ${dateStr} : ${oldValue}h → ${newValue}h`);
                    await saveHeure({ agent_id: agent.id, date: dateStr, heures: newValue });
                }
            }
        }

        await onReload();
        setEditing(false);

        await onReload();
        setEditing(false);
        setToastMsg({ text: "Heures enregistrées avec succès ✅", type: "success" });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button className="btn btn-sm btn-accent" onClick={editing ? handleSave : () => setEditing(true)}>
                    {editing ? "Enregistrer" : "Modifier"}
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="table w-full table-zebra">
                    <thead>
                    <tr>
                        <th>Matricule</th>
                        <th>Prénom Nom</th>
                        {jours.map((j) => <th key={j}>{j}</th>)}
                        <th>IBAN</th>
                        <th>Total</th>
                        <th>Primes</th>
                    </tr>
                    </thead>
                    <tbody>
                    {agents.map((agent) => {
                        const heuresAgent = local[agent.id] || new Array(7).fill(0);
                        const total = heuresAgent.reduce((s, h) => s + h, 0);
                        const primes = Math.floor(total / 10);

                        return (
                            <tr key={agent.id}>
                                <td>{agent.matricule}</td>
                                <td>{agent.prenom} {agent.nom}</td>
                                {jours.map((_, i) => (
                                    <td key={i}>
                                        <input
                                            type="number"
                                            className="input input-sm input-bordered w-20"
                                            value={heuresAgent[i]}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                setLocal((prev) => ({
                                                    ...prev,
                                                    [agent.id]: prev[agent.id].map((h, j) =>
                                                        j === i ? val : h
                                                    ),
                                                }));
                                            }}
                                            disabled={!editing}
                                            min={0}
                                        />
                                    </td>
                                ))}
                                <td>{agent.iban}</td>
                                <td>{total}</td>
                                <td>{primes} 💵</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
            {toastMsg && <Toast message={toastMsg.text} type={toastMsg.type} />}
        </div>
    );
}
