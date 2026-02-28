import React from 'react';
import { Link } from 'react-router-dom';
import { ICONS } from '../constants';

const Guide: React.FC = () => {
    return (
        <div className="py-16 px-4 max-w-4xl mx-auto space-y-12">

            {/* Hero */}
            <section className="text-center space-y-4" aria-labelledby="guide-title">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-sky-500/20" aria-hidden="true">
                    <ICONS.BookOpen className="w-7 h-7 text-white" />
                </div>
                <h1 id="guide-title" className="text-3xl md:text-4xl font-bold dark:text-white text-zinc-900 tracking-tight">
                    How to Use WinLocksmith
                </h1>
                <p className="text-base dark:text-zinc-400 text-zinc-600 max-w-xl mx-auto leading-relaxed">
                    A step-by-step guide to generating, customizing, and deploying Windows hardening scripts — in under 5 minutes.
                </p>
            </section>

            {/* Quick Start Steps */}
            <section className="space-y-6" aria-labelledby="quickstart-heading">
                <h2 id="quickstart-heading" className="text-xl font-bold dark:text-white text-zinc-900 flex items-center gap-2.5">
                    <ICONS.Zap className="w-5 h-5 text-amber-500" aria-hidden="true" /> Quick Start
                </h2>

                <div className="space-y-4">
                    <StepCard
                        step={1}
                        icon={<ICONS.Settings className="w-5 h-5 text-sky-500" />}
                        title="Choose Your Policies"
                        description="Head to the Configure page and toggle the security features you need. Options are grouped into four categories: Core Restrictions, Kiosk & Maintenance, Browser & Web, and Advanced."
                    >
                        <Example
                            title="Example: Shared Office Kiosk"
                            items={[
                                'Toggle "Block Executables" to prevent users from running downloaded files',
                                'Enable "Enforce Edge Kiosk Mode" and add your internal web app URLs to the whitelist',
                                'Turn on "Disable Context Menu" and "Hide Desktop Icons" for a clean kiosk interface',
                                'Enable "Force Safe DNS" to block adult content at the network level',
                            ]}
                        />
                    </StepCard>

                    <StepCard
                        step={2}
                        icon={<ICONS.FileText className="w-5 h-5 text-violet-500" />}
                        title="Preview Your Script"
                        description='Click the "Preview" button at the bottom of the Configure page to see exactly what PowerShell commands will be generated. You can switch between the Lockdown script and the Restore script.'
                    >
                        <Tip>
                            Always review the generated script before running it. WinLocksmith shows you every registry key, permission change, and policy it will apply — nothing is hidden.
                        </Tip>
                    </StepCard>

                    <StepCard
                        step={3}
                        icon={<ICONS.Download className="w-5 h-5 text-emerald-500" />}
                        title="Download & Run"
                        description='Click "Download Bundle" to get a ZIP file containing three files: Lockdown.ps1 (applies your policies), Restore.ps1 (reverses everything), and a README.txt with instructions.'
                    >
                        <CodeBlock title="Run on the target machine (as Administrator)">
                            {`# Right-click PowerShell → "Run as Administrator"\nSet-ExecutionPolicy Bypass -Scope Process -Force\n.\\Lockdown.ps1`}
                        </CodeBlock>
                    </StepCard>

                    <StepCard
                        step={4}
                        icon={<ICONS.RotateCcw className="w-5 h-5 text-rose-500" />}
                        title="Undo Anytime"
                        description="Made a mistake or need to remove restrictions? Run the Restore.ps1 script to cleanly reverse all changes. Every policy has a matching undo command."
                    >
                        <CodeBlock title="Restore everything">
                            {`Set-ExecutionPolicy Bypass -Scope Process -Force\n.\\Restore.ps1`}
                        </CodeBlock>
                    </StepCard>
                </div>
            </section>

            {/* Use Cases */}
            <section className="space-y-6" aria-labelledby="usecases-heading">
                <h2 id="usecases-heading" className="text-xl font-bold dark:text-white text-zinc-900 flex items-center gap-2.5">
                    <ICONS.Monitor className="w-5 h-5 text-violet-500" aria-hidden="true" /> Common Use Cases
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                    <UseCaseCard
                        icon={<ICONS.Monitor className="w-5 h-5 text-sky-500" />}
                        title="Library / Lab Kiosk"
                        description="Lock down a public computer so users can only browse allowed websites via Edge. Block USB drives, downloads, and application installs."
                        features={['Enforce Edge Kiosk Mode + URL Whitelist', 'Block USB + Block Executables', 'Disable Context Menu + Hide Desktop Icons']}
                    />
                    <UseCaseCard
                        icon={<ICONS.Shield className="w-5 h-5 text-emerald-500" />}
                        title="Office Workstation"
                        description="Harden employee PCs without Intune. Prevent unauthorized software, enforce safe browsing, and block admin elevation."
                        features={['Block Executables (SRP)', 'Force Safe DNS (Cloudflare Family)', 'Prevent Admin Elevation + Block Registry']}
                    />
                    <UseCaseCard
                        icon={<ICONS.User className="w-5 h-5 text-amber-500" />}
                        title="Parental Controls"
                        description="Create a child-safe Windows environment. Block adult content, restrict app usage, and prevent system changes."
                        features={['Force Safe DNS (adult content filter)', 'Block Other Browsers + Edge Blocklist', 'Block Settings App + Block CMD/PowerShell']}
                    />
                    <UseCaseCard
                        icon={<ICONS.Lock className="w-5 h-5 text-rose-500" />}
                        title="Point-of-Sale Terminal"
                        description="Turn a Windows PC into a single-purpose POS terminal. Only your POS web app runs, everything else is locked."
                        features={['Edge Kiosk Mode + single URL whitelist', 'Block All: USB, Store, Settings, Task Manager', 'Disable Sleep + Disable Updates']}
                    />
                </div>
            </section>

            {/* Windows Edition Notes */}
            <section className="dark:bg-zinc-900/40 bg-white dark:border-zinc-800/40 border-zinc-200 border rounded-2xl p-6 md:p-8" aria-labelledby="editions-heading">
                <h2 id="editions-heading" className="text-xl font-bold dark:text-white text-zinc-900 mb-5 flex items-center gap-2.5">
                    <ICONS.Cpu className="w-5 h-5 text-sky-500" aria-hidden="true" /> Windows Edition Compatibility
                </h2>
                <p className="text-sm dark:text-zinc-400 text-zinc-600 mb-5 leading-relaxed">
                    WinLocksmith automatically detects your Windows edition and applies the best available enforcement method:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl dark:bg-zinc-800/30 bg-zinc-50 border dark:border-zinc-800/40 border-zinc-100">
                        <h3 className="text-sm font-semibold dark:text-white text-zinc-900 mb-2 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-xs font-bold text-sky-500" aria-hidden="true">Pro</span>
                            Windows Pro / Enterprise
                        </h3>
                        <ul className="text-xs dark:text-zinc-400 text-zinc-600 space-y-1.5 leading-relaxed">
                            <li className="flex items-start gap-1.5"><ICONS.CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" aria-hidden="true" /> Full Group Policy + Software Restriction Policies</li>
                            <li className="flex items-start gap-1.5"><ICONS.CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" aria-hidden="true" /> SRP rules block executables system-wide</li>
                            <li className="flex items-start gap-1.5"><ICONS.CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" aria-hidden="true" /> Full RemovableStorageDevices policy for USB blocking</li>
                        </ul>
                    </div>
                    <div className="p-4 rounded-xl dark:bg-zinc-800/30 bg-zinc-50 border dark:border-zinc-800/40 border-zinc-100">
                        <h3 className="text-sm font-semibold dark:text-white text-zinc-900 mb-2 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-xs font-bold text-amber-500" aria-hidden="true">Home</span>
                            Windows Home
                        </h3>
                        <ul className="text-xs dark:text-zinc-400 text-zinc-600 space-y-1.5 leading-relaxed">
                            <li className="flex items-start gap-1.5"><ICONS.CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" aria-hidden="true" /> ICACLS execute-deny as SRP fallback</li>
                            <li className="flex items-start gap-1.5"><ICONS.CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" aria-hidden="true" /> Registry policies still apply for most features</li>
                            <li className="flex items-start gap-1.5"><ICONS.AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" aria-hidden="true" /> Some Group Policy features unavailable on Home</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Important Notes */}
            <section className="dark:bg-zinc-900/40 bg-white dark:border-zinc-800/40 border-zinc-200 border rounded-2xl p-6 md:p-8" aria-labelledby="notes-heading">
                <h2 id="notes-heading" className="text-xl font-bold dark:text-white text-zinc-900 mb-5 flex items-center gap-2.5">
                    <ICONS.AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" /> Important Notes
                </h2>
                <div className="space-y-4">
                    <NoteCard icon={<ICONS.Shield className="w-4 h-4 text-sky-500" />} title="Always run as Administrator">
                        The generated scripts modify Windows Registry and system permissions. They must be run in an elevated PowerShell session (right-click → Run as Administrator).
                    </NoteCard>
                    <NoteCard icon={<ICONS.FileText className="w-4 h-4 text-violet-500" />} title="Review before running">
                        Every generated script is plain-text PowerShell. Use the Preview feature or open the .ps1 file in any text editor to see exactly what it does. No hidden or obfuscated code.
                    </NoteCard>
                    <NoteCard icon={<ICONS.RotateCcw className="w-4 h-4 text-emerald-500" />} title="Keep the Restore script safe">
                        The Restore.ps1 script is your safety net. Store it somewhere accessible (e.g., a USB drive or network share) in case you need to quickly reverse policies.
                    </NoteCard>
                    <NoteCard icon={<ICONS.AlertTriangle className="w-4 h-4 text-amber-500" />} title="Smart App Control on Windows 11">
                        If Smart App Control (SAC) is enabled on Windows 11, it may override Software Restriction Policies. The script automatically detects and warns about this.
                    </NoteCard>
                </div>
            </section>

            {/* CTA */}
            <section className="text-center space-y-4 py-4">
                <h2 className="text-xl font-bold dark:text-white text-zinc-900">Ready to secure your Windows machines?</h2>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Link to="/config" className="group inline-flex items-center justify-center gap-2.5 px-7 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-semibold text-sm shadow-lg shadow-black/10 dark:shadow-white/5 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                        <ICONS.Wand2 className="w-4 h-4 transition-transform group-hover:rotate-12" aria-hidden="true" /> Start Configuring
                    </Link>
                    <Link to="/faq" className="inline-flex items-center justify-center gap-2.5 px-7 py-3 dark:bg-zinc-800/60 bg-zinc-100 dark:text-zinc-300 text-zinc-700 rounded-xl font-semibold text-sm border dark:border-zinc-700/50 border-zinc-300 transition-all duration-300 dark:hover:bg-zinc-800 hover:bg-zinc-200 active:scale-[0.98]">
                        <ICONS.HelpCircle className="w-4 h-4" aria-hidden="true" /> Read the FAQ
                    </Link>
                </div>
            </section>
        </div>
    );
};

