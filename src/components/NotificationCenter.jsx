// components/NotificationCenter.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function NotificationCenter({ currentUser, onClose }) {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
        // Marcar como leídas al abrir
        fetch(`${process.env.REACT_APP_API_URL}/notifications/read/${currentUser.id}`, { method: 'PUT' });
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/notifications/${currentUser.id}`);
            const data = await res.json();
            setNotifications(data);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    const getMessage = (n) => {
        switch (n.type) {
            case 'like': return 'te dio ❤️ en tu publicación';
            case 'comment': return 'comentó tu publicación 💬';
            case 'wall_post': return 'escribió en tu muro 📝';
            case 'birthday': return 'está de cumpleaños hoy! 🎂';
            default: return 'tienes una nueva novedad';
        }
    };

    const handleClick = (n) => {
        if (n.type === 'wall_post') {
            // Si alguien escribió en mi muro, voy a MI muro
            navigate(`/profile/${currentUser.id}`);
        } else if (n.type === 'like' || n.type === 'comment') {
            // Por ahora, para simplificar, vamos al feed principal donde están los posts
            // O si el post tiene un target_profile_id, iríamos a ese muro.
            // Dejamos '/' por defecto para interacciones globales.
            navigate('/');
        } else {
            navigate(`/profile/${n.actor_id}`);
        }
        onClose();
    };

    return (
        <div className="fixed left-[260px] top-6 w-[350px] bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden animate-fade-in ring-1 ring-white/5">
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div>
                    <h3 className="font-black text-white tracking-tight">Notificaciones</h3>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Recientes</p>
                </div>
                <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
                >
                    ✕
                </button>
            </div>

            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="text-4xl mb-4 opacity-20">🔔</div>
                        <p className="text-slate-500 text-sm font-medium">Todo al día por aquí.</p>
                    </div>
                ) : (
                    notifications.map(n => (
                        <div
                            key={n.id}
                            onClick={() => handleClick(n)}
                            className={`p-5 flex items-start space-x-4 cursor-pointer hover:bg-white/5 transition relative group active:scale-[0.98] ${!n.is_read ? 'bg-violet-500/10' : ''}`}
                        >
                            {!n.is_read && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500"></div>
                            )}
                            <div className="relative flex-shrink-0">
                                <img
                                    src={n.actor?.photo_url || 'https://api.dicebear.com/7.x/initials/svg?seed=U'}
                                    className="w-12 h-12 rounded-2xl object-cover border border-white/10 shadow-lg group-hover:scale-110 transition duration-300"
                                    alt="actor"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-slate-950 p-1 rounded-lg border border-white/10 text-[10px]">
                                    {n.type === 'like' && '❤️'}
                                    {n.type === 'comment' && '💬'}
                                    {n.type === 'wall_post' && '📝'}
                                </div>
                            </div>
                            <div className="flex-grow min-w-0">
                                <p className="text-sm text-slate-300 leading-snug">
                                    <span className="font-bold text-white group-hover:text-violet-400 transition">{n.actor?.nickname}</span> {getMessage(n)}
                                </p>
                                <div className="flex items-center space-x-2 mt-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 opacity-50"></span>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 bg-white/5 border-t border-white/5 text-center">
                <button onClick={onClose} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-violet-400 transition">
                    Cerrar Panel
                </button>
            </div>
        </div>
    );
}

export default NotificationCenter;
