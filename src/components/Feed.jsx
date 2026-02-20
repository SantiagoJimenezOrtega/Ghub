// Feed.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function BirthdayBanner({ birthdayUsers }) {
    const navigate = useNavigate();
    if (birthdayUsers.length === 0) return null;

    return (
        <div className="birthday-banner group cursor-pointer active:scale-[0.98] transition-all duration-500" onClick={() => navigate('/birthdays')}>
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-5">
                    <div className="relative">
                        <div className="absolute inset-0 bg-violet-400 blur-xl opacity-30 animate-pulse"></div>
                        <span className="text-5xl relative animate-bounce block">🎂</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white tracking-tighter">¡HOY ESTAMOS DE FIESTA! 🎉</h3>
                        <p className="text-slate-300 text-sm font-medium">
                            Hoy celebran su cumpleaños:
                            <span className="text-violet-300 font-bold ml-1">
                                {birthdayUsers.map(u => u.nickname).join(', ')}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="flex -space-x-3">
                    {birthdayUsers.map(u => (
                        <img
                            key={u.id}
                            src={u.photo_url}
                            className="w-12 h-12 rounded-full border-4 border-slate-900 object-cover shadow-2xl group-hover:translate-y-[-5px] transition-transform duration-300"
                            alt="bday"
                        />
                    ))}
                </div>
            </div>
            <div className="absolute top-2 right-4 text-[10px] font-black text-violet-400 uppercase tracking-widest opacity-50">Click para felicitar</div>
        </div>
    );
}