/* --- Helper Components --- */

const StepCard = ({ step, icon, title, description, children }: { step: number; icon: React.ReactNode; title: string; description: string; children?: React.ReactNode }) => (
    <div className="dark:bg-zinc-900/40 bg-white dark:border-zinc-800/40 border-zinc-200 border rounded-2xl p-5 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <div className="flex sm:flex-col items-center gap-2 sm:gap-0 shrink-0" aria-hidden="true">
                <span className="w-10 h-10 rounded-xl dark:bg-zinc-800 bg-zinc-100 flex items-center justify-center border dark:border-zinc-700/50 border-zinc-200">
                    {icon}
                </span>
                <span className="text-[10px] font-bold dark:text-zinc-600 text-zinc-400 uppercase sm:mt-1.5 tracking-widest">Step {step}</span>
            </div>
            <div className="flex-1 min-w-0 w-full space-y-3">
                <h3 className="text-base font-semibold dark:text-white text-zinc-900">{title}</h3>
                <p className="text-sm dark:text-zinc-400 text-zinc-600 leading-relaxed">{description}</p>
                {children}
            </div>
        </div>
    </div>
);

const Example = ({ title, items }: { title: string; items: string[] }) => (
    <div className="mt-3 p-3 sm:p-4 dark:bg-zinc-800/30 bg-zinc-50 rounded-xl border dark:border-zinc-800/40 border-zinc-100">
        <p className="text-xs font-semibold dark:text-sky-400 text-sky-600 uppercase tracking-wider mb-2">{title}</p>
        <ul className="space-y-1.5">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm dark:text-zinc-400 text-zinc-600">
                    <ICONS.ArrowRight className="w-3.5 h-3.5 text-sky-500 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    </div>
);

