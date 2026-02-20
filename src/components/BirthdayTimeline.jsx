// BirthdayTimeline.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameDay,
    addMonths,
    subMonths,
    parseISO
} from 'date-fns';
import { es } from 'date-fns/locale';

function BirthdayTimeline() {
    const [profiles, setProfiles] = useState([]);
    const [view, setView] = useState('timeline'); // 'timeline' or 'calendar'
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/profiles`)
            .then(res => res.json())
            .then(data => setProfiles(data.filter(d => d.birthdate)));
    }, []);

    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('es-ES', { month: 'long', day: 'numeric' });
    };

    const sortedBirthdays = [...profiles].sort((a, b) => {
        const bdayA = new Date(a.birthdate + 'T12:00:00');
        const bdayB = new Date(b.birthdate + 'T12:00:00');
        return bdayA.getMonth() - bdayB.getMonth() || bdayA.getDate() - bdayB.getDate();
    });

    // Calendar Logic
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const getBirthdaysForDay = (day) => {
        return profiles.filter(p => {
            const bday = new Date(p.birthdate + 'T12:00:00');
            return bday.getDate() === day.getDate() && bday.getMonth() === day.getMonth();
        });
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tighter">CUMPLEAÑOS</h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Celebraciones en el Hub</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5 shadow-inner">
                    <button
                        onClick={() => setView('timeline')}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${view === 'timeline' ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        LISTA
                    </button>
                    <button
                        onClick={() => setView('calendar')}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${view === 'calendar' ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        CALENDARIO
                    </button>
                </div>
            </div>

            {view === 'timeline' ? (
                <div className="relative border-l-2 border-slate-800 ml-4 pl-8 space-y-8">
                    {sortedBirthdays.map((student, index) => (
                        <div key={index} className="relative group">
                            <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:scale-125 transition-transform"></div>
                            <div
                                onClick={() => navigate(`/profile/${student.id}`)}
                                className="glass-card p-4 flex items-center justify-between cursor-pointer hover:border-violet-500/50 transition duration-300 active:scale-[0.98]"
                            >
                                <div className="flex items-center space-x-4">
                                    <img src={student.photo_url} className="w-12 h-12 rounded-full border-2 border-slate-800 object-cover shadow-xl" alt="bday" />
                                    <div>
                                        <p className="font-bold text-white group-hover:text-violet-400 transition">{student.nickname}</p>
                                        <p className="text-sm text-slate-400 capitalize">
                                            {formatDate(student.birthdate)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-2xl animate-bounce">🎈</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card overflow-hidden">
                    <div className="bg-white/5 p-6 flex items-center justify-between border-b border-white/5">
                        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white/10 rounded-full text-white transition">◀</button>
                        <h3 className="text-xl font-black text-white capitalize">{format(currentMonth, 'MMMM yyyy', { locale: es })}</h3>
                        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white/10 rounded-full text-white transition">▶</button>
                    </div>

                    <div className="grid grid-cols-7 border-b border-white/5">
                        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                            <div key={d} className="py-3 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7">
                        {calendarDays.map((day, idx) => {
                            const bdays = getBirthdaysForDay(day);
                            const isCurrentMonth = format(day, 'M') === format(currentMonth, 'M');
                            return (
                                <div key={idx} className={`min-h-[100px] border border-white/5 p-2 relative ${!isCurrentMonth ? 'opacity-20' : ''}`}>
                                    <span className="text-[10px] font-bold text-slate-500">{format(day, 'd')}</span>
                                    {bdays.length > 0 && (
                                        <div className="mt-1 space-y-1">
                                            {bdays.map(p => (
                                                <div
                                                    key={p.id}
                                                    onClick={() => navigate(`/profile/${p.id}`)}
                                                    className="flex items-center space-x-1.5 p-1 rounded-md bg-violet-500/20 hover:bg-violet-500/40 cursor-pointer transition border border-violet-500/20"
                                                >
                                                    <img src={p.photo_url} className="w-4 h-4 rounded-full object-cover" alt="avatar" />
                                                    <span className="text-[9px] font-black text-violet-200 truncate">{p.nickname}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {bdays.length > 1 && (
                                        <div className="absolute top-1 right-1">
                                            <span className="text-[14px]">🎉</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default BirthdayTimeline;
