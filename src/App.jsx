// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import './styles/global.css';
import Feed from './components/Feed';
import ProfileList from './components/ProfileList';
import BirthdayTimeline from './components/BirthdayTimeline';
import ProfileEdit from './components/ProfileEdit';
import ProfileWall from './components/ProfileWall';
import Auth from './components/Auth';
import NotificationCenter from './components/NotificationCenter';

function Navigation({ currentUser, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/notifications/${currentUser.id}`);
      const data = await res.json();
      setUnreadCount(data.filter(n => !n.is_read).length);
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 5000); // Check every 5s for faster testing
    return () => clearInterval(interval);
  }, [currentUser.id]);

  const menuItems = [
    { path: '/', label: 'Muro Social', icon: '🏠' },
    { path: '/students', label: 'Estudiantes', icon: '👥' },
    { path: '/birthdays', label: 'Cumpleaños', icon: '🎂' },
    { path: '/settings', label: 'Configuración', icon: '⚙️' }
  ];

  return (
    <aside className="w-64 border-r border-slate-800 p-6 flex flex-col fixed h-full bg-slate-950/80 backdrop-blur-xl z-50">
      <div className="mb-10 flex items-center space-x-2 justify-center cursor-pointer" onClick={() => navigate('/')}>
        <span className="text-2xl">⚡</span>
        <h1 className="text-xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent tracking-tighter">
          GENUINE 10TH HUB
        </h1>
      </div>

      <nav className="space-y-1.5 flex-grow relative">
        {/* Notificaciones Toggle */}
        <div className="relative mb-6">
          <button
            onClick={() => { setShowNotifs(!showNotifs); setUnreadCount(0); }}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between hover:bg-white/5 ${showNotifs ? 'text-white' : 'text-slate-500'}`}
          >
            <div className="flex items-center space-x-3">
              <span className={`text-xl ${unreadCount > 0 ? 'animate-shake' : ''}`}>🔔</span>
              <span className="font-bold">Notificaciones</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black ring-2 ring-slate-950">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifs && (
            <NotificationCenter currentUser={currentUser} onClose={() => setShowNotifs(false)} />
          )}
        </div>

        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center space-x-3 group ${location.pathname === item.path ? 'bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}`}
          >
            <span className={`text-xl transition-transform duration-300 ${location.pathname === item.path ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}

        <button onClick={onLogout} className="w-full text-left px-4 py-3 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-400/5 transition flex items-center space-x-3 mt-4">
          <span>🚪</span><span className="font-medium">Cerrar Sesión</span>
        </button>
      </nav>

      <div className="pt-6 border-t border-slate-800 px-2 mt-auto">
        <Link to={`/profile/${currentUser.id}`} className={`flex items-center space-x-3 cursor-pointer p-2 rounded-xl transition-all group ${location.pathname === `/profile/${currentUser.id}` ? 'bg-violet-500/10 ring-1 ring-violet-500/20' : 'hover:bg-white/5'}`}>
          <div className="relative flex-shrink-0">
            <img src={currentUser?.photo_url || 'https://api.dicebear.com/7.x/initials/svg?seed=U'} className={`w-10 h-10 rounded-xl border transition-all object-cover ${location.pathname === `/profile/${currentUser.id}` ? 'border-violet-400 scale-105 shadow-violet-500/20' : 'border-violet-500/30 group-hover:border-violet-500'}`} alt="me" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full"></div>
          </div>
          <div className="overflow-hidden">
            <p className={`text-sm font-bold truncate ${location.pathname === `/profile/${currentUser.id}` ? 'text-violet-400' : 'text-slate-200'}`}>{currentUser?.nickname}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Mi Muro</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}

function ProfileWallWrapper({ currentUser }) {
  const { id } = useParams();
  return <ProfileWall studentId={id} currentUser={currentUser} />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('student_hub_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const handleLogin = (u) => { setCurrentUser(u); localStorage.setItem('student_hub_user', JSON.stringify(u)); };
  const handleLogout = () => { localStorage.clear(); setCurrentUser(null); };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-slate-950"><div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!currentUser) return <Auth onLogin={handleLogin} />;

  return (
    <Router>
      <ScrollToTop />
      <div className="flex min-h-screen bg-slate-950">
        <Navigation currentUser={currentUser} onLogout={handleLogout} />
        <main className="ml-64 flex-grow p-8 bg-slate-950">
          <div className="max-w-2xl mx-auto pb-20">
            <Routes>
              <Route path="/" element={<Feed currentUser={currentUser} />} />
              <Route path="/students" element={<ProfileList />} />
              <Route path="/birthdays" element={<BirthdayTimeline />} />
              <Route path="/settings" element={<ProfileEdit currentUser={currentUser} onUpdate={u => setCurrentUser(u)} />} />
              <Route path="/profile/:id" element={<ProfileWallWrapper currentUser={currentUser} />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;