const Tip = ({ children }: { children: React.ReactNode }) => (
    <div className="mt-3 flex items-start gap-2.5 p-3.5 dark:bg-emerald-500/5 bg-emerald-50 rounded-xl border dark:border-emerald-500/15 border-emerald-200">
        <ICONS.CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" aria-hidden="true" />
        <p className="text-xs dark:text-emerald-400 text-emerald-700 leading-relaxed">{children}</p>
    </div>
);

const CodeBlock = ({ title, children }: { title: string; children: string }) => (
    <div className="mt-3 rounded-xl overflow-hidden border dark:border-zinc-700/50 border-zinc-200">
        <div className="px-3 sm:px-4 py-2 dark:bg-zinc-800 bg-zinc-100 dark:text-zinc-400 text-zinc-600 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-2 overflow-hidden">
            <ICONS.Terminal className="w-3 h-3 shrink-0" aria-hidden="true" /> <span className="truncate">{title}</span>
        </div>
        <pre className="px-3 sm:px-4 py-3 dark:bg-zinc-900 bg-zinc-50 text-[11px] sm:text-xs font-mono dark:text-zinc-300 text-zinc-800 overflow-x-auto leading-relaxed whitespace-pre-wrap break-all sm:whitespace-pre sm:break-normal">
            <code>{children}</code>
        </pre>
    </div>
);

