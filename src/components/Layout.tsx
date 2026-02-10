import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { ICONS } from '../constants';

const Layout: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const location = useLocation();

    // ... (rest of logic) ...

    const isActive = (path: string) => location.pathname === path ? 'text-cyan-400 bg-slate-800/50' : 'text-slate-400 hover:text-white hover:bg-slate-800/30';

    return (
        <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'}`}>

            {/* Sticky Header */}
            <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-200 ${isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <ICONS.Shield className={`w-8 h-8 transition-colors ${isDarkMode ? 'text-cyan-400 group-hover:text-cyan-300' : 'text-cyan-600 group-hover:text-cyan-500'}`} />
                            <ICONS.Lock className={`w-4 h-4 absolute bottom-0 right-0 transition-colors ${isDarkMode ? 'text-pink-400 group-hover:text-pink-300' : 'text-pink-600 group-hover:text-pink-500'}`} />
                        </div>
                        <span className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            WinLocksmith
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/')}`}>Home</Link>
                        <Link to="/config" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/config')}`}>Configure</Link>
                        <Link to="/faq" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/faq')}`}>FAQ</Link>
                        <Link to="/author" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/author')}`}>Author</Link>
                        <Link to="/donate" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/donate')}`}>Donate</Link>
                    </nav>

                    <div className="flex items-center gap-2">
                        <a href="https://github.com/boopathirbk/winlocksmith" target="_blank" rel="noopener noreferrer"
                            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'}`}>
                            <ICONS.Github className="w-5 h-5" />
                        </a>

                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-yellow-400' : 'hover:bg-slate-200 text-slate-600'}`}
                            aria-label="Toggle Theme"
                        >
                            {isDarkMode ? <ICONS.Sun className="w-5 h-5" /> : <ICONS.Moon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className={`border-t py-8 mt-auto transition-colors duration-200 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-600'}`}>
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="flex items-center justify-center gap-2 mb-4">
                        Made with <span className="text-pink-500">♥</span> by <Link to="/author" className="hover:underline">Boopathi R</Link>
                    </p>
                    <div className="flex justify-center gap-6 text-sm">
                        <Link to="/faq" className="hover:text-cyan-500 transition-colors">Help & FAQ</Link>
                        <a href="https://github.com/boopathirbk/winlocksmith/blob/main/LICENSE" target="_blank" rel="noreferrer" className="hover:text-cyan-500 transition-colors">License</a>
                        <a href="https://github.com/boopathirbk/winlocksmith" target="_blank" rel="noreferrer" className="hover:text-cyan-500 transition-colors">Source Code</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
