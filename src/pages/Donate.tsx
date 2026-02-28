import React from 'react';
import { ICONS } from '../constants';

const Donate: React.FC = () => {
    return (
        <div className="py-12 px-4 max-w-4xl mx-auto space-y-10">

            {/* Hero */}
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20" aria-hidden="true">
                    <ICONS.Heart className="w-7 h-7 text-white fill-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold dark:text-white text-zinc-900 tracking-tight">
                    Support WinLocksmith
                </h1>
                <p className="text-base dark:text-zinc-400 text-zinc-600 max-w-xl mx-auto leading-relaxed">
                    WinLocksmith is <strong className="dark:text-zinc-200 text-zinc-800">100% free and open source</strong> — no ads, no premium tiers, no data collection.
                    Your donation directly funds development, testing, and infrastructure to keep this tool available for everyone.
                </p>
            </div>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { value: '100%', label: 'Free & Open Source', icon: ICONS.Unlock },
                    { value: '0', label: 'Ads & Trackers', icon: ICONS.EyeOff },
                    { value: '54+', label: 'Registry Policies', icon: ICONS.Shield },
                    { value: '∞', label: 'Devices Supported', icon: ICONS.Monitor },
                ].map(stat => (
                    <div key={stat.label} className="dark:bg-zinc-900/40 bg-white dark:border-zinc-800/40 border-zinc-200 border rounded-xl p-4 text-center">
                        <stat.icon className="w-5 h-5 mx-auto mb-2 dark:text-zinc-500 text-zinc-400" aria-hidden="true" />
                        <div className="text-xl font-bold dark:text-white text-zinc-900">{stat.value}</div>
                        <div className="text-xs dark:text-zinc-500 text-zinc-500 mt-0.5">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* What your donation supports */}
            <div className="dark:bg-zinc-900/40 bg-white dark:border-zinc-800/40 border-zinc-200 border rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-bold dark:text-white text-zinc-900 mb-5 flex items-center gap-2">
                    <ICONS.Wand2 className="w-5 h-5 text-sky-500" aria-hidden="true" />
                    What Your Donation Supports
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        { title: 'New Features & Policies', desc: 'Adding more Group Policy configurations, Firewall rules, and compliance presets (HIPAA, NIST, CIS benchmarks).', icon: ICONS.Settings, color: 'text-sky-500' },
                        { title: 'Windows 11 Compatibility', desc: 'Continuous testing across every Windows 11 build to ensure scripts work reliably after major updates.', icon: ICONS.Monitor, color: 'text-indigo-500' },
                        { title: 'Documentation & Guides', desc: 'Video tutorials, deployment guides, and integration docs for SCCM, Intune, and RMM tools.', icon: ICONS.HelpCircle, color: 'text-emerald-500' },
                        { title: 'Infrastructure & Hosting', desc: 'Domain costs, CDN, and CI/CD pipelines for automated testing and deployment.', icon: ICONS.Globe, color: 'text-amber-500' },
                        { title: 'Security Audits', desc: 'Regular script audits to ensure generated PowerShell code follows security best practices and doesn\'t introduce vulnerabilities.', icon: ICONS.ShieldAlert, color: 'text-rose-500' },
                        { title: 'Community Support', desc: 'Responding to GitHub issues, reviewing pull requests, and helping users troubleshoot deployments.', icon: ICONS.Heart, color: 'text-violet-500' },
                    ].map(item => (
                        <div key={item.title} className="flex gap-3 p-3 rounded-lg dark:hover:bg-zinc-800/30 hover:bg-zinc-50 transition-colors">
                            <div className="w-9 h-9 rounded-lg dark:bg-zinc-800 bg-zinc-100 flex items-center justify-center shrink-0" aria-hidden="true">
                                <item.icon className={`w-4 h-4 ${item.color}`} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold dark:text-white text-zinc-900 mb-0.5">{item.title}</h3>
                                <p className="text-xs dark:text-zinc-500 text-zinc-600 leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Roadmap */}
            <div className="dark:bg-zinc-900/40 bg-white dark:border-zinc-800/40 border-zinc-200 border rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-bold dark:text-white text-zinc-900 mb-5 flex items-center gap-2">
                    <ICONS.Activity className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                    Planned Roadmap
                </h2>
                <div className="space-y-3">
                    {[
                        { phase: 'v1.1', title: 'Firewall Rule Generator', status: 'In Progress', statusColor: 'text-amber-500 dark:bg-amber-500/10 bg-amber-50 border-amber-200 dark:border-amber-500/20' },
                        { phase: 'v1.2', title: 'CIS Benchmark Compliance Presets', status: 'Planned', statusColor: 'text-sky-500 dark:bg-sky-500/10 bg-sky-50 border-sky-200 dark:border-sky-500/20' },
                        { phase: 'v1.3', title: 'Multi-Machine Deployment Script (ZIP → MSI)', status: 'Planned', statusColor: 'text-sky-500 dark:bg-sky-500/10 bg-sky-50 border-sky-200 dark:border-sky-500/20' },
                        { phase: 'v1.4', title: 'Configuration Import/Export (JSON Profiles)', status: 'Planned', statusColor: 'text-sky-500 dark:bg-sky-500/10 bg-sky-50 border-sky-200 dark:border-sky-500/20' },
                        { phase: 'v2.0', title: 'Desktop App (Electron) with GUI Restore', status: 'Future', statusColor: 'text-violet-500 dark:bg-violet-500/10 bg-violet-50 border-violet-200 dark:border-violet-500/20' },
                    ].map(item => (
                        <div key={item.phase} className="flex items-center gap-3 p-3 rounded-lg dark:bg-zinc-800/20 bg-zinc-50">
                            <span className="text-xs font-mono font-bold dark:text-zinc-400 text-zinc-500 w-10 shrink-0">{item.phase}</span>
                            <span className="text-sm font-medium dark:text-white text-zinc-900 flex-1">{item.title}</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.statusColor}`}>{item.status}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Donate CTA */}
            <div className="relative dark:bg-zinc-900/40 bg-white dark:border-zinc-800/40 border-zinc-200 border rounded-2xl p-8 md:p-10 text-center overflow-hidden">
                {/* Glow */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-rose-500/8 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

                <div className="relative space-y-6">
                    <div>
                        <h2 className="text-xl font-bold dark:text-white text-zinc-900 mb-2">Ready to make a difference?</h2>
                        <p className="text-sm dark:text-zinc-400 text-zinc-600 max-w-md mx-auto">
                            Every contribution — no matter how small — helps keep WinLocksmith free, updated, and secure for thousands of IT professionals worldwide.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a
                            href="https://buymeacoffee.com/boopathirbk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#FFDD00] hover:bg-[#FFDD00]/85 text-zinc-900 rounded-xl font-semibold text-sm shadow-lg shadow-[#FFDD00]/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                            aria-label="Buy me a coffee (opens in new tab)"
                        >
                            <ICONS.Coffee className="w-4 h-4" aria-hidden="true" />
                            Buy me a coffee
                        </a>
                        <a
                            href="https://paypal.me/boopathirbk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-semibold text-sm shadow-lg shadow-black/10 dark:shadow-white/5 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                            aria-label="Donate via PayPal (opens in new tab)"
                        >
                            <ICONS.CreditCard className="w-4 h-4" aria-hidden="true" />
                            Donate via PayPal
                        </a>
                        <a
                            href="https://github.com/sponsors/boopathirbk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2.5 px-8 py-3.5 dark:bg-zinc-800/60 bg-zinc-100 dark:text-zinc-300 text-zinc-700 rounded-xl font-semibold text-sm border dark:border-zinc-700/50 border-zinc-300 transition-all duration-300 dark:hover:bg-zinc-800 hover:bg-zinc-200 active:scale-[0.98]"
                            aria-label="Sponsor on GitHub (opens in new tab)"
                        >
                            <ICONS.Github className="w-4 h-4" aria-hidden="true" />
                            Sponsor on GitHub
                        </a>
                    </div>

                    <p className="text-xs dark:text-zinc-600 text-zinc-400">
                        All donations are voluntary. WinLocksmith will always remain free.
                    </p>
                </div>
            </div>

            {/* Thank you */}
            <div className="text-center py-4">
                <p className="text-sm dark:text-zinc-500 text-zinc-600">
                    Thank you for supporting open-source security tools <span className="text-rose-500" aria-label="heart">♥</span>
                </p>
            </div>
        </div>
    );
};

export default Donate;
