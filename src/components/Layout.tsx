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
    ];

    return (
        <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'bg-zinc-950 text-zinc-300' : 'bg-white text-zinc-800'}`}>

            {/* Skip to main (WCAG 2.4.1) */}
            <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-sky-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium">
                Skip to main content
            </a>

            {/* Header */}
            <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'frosted-header shadow-lg shadow-black/5' : isDarkMode ? 'bg-transparent border-b border-zinc-800/50' : 'bg-transparent border-b border-zinc-200'}`} role="banner">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group" aria-label="WinLocksmith home">
                        <div className="relative w-8 h-8">
                            <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-indigo-500 to-rose-500 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <ICONS.Shield className="w-5 h-5 text-white drop-shadow-sm" />
                            </div>
                        </div>
                        <span className={`text-lg font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                            WinLocksmith
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-0.5" role="navigation" aria-label="Main navigation">
                        {navLinks.map(({ path, label }) => (
                            <Link key={path} to={path}
                                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(path)
                                    ? (isDarkMode ? 'text-white bg-zinc-800' : 'text-zinc-900 bg-zinc-100')
                                    : (isDarkMode ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100')
                                    }`}
                                aria-current={isActive(path) ? 'page' : undefined}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1.5">
                        <a href="https://github.com/boopathirbk/winlocksmith" target="_blank" rel="noopener noreferrer"
                            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${isDarkMode ? 'text-zinc-400 hover:text-zinc-200 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50' : 'text-zinc-600 hover:text-zinc-900 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'}`}
                            aria-label="Star WinLocksmith on GitHub"
                        >
                            <ICONS.Star className="w-3.5 h-3.5" aria-hidden="true" /> Star
                        </a>
                        <Link to="/donate"
                            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${isDarkMode ? 'text-rose-400 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20' : 'text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200'}`}
                            aria-label="Support WinLocksmith"
                        >
                            <ICONS.Heart className="w-3.5 h-3.5" aria-hidden="true" /> Donate
                        </Link>
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-amber-400 hover:bg-zinc-800/50' : 'text-zinc-600 hover:bg-zinc-100'}`}
                            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDarkMode ? <ICONS.Sun className="w-[18px] h-[18px]" /> : <ICONS.Moon className="w-[18px] h-[18px]" />}
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`md:hidden p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-zinc-400 hover:bg-zinc-800/50' : 'text-zinc-600 hover:bg-zinc-100'}`}
                            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                            aria-expanded={mobileMenuOpen}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
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
                    <nav className={`md:hidden animate-slide-down border-t px-3 py-2 space-y-0.5 ${isDarkMode ? 'bg-zinc-950/95 border-zinc-800/50 backdrop-blur-xl' : 'bg-white/95 border-zinc-200 backdrop-blur-xl'}`} role="navigation" aria-label="Mobile navigation">
                        {navLinks.map(({ path, label }) => (
                            <Link key={path} to={path} className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive(path)
                                ? (isDarkMode ? 'text-white bg-zinc-800' : 'text-zinc-900 bg-zinc-100')
                                : (isDarkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/50' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50')
                                }`}
                                aria-current={isActive(path) ? 'page' : undefined}
                            >
                                {label}
                            </Link>
                        ))}
                        <div className="border-t dark:border-zinc-800/30 border-zinc-200 my-1 pt-1 flex gap-2 px-1">
                            <a href="https://github.com/boopathirbk/winlocksmith" target="_blank" rel="noopener noreferrer" className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${isDarkMode ? 'text-zinc-400 border-zinc-800 hover:bg-zinc-800/50' : 'text-zinc-600 border-zinc-200 hover:bg-zinc-50'}`}>
                                <ICONS.Star className="w-3.5 h-3.5" aria-hidden="true" /> Star
                            </a>
                            <Link to="/donate" className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20' : 'text-rose-600 bg-rose-50 border border-rose-200'}`}>
                                <ICONS.Heart className="w-3.5 h-3.5" aria-hidden="true" /> Donate
                            </Link>
                        </div>
                    </nav>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1" id="main-content" role="main">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className={`border-t py-10 mt-auto transition-colors duration-300 ${isDarkMode ? 'bg-zinc-950 border-zinc-800/50' : 'bg-zinc-50 border-zinc-200'}`} role="contentinfo">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-5">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gradient-to-br from-sky-500 to-indigo-500 rounded flex items-center justify-center">
                            <ICONS.Shield className="w-3 h-3 text-white" />
                        </div>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>WinLocksmith</span>
                    </div>
                    <div className={`flex items-center gap-6 text-sm ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>
                        <Link to="/faq" className={`transition-colors ${isDarkMode ? 'hover:text-zinc-300' : 'hover:text-zinc-900'}`}>Help & FAQ</Link>
                        <a href="https://github.com/boopathirbk/winlocksmith/blob/main/LICENSE" target="_blank" rel="noreferrer" className={`transition-colors ${isDarkMode ? 'hover:text-zinc-300' : 'hover:text-zinc-900'}`}>License</a>
                        <a href="https://github.com/boopathirbk/winlocksmith" target="_blank" rel="noreferrer" className={`transition-colors ${isDarkMode ? 'hover:text-zinc-300' : 'hover:text-zinc-900'}`}>Source</a>
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-zinc-600' : 'text-zinc-500'}`}>
                        Made with <span className="text-rose-500" aria-label="love">♥</span> by <Link to="/author" className={`transition-colors ${isDarkMode ? 'hover:text-zinc-300' : 'hover:text-zinc-900'}`}>Boopathi R</Link>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
