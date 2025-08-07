import { useState } from 'react';
import * as React from "react";
import {createAgent} from "../../infrastructure/supabaseAgentRepository.ts";

interface Props {
    setToastMsg: (msg: { text: string; type: 'success' | 'error' }) => void;
}

const CreateAgentForm: React.FC<Props> = ({ setToastMsg }) => {
    const [form, setForm] = useState({
        pseudo: '',
        password: '',
        nom: '',
        prenom: '',
        matricule: '',
        role: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await createAgent({ ...form, role: form.role as 'admin' | 'agent' })

        setToastMsg({ text: 'Agent créé avec succès ✅', type: 'success' });

        setForm({
            pseudo: '',
            password: '',
            nom: '',
            prenom: '',
            matricule: '',
            role: ''
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col border p-10 rounded w-100">
            <input className="input input-sm input-bordered w-full" name="pseudo" placeholder="Pseudo" value={form.pseudo} onChange={handleChange} required />
            <input className="input input-sm input-bordered w-full" name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} required />
            <input className="input input-sm input-bordered w-full" name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required />
            <input className="input input-sm input-bordered w-full" name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} required />
            <input className="input input-sm input-bordered w-full" name="matricule" placeholder="Matricule" value={form.matricule} onChange={handleChange} required />
            <input className="input input-sm input-bordered w-full" name="role" placeholder="Rôle" value={form.role} onChange={handleChange} required />
            <button className="btn btn-primary" type="submit">Créer l’agent</button>
        </form>
    );
}

export default CreateAgentForm;
