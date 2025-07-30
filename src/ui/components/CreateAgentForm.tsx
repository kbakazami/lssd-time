import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import * as React from "react";

export default function CreateAgentForm() {
    const [form, setForm] = useState({
        email: '',
        password: '',
        nom: '',
        prenom: '',
        matricule: '',
        role: '',
        iban: '',
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

        const { error: insertError } = await supabase.from('agent').insert({
            id: userId,
            pseudo: form.email,
            nom: form.nom,
            prenom: form.prenom,
            matricule: form.matricule,
            role: form.role,
            iban: form.iban,
        });

        if (insertError) {
            console.error('Erreur insertion agent:', insertError.message);
            return;
        }

        alert('Agent créé avec succès 🎉');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} required />
            <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required />
            <input name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} required />
            <input name="matricule" placeholder="Matricule" value={form.matricule} onChange={handleChange} required />
            <input name="role" placeholder="Rôle" value={form.role} onChange={handleChange} required />
            <input name="iban" placeholder="IBAN" value={form.iban} onChange={handleChange} required />
            <button type="submit">Créer l’agent</button>
        </form>
    );
}
