// ProfileForm.jsx
import React, { useState } from 'react';

function ProfileForm({ onComplete }) {
  const [formData, setFormData] = useState({
    nickname: '',
    full_name: '',
    birthdate: '',
    bio: '',
    photo_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('¡Bienvenido al Hub!');
        if (onComplete) onComplete();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-card p-8 animate-fade-in max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Crea tu Identidad</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Nickname</label>
          <input
            className="w-full input-field"
            placeholder="@estudiante"
            required
            onChange={e => setFormData({ ...formData, nickname: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Fecha de Nacimiento</label>
          <input
            type="date"
            className="w-full input-field"
            required
            onChange={e => setFormData({ ...formData, birthdate: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sobre mí</label>
          <textarea
            className="w-full input-field h-24 resize-none"
            placeholder="¿Quién eres y qué te gusta?"
            onChange={e => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>
        <button type="submit" className="w-full btn-primary mt-4">
          Unirse a la Plataforma
        </button>
      </form>
    </div>
  );
}

export default ProfileForm;