const UseCaseCard = ({ icon, title, description, features }: { icon: React.ReactNode; title: string; description: string; features: string[] }) => (
    <article className="dark:bg-zinc-900/40 bg-white dark:border-zinc-800/40 border-zinc-200 border rounded-2xl p-6 space-y-3 transition-all duration-300 hover:dark:border-zinc-700/80 hover:border-zinc-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-none">
        <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg dark:bg-zinc-800 bg-zinc-100 flex items-center justify-center" aria-hidden="true">{icon}</div>
            <h3 className="text-sm font-semibold dark:text-white text-zinc-900">{title}</h3>
        </div>
        <p className="text-xs dark:text-zinc-400 text-zinc-600 leading-relaxed">{description}</p>
        <div className="space-y-1.5 pt-1">
            {features.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-xs dark:text-zinc-500 text-zinc-500">
                    <ICONS.CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{f}</span>
                </div>
            ))}
        </div>
    </article>
);

const NoteCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
    <div className="flex gap-3 p-3 sm:p-4 rounded-xl dark:bg-zinc-800/20 bg-zinc-50 border dark:border-zinc-800/40 border-zinc-100">
        <div className="w-8 h-8 rounded-lg dark:bg-zinc-800 bg-white flex items-center justify-center shrink-0 border dark:border-zinc-700/50 border-zinc-200 hidden sm:flex" aria-hidden="true">{icon}</div>
        <div className="min-w-0">
            <h3 className="text-sm font-semibold dark:text-white text-zinc-900 mb-1">{title}</h3>
            <p className="text-xs dark:text-zinc-400 text-zinc-600 leading-relaxed">{children}</p>
        </div>
    </div>
);

export default Guide;
