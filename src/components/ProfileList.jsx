// ProfileList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfileList() {
    const [profiles, setProfiles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/profiles`)
            .then(res => res.json())
            .then(data => setProfiles(data));
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return '---';
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profiles.map(profile => (
                <div key={profile.id}
                    onClick={() => navigate(`/profile/${profile.id}`)}
                    className="glass-card p-4 flex items-center space-x-4 cursor-pointer hover:border-violet-500/50 transition duration-300"
                >
                    <img src={profile.photo_url} className="w-16 h-16 rounded-2xl bg-white/5 object-cover" alt={profile.nickname} />
                    <div className="flex-grow">
                        <h3 className="font-semibold text-white">{profile.nickname}</h3>
                        <p className="text-xs text-slate-400 mb-2 truncate max-w-[150px]">{profile.bio || 'Sin biografía'}</p>
                        <div className="flex space-x-2">
                            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-300">
                                🎂 {formatDate(profile.birthdate)}
                            </span>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-white/5 rounded-full transition text-slate-400">
                        👉
                    </button>
                </div>
            ))}
            {profiles.length === 0 && (
                <div className="col-span-2 glass-card p-10 text-center text-slate-500">
                    Aún no hay perfiles creados. ¡Sé el primero!
                </div>
            )}
        </div>
    );
}

export default ProfileList;
