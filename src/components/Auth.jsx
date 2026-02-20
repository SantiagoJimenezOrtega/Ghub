// Auth.jsx
import React, { useState } from 'react';

function Auth({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        nickname: '',
        password: '',
        full_name: '',
        birthdate: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLogin && !formData.birthdate) {
            setError('Por favor completa tu fecha de nacimiento');
            return;
        }
        setLoading(true);
        setError('');

        const endpoint = isLogin ? '/auth/login' : '/auth/register';

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('student_hub_user', JSON.stringify(data.user));
                localStorage.setItem('student_hub_token', data.token);
                onLogin(data.user);
            } else {
                setError(data.error || 'Error en la autenticación');
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
            <div className="glass-card p-8 w-full max-w-md animate-fade-in border-t-4 border-violet-500">
                <div className="text-center mb-10">
                    <div className="text-5xl mb-4">⚡</div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent tracking-tighter">
                        GENUINE 10TH HUB
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 uppercase tracking-widest font-bold">
                        {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-sm mb-6 animate-shake">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Nombre Completo</label>
                                <input
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full input-field"
                                    placeholder="Juan Pérez"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    value={formData.birthdate}
                                    onChange={e => setFormData({ ...formData, birthdate: e.target.value })}
                                    className="w-full input-field"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Username (Nickname)</label>
                        <input
                            value={formData.nickname}
                            onChange={e => setFormData({ ...formData, nickname: e.target.value })}
                            className="w-full input-field"
                            placeholder="@usuario"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Contraseña</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            className="w-full input-field"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3.5 shadow-lg shadow-violet-500/20 mt-4 flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <span>{isLogin ? 'Ingresar a la Plataforma' : 'Registrar mi Cuenta'}</span>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-slate-400 hover:text-violet-400 transition font-medium"
                    >
                        {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Auth;