function Feed({ currentUser }) {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [activeComments, setActiveComments] = useState({});
    const [commentsData, setCommentsData] = useState({});
    const [newComment, setNewComment] = useState({});
    const [particles, setParticles] = useState([]);
    const [birthdayUsers, setBirthdayUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
        fetchBirthdays();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/posts`);
            const data = await res.json();
            setPosts(data || []);
        } catch (err) { console.error(err); }
    };

    const fetchBirthdays = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/profiles`);
            const data = await res.json();
            const today = new Date();
            const bdays = data.filter(u => {
                if (!u.birthdate) return false;
                const bdate = new Date(u.birthdate + 'T12:00:00');
                return bdate.getDate() === today.getDate() && bdate.getMonth() === today.getMonth();
            });
            setBirthdayUsers(bdays);
        } catch (err) { console.error(err); }
    };

    const handleReaction = async (postId, e) => {
        const newParticles = Array.from({ length: 8 }).map((_, i) => ({
            id: Date.now() + i,
            x: e.clientX,
            y: e.clientY,
            angle: (i * 45) * (Math.PI / 180),
        }));
        setParticles(prev => [...prev, ...newParticles]);
        setTimeout(() => setParticles(prev => prev.filter(p => !newParticles.includes(p))), 1000);

        try {
            await fetch(`${process.env.REACT_APP_API_URL}/reactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: postId, profile_id: currentUser.id })
            });
            fetchPosts();
        } catch (err) { console.error(err); }
    };

    const extractYouTubeId = (url) => {
        const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = url?.match(regExp);
        return match ? match[1] : null;
    };

    const renderTextWithLinks = (text) => {
        if (!text) return null;
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);
        return parts.map((part, i) => {
            if (part.match(urlRegex)) {
                return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline break-all transition-colors">{part}</a>;
            }
            return part;
        });
    };

    const handlePublish = async () => {
        if (!newPost.trim()) return;
        await fetch(`${process.env.REACT_APP_API_URL}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile_id: currentUser.id, content: newPost, is_anonymous: isAnonymous, target_profile_id: null })
        });
        setNewPost('');
        fetchPosts();
    };

    const toggleComments = async (postId) => {
        if (!activeComments[postId]) {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/comments/${postId}`);
            const data = await res.json();
            setCommentsData(prev => ({ ...prev, [postId]: data }));
        }
        setActiveComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    const handlePostComment = async (postId) => {
        const text = newComment[postId];
        if (!text?.trim()) return;
        await fetch(`${process.env.REACT_APP_API_URL}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ post_id: postId, author_id: currentUser.id, content: text })
        });
        setNewComment({ ...newComment, [postId]: '' });
        const res = await fetch(`${process.env.REACT_APP_API_URL}/comments/${postId}`);
        const data = await res.json();
        setCommentsData({ ...commentsData, [postId]: data });
        fetchPosts();
    };

    return (
        <div className="space-y-6">
            {/* Partículas de Reacción */}
            {particles.map(p => (
                <div key={p.id} className="fixed pointer-events-none text-xl animate-particle" style={{ left: p.x, top: p.y, '--angle': `${p.angle}rad` }}>❤️</div>
            ))}

            {/* Recordatorio de Cumpleaños */}
            <BirthdayBanner birthdayUsers={birthdayUsers} />

            {currentUser && (
                <div className="glass-card p-6 border-b-2 border-violet-500/20">
                    <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder={`Hola ${currentUser.nickname}, ¿qué quieres compartir hoy?`}
                        className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none h-24 text-white placeholder-slate-600 font-light"
                    />
                    <div className="flex items-center justify-between mt-4">
                        <label className="flex items-center space-x-2 cursor-pointer text-sm text-slate-500 hover:text-slate-300 transition">
                            <input type="checkbox" checked={isAnonymous} onChange={() => setIsAnonymous(!isAnonymous)} className="rounded bg-slate-800 border-slate-700 text-violet-600" />
                            <span>Post Anónimo</span>
                        </label>
                        <button onClick={handlePublish} className="btn-primary px-8">Publicar</button>
                    </div>
                </div>
            )}

            <div className="space-y-8">
                {posts.map(post => {
                    const ytId = extractYouTubeId(post.content);
                    return (
                        <div key={post.id} className="glass-card p-6 animate-fade-in group">
                            <div className="flex items-center space-x-3 mb-6">
                                <div
                                    className={`flex items-center space-x-3 ${post.is_anonymous ? '' : 'cursor-pointer hover:opacity-80 transition'}`}
                                    onClick={() => !post.is_anonymous && navigate(`/profile/${post.profile_id}`)}
                                >
                                    <img src={post.is_anonymous ? 'https://api.dicebear.com/7.x/identicon/svg?seed=anon' : (post.profiles?.photo_url || 'https://api.dicebear.com/7.x/initials/svg?seed=U')} className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 object-cover" alt="av" />
                                    <div>
                                        <p className="font-bold text-slate-200 group-hover:text-violet-400 transition">{post.is_anonymous ? 'Anónimo' : post.profiles?.nickname}</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">{new Date(post.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-slate-300 leading-relaxed mb-6 whitespace-pre-wrap">{renderTextWithLinks(post.content)}</p>

                            {ytId && (
                                <div className="aspect-video rounded-2xl overflow-hidden mb-6 border border-white/5 shadow-2xl">
                                    <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${ytId}?rel=0`} title="YT" frameBorder="0" allowFullScreen></iframe>
                                </div>
                            )}

                            <div className="flex items-center space-x-6 border-t border-slate-800/50 pt-4">
                                <button onClick={() => toggleComments(post.id)} className="text-xs font-black text-slate-500 hover:text-violet-400 transition uppercase tracking-tighter flex items-center space-x-2">
                                    <span>💬</span> <span>{(post.comment_count || 0) === 1 ? '1 comentario' : `${post.comment_count || 0} comentarios`}</span>
                                </button>
                                <button
                                    onClick={(e) => handleReaction(post.id, e)}
                                    className="text-xs font-black text-slate-500 hover:text-pink-400 transition uppercase tracking-tighter flex items-center space-x-2"
                                >
                                    <span className="text-sm">❤️</span> <span>{post.reaction_count || 0}</span>
                                </button>
                            </div>

                            {activeComments[post.id] && (
                                <div className="mt-6 space-y-4 animate-fade-in">
                                    <div className="space-y-3 pl-4 border-l-2 border-violet-500/10">
                                        {commentsData[post.id]?.map(c => (
                                            <div key={c.id} className="flex space-x-3 p-3 bg-white/5 rounded-xl">
                                                <img
                                                    src={c.profiles?.photo_url || 'https://api.dicebear.com/7.x/initials/svg?seed=U'}
                                                    className="w-8 h-8 rounded-lg object-cover cursor-pointer hover:opacity-80 transition"
                                                    alt="av"
                                                    onClick={() => navigate(`/profile/${c.author_id}`)}
                                                />
                                                <div>
                                                    <p
                                                        className="font-bold text-violet-400 text-xs cursor-pointer hover:underline"
                                                        onClick={() => navigate(`/profile/${c.author_id}`)}
                                                    >
                                                        {c.profiles?.nickname}
                                                    </p>
                                                    <p className="text-slate-300 text-sm mt-0.5">{c.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex space-x-2 pt-2">
                                        <input
                                            value={newComment[post.id] || ''}
                                            onChange={e => setNewComment({ ...newComment, [post.id]: e.target.value })}
                                            onKeyDown={(e) => { if (e.key === 'Enter') handlePostComment(post.id); }}
                                            className="flex-grow input-field text-sm h-10"
                                            placeholder="Escribe un comentario..."
                                        />
                                        <button onClick={() => handlePostComment(post.id)} className="btn-primary text-xs px-4">Enviar</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Feed;
