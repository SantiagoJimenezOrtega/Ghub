// ProfileEdit.jsx
import React, { useState, useRef } from 'react';

function ProfileEdit({ currentUser, onUpdate }) {
    const [formData, setFormData] = useState({
        nickname: currentUser?.nickname || '',
        full_name: currentUser?.full_name || '',
        bio: currentUser?.bio || '',
        photo_url: currentUser?.photo_url || ''
    });
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('La imagen es demasiado grande. Máximo 2MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, photo_url: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser?.id || currentUser.id === 'admin-id') {
            alert('Error: Tu perfil no está sincronizado con la base de datos. Por favor, refresca la página.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/profiles/${currentUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const data = await res.json();
                alert('¡Perfil actualizado con éxito!');
                if (onUpdate) onUpdate(data[0]);
            } else {
                const errData = await res.json();
                alert(`Error: ${errData.error?.message || 'No se pudo actualizar el perfil'}`);
            }
        } catch (err) {
            console.error(err);
            alert('Error de conexión con el servidor. Verifica que el backend esté corriendo.');
        } finally {
            setLoading(false);
        }
    };

    const generateNewAvatar = () => {
        const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`;
        setFormData({ ...formData, photo_url: newAvatar });
    };

    return (
        <div className="glass-card p-8 animate-fade-in max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Personalizar mi Perfil</h2>

            <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                    <img
                        src={formData.photo_url || 'https://api.dicebear.com/7.x/initials/svg?seed=U'}
                        className="w-32 h-32 rounded-3xl border-2 border-violet-500/30 bg-slate-800 object-cover shadow-2xl"
                        alt="avatar"
                    />
                    <div className="absolute -bottom-2 flex gap-2 w-full justify-center">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="p-2 bg-indigo-600 rounded-xl shadow-lg hover:scale-110 transition"
                            title="Cargar Foto Real"
                        >
                            📷
                        </button>
                        <button
                            type="button"
                            onClick={generateNewAvatar}
                            className="p-2 bg-violet-600 rounded-xl shadow-lg hover:scale-110 transition"
                            title="Generar Avatar"
                        >
                            🔄
                        </button>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                <p className="text-[10px] text-slate-500 mt-6 uppercase tracking-widest font-bold">📷 Sube una foto o genera un avatar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Nickname</label>
                        <input
                            value={formData.nickname}
                            className="w-full input-field"
                            placeholder="@tunickname"
                            required
                            onChange={e => setFormData({ ...formData, nickname: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Nombre Completo</label>
                        <input
                            value={formData.full_name}
                            className="w-full input-field"
                            placeholder="Juan Pérez"
                            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Biografía</label>
                        <textarea
                            value={formData.bio}
                            className="w-full input-field h-24 resize-none"
                            placeholder="Cuéntanos sobre ti..."
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-3 flex items-center justify-center space-x-2 shadow-lg shadow-violet-500/20"
                >
                    {loading ? <span>Sincronizando...</span> : <span>Guardar Cambios</span>}
                </button>
            </form>
        </div>
    );
}

export default ProfileEdit;
