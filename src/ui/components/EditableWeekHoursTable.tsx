import { useEffect, useState } from "react";
import type { Heure } from "../../domain/models/Heure";
import { saveHeure } from "../../infrastructure/supabaseHeureRepository";
import Toast from "./Toast";

type Props = {
    agentId: string;
    heures: Heure[];
    onReload: () => void;
    startDate: Date; // <- doit correspondre à Samedi
};

// Ordre de la semaine : Samedi → Vendredi
const jours = ["Samedi", "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

export default function EditableWeekHoursTable({ agentId, heures, onReload, startDate }: Props) {
    const [editing, setEditing] = useState(false);
    const [localHeures, setLocalHeures] = useState<number[]>(new Array(7).fill(0));
    const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

    // Mise à jour du tableau local à chaque changement de semaine ou données
    useEffect(() => {
        const newState = jours.map((_, i) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateStr = date.toISOString().split("T")[0];
            return heures.find((h) => h.date === dateStr)?.heures || 0;
        });

        setLocalHeures(newState);
    }, [startDate, heures]);

    const handleSave = async () => {
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split("T")[0];
            const newValue = localHeures[i];

            const existing = heures.find((h) => h.date === dateStr);
            const oldValue = existing?.heures ?? null;

            if (oldValue === null && newValue === 0) continue;

            if (oldValue === null && newValue > 0) {
                await saveHeure({ agent_id: agentId, date: dateStr, heures: newValue });
                continue;
            }

            if (oldValue !== null && oldValue !== newValue) {
                await saveHeure({ agent_id: agentId, date: dateStr, heures: newValue });
            }
        }

        await onReload();
        setEditing(false);
        setToastMsg({ text: "Heures enregistrées avec succès ✅", type: "success" });
    };

    const total = localHeures.reduce((sum, h) => sum + h, 0);
    let primes = 0;
    if (total >= 20) {
        primes = 3000;
    } else if (total >= 10) {
        primes = 1000;
    }

    return (
        <div className="space-y-4">
            {toastMsg && <Toast message={toastMsg.text} type={toastMsg.type} />}
            <div className="flex justify-end">
                <button className="btn btn-sm btn-accent" onClick={editing ? handleSave : () => setEditing(true)}>
                    {editing ? "Enregistrer" : "Modifier"}
                </button>
            </div>

            <table className="table w-full table-zebra">
                <thead>
                <tr>
                    <th>Jour</th>
                    <th>Heures</th>
                </tr>
                </thead>
                <tbody>
                {jours.map((jour, i) => (
                    <tr key={jour}>
                        <td>{jour}</td>
                        <td>
                            <input
                                type="number"
                                min={0}
                                className="input input-sm input-bordered w-20"
                                value={localHeures[i]}
                                onChange={(e) => {
                                    const updated = [...localHeures];
                                    updated[i] = parseInt(e.target.value) || 0;
                                    setLocalHeures(updated);
                                }}
                                disabled={!editing}
                            />
                        </td>
                    </tr>
                ))}
                <tr className="font-bold">
                    <td>Total</td>
                    <td>{total}</td>
                </tr>
                <tr>
                    <td>Primes</td>
                    <td>{primes.toLocaleString()} 💵</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}
