import React from 'react';
import { Link } from 'react-router-dom';
import { ICONS } from '../constants';

const Home: React.FC = () => {
    return (
        <div className="relative">
            {/* Background effects */}
            <div className="hero-glow absolute inset-0 pointer-events-none" aria-hidden="true" />
            <div className="dot-grid absolute inset-0 pointer-events-none" aria-hidden="true" />

            <div className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-24">

                {/* Hero */}
                <section className="text-center space-y-8 animate-fade-up" aria-labelledby="hero-title">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wide dark:bg-zinc-800/60 bg-zinc-100 dark:text-zinc-400 text-zinc-700 border dark:border-zinc-700/50 border-zinc-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                        Open Source · Offline · Free
                    </div>

                    <h1 id="hero-title" className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter">
                        <span className="dark:text-white text-zinc-900">Win</span>
                        <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">Locksmith</span>
                    </h1>

                    <p className="text-lg md:text-xl dark:text-zinc-400 text-zinc-600 max-w-2xl mx-auto leading-relaxed">
                        The open-source alternative to Intune. Generate powerful Windows hardening scripts, create kiosk modes, and secure systems — all from your browser.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                        <Link to="/config" className="group inline-flex items-center justify-center gap-2.5 px-7 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-semibold text-sm shadow-lg shadow-black/10 dark:shadow-white/5 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                            <ICONS.Wand2 className="w-4 h-4 transition-transform group-hover:rotate-12" /> Start Configuring
                        </Link>
                        <a href="https://github.com/boopathirbk/winlocksmith" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2.5 px-7 py-3 dark:bg-zinc-800/60 bg-zinc-100 dark:text-zinc-300 text-zinc-700 rounded-xl font-semibold text-sm border dark:border-zinc-700/50 border-zinc-300 transition-all duration-300 dark:hover:bg-zinc-800 hover:bg-zinc-200 active:scale-[0.98]">
                            <ICONS.Github className="w-4 h-4" /> View Source
                        </a>
                    </div>
                </section>

                {/* Feature Cards */}
                <section aria-labelledby="features-heading">
                    <h2 id="features-heading" className="sr-only">Key Features</h2>
                    <div className="grid md:grid-cols-3 gap-5">
                        {[
                            {
                                icon: <ICONS.Shield className="w-5 h-5 text-sky-500" />,
                                title: "System Hardening",
                                description: "Disable updates, telemetry & sleep. Enforce SmartScreen and block admin tools like RegEdit and CMD.",
                                gradient: "from-sky-500/10 to-transparent"
                            },
                            {
                                icon: <ICONS.Monitor className="w-5 h-5 text-violet-500" />,
                                title: "Kiosk Mode",
                                description: "Turn any Windows PC into a focused kiosk. Whitelist sites, block uploads, restrict peripherals.",
                                gradient: "from-violet-500/10 to-transparent"
                            },
                            {
                                icon: <ICONS.Lock className="w-5 h-5 text-emerald-500" />,
                                title: "Access Control",
                                description: "Block USB drives, Store, and specific apps. Prevent unauthorized admin elevation.",
                                gradient: "from-emerald-500/10 to-transparent"
                            },
                        ].map((card, i) => (
                            <article key={i} className={`group relative dark:bg-zinc-900/50 bg-white p-7 rounded-2xl border dark:border-zinc-800/60 border-zinc-200 transition-all duration-300 hover:dark:border-zinc-700/80 hover:border-zinc-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-none`}>
                                <div className={`absolute inset-0 bg-gradient-to-b ${card.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} aria-hidden="true" />
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl dark:bg-zinc-800 bg-zinc-100 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
                                        {card.icon}
                                    </div>
                                    <h3 className="text-base font-semibold dark:text-white text-zinc-900 mb-2 tracking-tight">{card.title}</h3>
                                    <p className="text-sm dark:text-zinc-400 text-zinc-600 leading-relaxed">{card.description}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* Why Section */}
                <section aria-labelledby="why-heading">
                    <div className="text-center mb-12">
                        <h2 id="why-heading" className="text-3xl font-bold dark:text-white text-zinc-900 tracking-tight">Why WinLocksmith?</h2>
                        <p className="mt-3 dark:text-zinc-400 text-zinc-600 text-base">Built for sysadmins, IT teams, and security-conscious organizations.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                        {[
                            {
                                icon: <ICONS.WifiOff className="w-4 h-4" />,
                                title: "Offline & Private",
                                desc: "Runs entirely in your browser. No data sent to the cloud. Inspect the generated .ps1 before running."
                            },
                            {
                                icon: <ICONS.CheckCircle2 className="w-4 h-4" />,
                                title: "Edition Agnostic",
                                desc: "Works on Windows Home, Pro, and Enterprise with intelligent fallbacks like ICACLS for Home edition."
                            },
                            {
                                icon: <ICONS.Github className="w-4 h-4" />,
                                title: "Free & Open Source",
                                desc: "A 100% free alternative to expensive MDM solutions like Microsoft Intune."
                            },
                            {
                                icon: <ICONS.RotateCcw className="w-4 h-4" />,
                                title: "Fully Reversible",
                                desc: "Every download includes a Restore.ps1 script. Made a mistake? Undo all changes instantly."
                            },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 p-5 rounded-xl dark:bg-zinc-900/30 bg-zinc-50 border dark:border-zinc-800/40 border-zinc-200 transition-colors hover:dark:border-zinc-700/60 hover:border-zinc-300">
                                <div className="w-9 h-9 rounded-lg dark:bg-zinc-800 bg-white flex items-center justify-center shrink-0 dark:text-emerald-400 text-emerald-600 border dark:border-zinc-700/50 border-zinc-200" aria-hidden="true">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold dark:text-white text-zinc-900 mb-1">{item.title}</h3>
                                    <p className="text-sm dark:text-zinc-400 text-zinc-600 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Trust & Verification */}
                <section aria-labelledby="trust-heading">
                    <div className="text-center mb-10">
                        <h2 id="trust-heading" className="text-3xl font-bold dark:text-white text-zinc-900 tracking-tight">Verified & Secure</h2>
                        <p className="mt-3 dark:text-zinc-400 text-zinc-600 text-base">Every line of generated code has been audited for correctness and safety.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            {
                                icon: <ICONS.Shield className="w-5 h-5 text-emerald-500" />,
                                title: 'Open Source Audited',
                                desc: 'Full source code on GitHub. Every script is transparent and inspectable.',
                            },
                            {
                                icon: <ICONS.EyeOff className="w-5 h-5 text-sky-500" />,
                                title: 'Zero Data Collection',
                                desc: 'Runs 100% client-side. No analytics, no telemetry, no tracking.',
                            },
                            {
                                icon: <ICONS.Lock className="w-5 h-5 text-violet-500" />,
                                title: 'Injection-Safe',
                                desc: 'All user input is sanitized against PowerShell injection attacks.',
                            },
                            {
                                icon: <ICONS.RotateCcw className="w-5 h-5 text-rose-500" />,
                                title: 'Fully Reversible',
                                desc: 'Registry-only policies. No destructive changes. Undo everything instantly.',
                            },
                        ].map((item, i) => (
                            <div key={i} className="text-center p-5 rounded-2xl dark:bg-zinc-900/40 bg-white border dark:border-zinc-800/50 border-zinc-200 transition-all duration-300 hover:dark:border-zinc-700/60 hover:border-zinc-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-none">
                                <div className="w-11 h-11 rounded-xl dark:bg-zinc-800 bg-zinc-100 flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                                    {item.icon}
                                </div>
                                <h3 className="text-sm font-semibold dark:text-white text-zinc-900 mb-1.5">{item.title}</h3>
                                <p className="text-xs dark:text-zinc-500 text-zinc-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
