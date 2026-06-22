import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
    navigate('/');
  };

  if (!user) return null;

  // Initials for avatar
  const getAvatarInitials = (name) => {
    const parts = name.replace(/^(Dr\.|Mr\.|Ms\.)\s+/i, '').split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/75 backdrop-blur-lg transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Left */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
            <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" />
            </svg>
          </div>
          <span className="font-display text-xl font-extrabold tracking-tight text-slate-800 transition-colors group-hover:text-primary">
            Care<span className="text-primary">Sync</span>
          </span>
        </Link>

        {/* User Right */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-800">{user.name}</span>
            <span className="text-xs font-medium text-slate-400 capitalize">{user.role}</span>
          </div>

          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            {/* Avatar Circle */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-blue-500 font-display text-sm font-bold text-white shadow-sm">
              {getAvatarInitials(user.name)}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-danger/30 hover:bg-danger/5 hover:text-danger transition-all duration-200 focus:outline-none"
              title="Sign Out"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
