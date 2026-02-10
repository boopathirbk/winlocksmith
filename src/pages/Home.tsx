import React from 'react';
import { Link } from 'react-router-dom';
import { ICONS } from '../constants';

const Home: React.FC = () => {
    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">

            {/* Hero Section */}
            <section className="text-center space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600 pb-2">
                    WinLocksmith
                </h1>
                <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto">
                    The ultimate open-source alternative to Intune. Generate powerful Windows hardening scripts, configure Kiosk modes, and secure your systems in seconds.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                    <Link to="/config" className="flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/20 transition-all hover:scale-105">
                        <ICONS.Wand2 className="w-6 h-6" /> Start Configuring
                    </Link>
                    <a href="https://github.com/boopathirbk/winlocksmith" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-lg border border-slate-700 transition-all">
                        <ICONS.Github className="w-6 h-6" /> View Source
                    </a>
                </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-3 gap-8">
                <FeatureCard
                    icon={<ICONS.Shield className="w-10 h-10 text-cyan-400" />}
                    title="System Hardening"
                    description="Disable Windows Update, Telemetry, and Sleep. Enforce SmartScreen and block administrative tools like RegEdit and CMD."
                />
                <FeatureCard
                    icon={<ICONS.Monitor className="w-10 h-10 text-pink-400" />}
                    title="Kiosk Mode"
                    description="Turn any Windows PC into a focused Kiosk. Whitelist specific websites, block file uploads, and restrict peripheral access."
                />
                <FeatureCard
                    icon={<ICONS.Lock className="w-10 h-10 text-emerald-400" />}
                    title="Access Control"
                    description="Block USB drives, Microsoft Store, and specific applications. Prevent unauthorized Admin elevation."
                />
            </section>

            {/* SEO Content */}
            <section className="prose prose-invert max-w-none">
                <h2 className="text-3xl font-bold text-center mb-8">Why WinLocksmith?</h2>
                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><ICONS.CheckCircle2 className="text-green-400" /> Offline & Private</h3>
                        <p className="text-slate-400">
                            WinLocksmith runs entirely in your browser. No data is sent to the cloud. You get a downloadable PowerShell script (`.ps1`) that you can inspect and run offline on any machine.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><ICONS.CheckCircle2 className="text-green-400" /> Edition Agnostic</h3>
                        <p className="text-slate-400">
                            Works on <strong>Windows Home, Pro, and Enterprise</strong>. We use intelligent fallbacks (like `ICACLS` permissions) for Home edition where Group Policy isn't available.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><ICONS.CheckCircle2 className="text-green-400" /> Free & Open Source</h3>
                        <p className="text-slate-400">
                            A 100% free alternative to expensive MDM solutions like Microsoft Intune. Perfect for small businesses, schools, and IT admins.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><ICONS.CheckCircle2 className="text-green-400" /> Reversible</h3>
                        <p className="text-slate-400">
                            Every download includes a `Restore.ps1` script. Made a mistake? Run the restore script to reset all changes instantly.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition-colors">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
);

export default Home;
