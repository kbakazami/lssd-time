import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import * as React from "react";

interface Props {
    setToastMsg: (msg: { text: string; type: 'success' | 'error' }) => void;
}

const CreateAgentForm: React.FC<Props> = ({ setToastMsg }) => {
    const [form, setForm] = useState({
        email: '',
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

        const { data, error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
        });

        if (error || !data.user) {
            console.error('Erreur création utilisateur:', error?.message);
            return;
        }

        const userId = data.user.id;

        const { error: insertError } = await supabase.from('agents').insert({
            id: userId,
            pseudo: form.email,
            nom: form.nom,
            prenom: form.prenom,
            matricule: form.matricule,
            role: form.role
        });

        if (insertError) {
            console.error('Erreur insertion agent:', insertError.message);
            return;
        }

        setToastMsg({ text: 'Agent créé avec succès ✅', type: 'success' });

        setForm({
            email: '',
            password: '',
            nom: '',
            prenom: '',
            matricule: '',
            role: ''
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col border p-10 rounded w-100">
            <input className="input input-sm input-bordered w-full" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
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
