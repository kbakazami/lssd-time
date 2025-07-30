import IbanForm from "../components/IbanForm";
import EditableWeekHoursTable from "../components/EditableWeekHoursTable";
import { useOutletContext } from "react-router-dom";
import type { AdminDashboardContext } from "./AdminDashboard";

export default function AdminProfilePage() {
    const { heures, startDate, reload, currentUserId } = useOutletContext<AdminDashboardContext>();

    if (!currentUserId) return null;
    const myHeures = heures.filter((h) => h.agent_id === currentUserId);

    return (
        <div className="mb-8 space-y-4">
            <h2 className="text-lg font-bold">Ma fiche personnelle</h2>
            <IbanForm />
            <EditableWeekHoursTable
                agentId={currentUserId}
                heures={myHeures}
                onReload={() => reload(startDate)}
                startDate={startDate}
            />
        </div>
    );
}
