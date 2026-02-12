import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { ICONS } from '../constants';

const Layout: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('winlocksmith-theme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        }
        localStorage.setItem('winlocksmith-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/config', label: 'Configure' },
        { path: '/faq', label: 'FAQ' },
        { path: '/author', label: 'Author' },
        { path: '/donate', label: 'Donate' },
    ];

    return (
        <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'bg-zinc-950 text-zinc-300' : 'bg-zinc-50 text-zinc-700'}`}>

            {/* Header */}
            <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'frosted-header shadow-lg shadow-black/5' : isDarkMode ? 'bg-transparent border-b border-zinc-800/50' : 'bg-transparent border-b border-zinc-200/50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="relative">
                            <ICONS.Shield className={`w-7 h-7 transition-all duration-300 group-hover:scale-110 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`} />
                            <ICONS.Lock className={`w-3.5 h-3.5 absolute -bottom-0.5 -right-0.5 transition-all duration-300 ${isDarkMode ? 'text-rose-400' : 'text-rose-500'}`} />
                        </div>
                        <span className={`text-lg font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                            WinLocksmith
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-0.5">
                        {navLinks.map(({ path, label }) => (
                            <Link key={path} to={path} className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium tracking-wide transition-all duration-200 ${isActive(path)
                                    ? (isDarkMode ? 'text-white bg-zinc-800' : 'text-zinc-900 bg-zinc-200/80')
                                    : (isDarkMode ? 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100')
                                }`}>
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1">
                        <a href="https://github.com/boopathirbk/winlocksmith" target="_blank" rel="noopener noreferrer"
                            className={`p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50' : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'}`}>
                            <ICONS.Github className="w-[18px] h-[18px]" />
                        </a>
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-amber-400 hover:bg-zinc-800/50' : 'text-zinc-500 hover:bg-zinc-100'}`}
                            aria-label="Toggle Theme"
                        >
                            {isDarkMode ? <ICONS.Sun className="w-[18px] h-[18px]" /> : <ICONS.Moon className="w-[18px] h-[18px]" />}
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`md:hidden p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-zinc-400 hover:bg-zinc-800/50' : 'text-zinc-500 hover:bg-zinc-100'}`}
                            aria-label="Toggle Menu"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                {mobileMenuOpen
                                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                }
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                {mobileMenuOpen && (
                    <nav className={`md:hidden animate-slide-down border-t px-3 py-2 space-y-0.5 ${isDarkMode ? 'bg-zinc-950/95 border-zinc-800/50 backdrop-blur-xl' : 'bg-white/95 border-zinc-200 backdrop-blur-xl'}`}>
                        {navLinks.map(({ path, label }) => (
                            <Link key={path} to={path} className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive(path)
                                    ? (isDarkMode ? 'text-white bg-zinc-800' : 'text-zinc-900 bg-zinc-100')
                                    : (isDarkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50')
                                }`}>
                                {label}
                            </Link>
                        ))}
                    </nav>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className={`border-t py-10 mt-auto transition-colors duration-300 ${isDarkMode ? 'bg-zinc-950 border-zinc-800/50 text-zinc-600' : 'bg-white border-zinc-200 text-zinc-400'}`}>
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-2">
                        <ICONS.Shield className={`w-5 h-5 ${isDarkMode ? 'text-zinc-700' : 'text-zinc-300'}`} />
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>WinLocksmith</span>
                    </div>
                    <div className="flex items-center gap-6 text-[13px]">
                        <Link to="/faq" className={`transition-colors ${isDarkMode ? 'hover:text-zinc-300' : 'hover:text-zinc-700'}`}>Help & FAQ</Link>
                        <a href="https://github.com/boopathirbk/winlocksmith/blob/main/LICENSE" target="_blank" rel="noreferrer" className={`transition-colors ${isDarkMode ? 'hover:text-zinc-300' : 'hover:text-zinc-700'}`}>License</a>
                        <a href="https://github.com/boopathirbk/winlocksmith" target="_blank" rel="noreferrer" className={`transition-colors ${isDarkMode ? 'hover:text-zinc-300' : 'hover:text-zinc-700'}`}>Source</a>
                    </div>
                    <p className="text-xs">
                        Made with <span className="text-rose-500">♥</span> by <Link to="/author" className={`transition-colors ${isDarkMode ? 'hover:text-zinc-300' : 'hover:text-zinc-700'}`}>Boopathi R</Link>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
