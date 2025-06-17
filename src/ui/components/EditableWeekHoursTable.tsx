import { useEffect, useState } from "react";
import type { Heure } from "../../domain/models/Heure";
import { getLundi } from "../../shared/dateUtils";
import { saveHeure } from "../../infrastructure/supabaseHeureRepository";
import Toast from "./Toast";


type Props = {
    agentId: string;
    heures: Heure[];
    onReload: () => void;
};

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function EditableWeekHoursTable({ agentId, heures, onReload }: Props) {
    const lundi = getLundi();
    const [editing, setEditing] = useState(false);
    const [localHeures, setLocalHeures] = useState<number[]>(new Array(7).fill(0));
    const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);


    // Met à jour localHeures à chaque changement de données
    useEffect(() => {
        const newHeures = jours.map((_, i) => {
            const d = new Date(lundi);
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split("T")[0];
            return heures.find((h) => h.date === dateStr)?.heures || 0;
        });
        setLocalHeures(newHeures);
    }, [heures]);

    const handleSave = async () => {
        console.log("💾 Début de l'enregistrement des heures...");
        for (let i = 0; i < 7; i++) {
            const date = new Date(lundi);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split("T")[0];
            const newValue = localHeures[i];

            const existing = heures.find((h) => h.date === dateStr);
            const oldValue = existing?.heures ?? null;

            if (oldValue === null && newValue === 0) {
                console.log(`❌ Ignoré ${dateStr} : vide`);
                continue;
            }

            if (oldValue === null && newValue > 0) {
                console.log(`✅ Insertion ${dateStr} : ${newValue}h`);
                await saveHeure({ agent_id: agentId, date: dateStr, heures: newValue });
                continue;
            }

            if (oldValue !== null && oldValue !== newValue) {
                console.log(`✏️ Mise à jour ${dateStr} : ${oldValue}h → ${newValue}h`);
                await saveHeure({ agent_id: agentId, date: dateStr, heures: newValue });
                continue;
            }

            console.log(`➡️ Inchangé ${dateStr} : ${newValue}h`);
        }

        await onReload();
        setEditing(false);

        await onReload();
        setEditing(false);
        setToastMsg({ text: "Heures enregistrées avec succès ✅", type: "success" });

        console.log("✅ Sauvegarde terminée");
    };

    const total = localHeures.reduce((sum, h) => sum + h, 0);
    const primes = Math.floor(total / 10);

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
                    <td>{primes} 💵</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}
