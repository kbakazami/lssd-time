import * as React from "react";
import CreateAgentForm from "../components/CreateAgentForm.tsx";
import Toast from "../components/Toast.tsx";
import {useState} from "react";

const AdminCreateAgentPage: React.FC = () => {
    const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Créer un nouvel agent</h1>
            <p className="text-gray-600 mb-6">Veuillez remplir le formulaire ci-dessous pour créer un nouvel agent.</p>
            <CreateAgentForm setToastMsg={setToastMsg} />
            {toastMsg && <Toast message={toastMsg.text} type={toastMsg.type} />}
        </div>
    );
}

export default AdminCreateAgentPage;