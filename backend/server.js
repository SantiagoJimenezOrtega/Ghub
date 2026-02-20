// backend/server.js
const express = require('express');
const cors = require('cors');
const supabase = require('./supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const JWT_SECRET = process.env.JWT_SECRET || 'student-hub-secret-key-2026';

// Helper to create notifications with better logging
const createNotification = async (receiverId, actorId, type, postId = null) => {
    if (receiverId === actorId) return; // Don't notify yourself

    console.log(`🔔 CREANDO NOTIFICACIÓN: To ${receiverId}, From ${actorId}, Type ${type}`);

    const { error } = await supabase.from('notifications').insert([{
        receiver_id: receiverId,
        actor_id: actorId,
        type,
        post_id: postId
    }]);

    if (error) {
        console.error('❌ Error al crear notificación:', error.message);
    } else {
        console.log('✅ Notificación creada con éxito');
    }
};

// --- AUTH ---
app.post('/api/auth/register', async (req, res) => {
    const { nickname, password, full_name, birthdate, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase.from('profiles').insert([{
        nickname, password: hashedPassword, full_name, birthdate,
        role: role || 'student',
        photo_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname}`
    }]).select();
    if (error) return res.status(500).json({ error: error.message });
    const token = jwt.sign({ id: data[0].id }, JWT_SECRET);
    res.status(201).json({ user: data[0], token });
});

app.post('/api/auth/login', async (req, res) => {
    const { nickname, password } = req.body;
    const { data, error } = await supabase.from('profiles').select('*').eq('nickname', nickname).single();
    if (error || !data) return res.status(401).json({ error: 'Usuario no encontrado' });
    const validPassword = await bcrypt.compare(password, data.password || '');
    if (!validPassword) return res.status(401).json({ error: 'Contraseña incorrecta' });
    const token = jwt.sign({ id: data.id }, JWT_SECRET);
    res.json({ user: data, token });
});

// --- PROFILES ---
app.get('/api/profiles', async (req, res) => {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

app.get('/api/profiles/:id', async (req, res) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', req.params.id).maybeSingle();
    res.json(data);
});

app.put('/api/profiles/:id', async (req, res) => {
    const { data, error } = await supabase.from('profiles').update(req.body).eq('id', req.params.id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// --- POSTS ---
const getPostsWithStats = async (isGlobal, targetId = null) => {
    let query = supabase.from('posts').select('*, profiles:profile_id(nickname, photo_url), comments:comments(id), reactions:reactions(id)');
    if (isGlobal) query = query.is('target_profile_id', null);
    else query = query.eq('target_profile_id', targetId);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(p => ({
        ...p,
        comment_count: p.comments ? p.comments.length : 0,
        reaction_count: p.reactions ? p.reactions.length : 0
    }));
};

app.get('/api/posts', async (req, res) => {
    try {
        const data = await getPostsWithStats(true);
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/posts/profile/:profileId', async (req, res) => {
    try {
        const data = await getPostsWithStats(false, req.params.profileId);
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/posts', async (req, res) => {
    const { data, error } = await supabase.from('posts').insert([req.body]).select();
    if (error) return res.status(500).json({ error: error.message });

    const post = data[0];
    if (post.target_profile_id) {
        await createNotification(post.target_profile_id, post.profile_id, 'wall_post', post.id);
    }
    res.status(201).json(data);
});

// --- COMMENTS ---
app.get('/api/comments/:postId', async (req, res) => {
    const { data, error } = await supabase.from('comments').select('*, profiles:author_id(nickname, photo_url)').eq('post_id', req.params.postId).order('created_at', { ascending: true });
    res.json(data || []);
});

app.post('/api/comments', async (req, res) => {
    const { data, error } = await supabase.from('comments').insert([req.body]).select();
    if (error) return res.status(500).json({ error: error.message });

    const comment = data[0];
    const { data: post } = await supabase.from('posts').select('profile_id').eq('id', comment.post_id).maybeSingle();
    if (post) {
        console.log(`💬 Comentario en post de: ${post.profile_id}`);
        await createNotification(post.profile_id, comment.author_id, 'comment', comment.post_id);
    }

    res.status(201).json(data);
});

// --- REACTIONS ---
app.post('/api/reactions', async (req, res) => {
    const { post_id, profile_id } = req.body;
    const { data: existing } = await supabase.from('reactions').select('*').eq('post_id', post_id).eq('profile_id', profile_id).maybeSingle();

    if (existing) {
        await supabase.from('reactions').delete().eq('post_id', post_id).eq('profile_id', profile_id);
        res.json({ status: 'removed' });
    } else {
        await supabase.from('reactions').insert([{ post_id, profile_id }]);
        const { data: post } = await supabase.from('posts').select('profile_id').eq('id', post_id).maybeSingle();
        if (post) await createNotification(post.profile_id, profile_id, 'like', post_id);
        res.status(201).json({ status: 'added' });
    }
});

// --- NOTIFICATIONS ---
app.get('/api/notifications/:profileId', async (req, res) => {
    const { data, error } = await supabase
        .from('notifications')
        .select('*, actor:actor_id(nickname, photo_url)')
        .eq('receiver_id', req.params.profileId)
        .order('created_at', { ascending: false })
        .limit(20);
    res.json(data || []);
});

app.put('/api/notifications/read/:profileId', async (req, res) => {
    await supabase.from('notifications').update({ is_read: true }).eq('receiver_id', req.params.profileId);
    res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ SERVIDOR ACTIVO v2 en puerto ${PORT}`));
