// ProfileWall.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ConfettiEffect() {
    const [pieces, setPieces] = useState([]);

    useEffect(() => {
        const colors = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
        const newPieces = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100 + 'vw',
            delay: Math.random() * 3 + 's',
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4 + 'px'
        }));
        setPieces(newPieces);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[9999]">
            {pieces.map(p => (
                <div
                    key={p.id}
                    className="confetti"
                    style={{
                        left: p.left,
                        animationDelay: p.delay,
                        backgroundColor: p.color,
                        width: p.size,
                        height: p.size
                    }}
                />
            ))}
        </div>
    );
}

function ProfileWall({ studentId, currentUser }) {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [selectedGift, setSelectedGift] = useState(null);
    const [student, setStudent] = useState(null);
    const [activeComments, setActiveComments] = useState({});
    const [commentsData, setCommentsData] = useState({});
    const [newComment, setNewComment] = useState({});
    const [isBirthdayToday, setIsBirthdayToday] = useState(false);
    const navigate = useNavigate();

    const GIFTS = [
        { id: '🏆', name: 'Trofeo', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJwamZoaDZreXp3eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1z/3o7TKMGpx4WFjg8A00/giphy.gif' },
        { id: '⭐', name: 'Estrella', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJwamZoaDZreXp3eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1z/l41lTfuxx4g5cZZ9C/giphy.gif' },
        { id: '🚀', name: 'Cohete', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJwamZoaDZreXp3eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1z/l0HlIDW6p2Eksm3JK/giphy.gif' }
    ];

    useEffect(() => {
        fetchStudent();
        fetchPosts();
    }, [studentId]);

    const fetchStudent = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/profiles/${studentId}`);
            const data = await res.json();
            setStudent(data);

            if (data.birthdate) {
                const today = new Date();
                const bday = new Date(data.birthdate + 'T12:00:00');
                if (today.getDate() === bday.getDate() && today.getMonth() === bday.getMonth()) {
                    setIsBirthdayToday(true);
                }
            }
        } catch (err) { console.error('Error fetching student:', err); }
    };

    const fetchPosts = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/profile/${studentId}`);
            const data = await res.json();
            setPosts(data || []);
        } catch (err) { console.error('Error fetching posts:', err); }
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
        if (!newPost.trim() && !selectedGift) return;
        const postContent = selectedGift ? `${newPost}\n\n[GIFT:${selectedGift.url}]` : newPost;

        try {
            await fetch(`${process.env.REACT_APP_API_URL}/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profile_id: currentUser.id,
                    target_profile_id: studentId,
                    content: postContent,
                    is_anonymous: false
                })
            });
            setNewPost('');
            setSelectedGift(null);
            fetchPosts();
        } catch (err) { console.error('Error publishing:', err); }
    };

    const toggleComments = async (postId) => {
        if (!activeComments[postId]) {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/comments/${postId}`);
            const data = await res.json();
            setCommentsData(prev => ({ ...prev, [postId]: data }));
        }
        setActiveComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    const postComment = async (postId) => {
        const text = newComment[postId];
        if (!text?.trim()) return;
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: postId, author_id: currentUser.id, content: text })
            });
            setNewComment(prev => ({ ...prev, [postId]: '' }));
            const res = await fetch(`${process.env.REACT_APP_API_URL}/comments/${postId}`);
            const data = await res.json();
            setCommentsData(prev => ({ ...prev, [postId]: data }));
            fetchPosts();
        } catch (err) { console.error('Error commenting:', err); }
    };

    const handleReaction = async (postId) => {
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/reactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: postId, profile_id: currentUser.id })
            });
            fetchPosts();
        } catch (err) { console.error('Error reaccionando:', err); }
    };

    const renderCommentCount = (count) => {
        const n = count || 0;
        if (n === 1) return '1 comentario';
        return `${n} comentarios`;
    };

    return (
        <div className="space-y-6">
            {isBirthdayToday && <ConfettiEffect />}

            <div className={`glass-card p-8 flex items-center space-x-6 border-b-4 ${isBirthdayToday ? 'border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)] animate-pulse' : 'border-violet-500/50'}`}>
                <div className="relative">
                    <img src={student?.photo_url || 'https://api.dicebear.com/7.x/initials/svg?seed=U'} className="w-24 h-24 rounded-3xl object-cover shadow-2xl border-2 border-white/10" alt="profile" />
                    {isBirthdayToday && (
                        <div className="absolute -top-3 -right-3 text-4xl animate-bounce">👑</div>
                    )}
                </div>
                <div>
                    <div className="flex items-center space-x-3">
                        <h2 className="text-3xl font-bold text-white">{student?.nickname || 'Cargando...'}</h2>
                        {isBirthdayToday && <span className="bg-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter animate-bounce">¡Cumpleaños Hoy! 🎂</span>}
                    </div>
                    <p className="text-slate-400">{student?.bio || 'Muro Personal'}</p>
                </div>
            </div>

            <div className="glass-card p-6">
                <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Escribe algo en su muro o pega un link de YouTube..."
                    className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-600 resize-none h-20"
                />
                <div className="flex items-center justify-between mt-4">
                    <div className="flex space-x-2">
                        {GIFTS.map(gift => (
                            <button
                                key={gift.id}
                                onClick={() => setSelectedGift(gift)}
                                className={`p-2 rounded-xl transition ${selectedGift?.id === gift.id ? 'bg-violet-500 scale-110' : 'bg-slate-800 hover:bg-slate-700'}`}
                            >
                                <img src={gift.url} className="w-8 h-8 object-contain" alt={gift.name} />
                            </button>
                        ))}
                    </div>
                    <button onClick={handlePublish} className="btn-primary">Enviar Mensaje</button>
                </div>
            </div>

            <div className="space-y-6">
                {posts.map(post => {
                    const ytId = extractYouTubeId(post.content);
                    const giftMatch = post.content.match(/\[GIFT:(.*?)\]/);
                    const cleanContent = post.content.replace(/\[GIFT:.*?\]/, '');

                    return (
                        <div key={post.id} className="glass-card p-6">
                            <div
                                className="flex items-center space-x-3 mb-4 cursor-pointer hover:opacity-80 transition group"
                                onClick={() => navigate(`/profile/${post.profile_id}`)}
                            >
                                <img src={post.profiles?.photo_url || 'https://api.dicebear.com/7.x/initials/svg?seed=U'} className="w-8 h-8 rounded-lg object-cover" alt="author" />
                                <p className="font-bold text-violet-400 group-hover:underline">{post.is_anonymous ? 'Anónimo' : post.profiles?.nickname}</p>
                            </div>

                            <p className="text-slate-300 mb-4 whitespace-pre-wrap">{renderTextWithLinks(cleanContent)}</p>

                            {giftMatch && (
                                <div className="mb-4 flex justify-center p-4 bg-white/5 rounded-2xl">
                                    <img src={giftMatch[1]} className="w-32 h-32 object-contain animate-bounce" alt="gift" />
                                </div>
                            )}

                            {ytId && (
                                <div className="aspect-video rounded-xl overflow-hidden mb-4 border border-white/10">
                                    <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${ytId}?rel=0`} title="YT" frameBorder="0" allowFullScreen></iframe>
                                </div>
                            )}

                            <div className="flex items-center space-x-6 border-t border-slate-800/50 pt-4 mt-4">
                                <button onClick={() => toggleComments(post.id)} className="text-xs font-black text-slate-500 hover:text-violet-400 transition uppercase tracking-tighter flex items-center space-x-2">
                                    <span>💬</span> <span>{renderCommentCount(post.comment_count)}</span>
                                </button>
                                <button onClick={() => handleReaction(post.id)} className="text-xs font-black text-slate-500 hover:text-pink-400 transition uppercase tracking-tighter flex items-center space-x-2">
                                    <span className="text-sm">❤️</span> <span>{post.reaction_count || 0}</span>
                                </button>
                            </div>

                            {activeComments[post.id] && (
                                <div className="mt-4 space-y-4">
                                    {commentsData[post.id]?.map(c => (
                                        <div key={c.id} className="flex space-x-2 text-xs bg-slate-900/50 p-3 rounded-lg">
                                            <img
                                                src={c.profiles?.photo_url || 'https://api.dicebear.com/7.x/initials/svg?seed=U'}
                                                className="w-6 h-6 rounded object-cover cursor-pointer hover:opacity-80 transition"
                                                alt="c-author"
                                                onClick={() => navigate(`/profile/${c.author_id}`)}
                                            />
                                            <div>
                                                <p
                                                    className="font-bold text-violet-400 cursor-pointer hover:underline"
                                                    onClick={() => navigate(`/profile/${c.author_id}`)}
                                                >
                                                    {c.profiles?.nickname}
                                                </p>
                                                <p className="text-slate-300">{c.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex space-x-2">
                                        <input
                                            value={newComment[post.id] || ''}
                                            onChange={e => setNewComment({ ...newComment, [post.id]: e.target.value })}
                                            onKeyDown={(e) => { if (e.key === 'Enter') postComment(post.id); }}
                                            className="flex-grow input-field text-xs"
                                            placeholder="Responder..."
                                        />
                                        <button onClick={() => postComment(post.id)} className="btn-primary text-xs py-1 px-3">OK</button>
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

export default ProfileWall;
