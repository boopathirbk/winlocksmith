import React, { useState, useEffect, useCallback } from 'react';
import JSZip from 'jszip';
import { ICONS, INITIAL_STATE } from '../constants';
import { AppState, WebConfig, BlockConfig, AdvancedConfig, KioskConfig, ScriptMode } from '../types';
import { generatePowerShellScript } from '../utils/scriptBuilder';

const Config: React.FC = () => {
    const [state, setState] = useState<AppState>(INITIAL_STATE);
    const [activeSection, setActiveSection] = useState<string>('system');
    const [previewMode, setPreviewMode] = useState<ScriptMode>('LOCK');
    const [previewScript, setPreviewScript] = useState('');
    const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [copyTooltip, setCopyTooltip] = useState(false);

    useEffect(() => {
        const script = generatePowerShellScript(state, previewMode);
        setPreviewScript(script);
    }, [state, previewMode]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { root: null, threshold: 0.3, rootMargin: "-100px 0px -50% 0px" }
        );
        ['system', 'kiosk', 'web', 'advanced'].forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const updateSystem = (key: keyof BlockConfig, value: boolean) => setState(p => ({ ...p, system: { ...p.system, [key]: value } }));
    const updateAdvanced = (key: keyof AdvancedConfig, value: any) => setState(p => ({ ...p, advanced: { ...p.advanced, [key]: value } }));
    const updateKiosk = (key: keyof KioskConfig, value: boolean) => setState(p => ({ ...p, kiosk: { ...p.kiosk, [key]: value } }));
    const updateWeb = (key: keyof WebConfig, value: any) => setState(p => ({ ...p, web: { ...p.web, [key]: value } }));

    const addUrl = (url: string) => { if (url && !state.web.allowedUrls.includes(url)) updateWeb('allowedUrls', [...state.web.allowedUrls, url]); };
    const removeUrl = (url: string) => updateWeb('allowedUrls', state.web.allowedUrls.filter(u => u !== url));
    const addExtension = (id: string) => { if (id && !state.web.allowedExtensions.includes(id)) updateWeb('allowedExtensions', [...state.web.allowedExtensions, id]); };
    const removeExtension = (id: string) => updateWeb('allowedExtensions', state.web.allowedExtensions.filter(e => e !== id));
    const addBlockedApp = (app: string) => { if (app && !state.advanced.blockedAppList.includes(app)) updateAdvanced('blockedAppList', [...state.advanced.blockedAppList, app]); };
    const removeBlockedApp = (app: string) => updateAdvanced('blockedAppList', state.advanced.blockedAppList.filter(a => a !== app));

    const handleDownloadBundle = async () => {
        const zip = new JSZip();
        const lockdownScript = generatePowerShellScript(state, 'LOCK');
        const restoreScript = generatePowerShellScript(state, 'UNLOCK');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        zip.file(`Lockdown_${timestamp}.ps1`, lockdownScript);
        zip.file(`Restore_${timestamp}.ps1`, restoreScript);
        zip.file(`README.txt`, `WinLocksmith Configuration Package\nGenerated: ${timestamp}\n\nSee full instructions in the tool.`);
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `WinLocksmith_Bundle_${timestamp}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(previewScript);
        setCopyTooltip(true);
        setTimeout(() => setCopyTooltip(false), 1800);
    }, [previewScript]);

    // Close modals on Escape (WCAG 2.1.1)
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (showPreviewModal) setShowPreviewModal(false);
                if (isRecoveryOpen) setIsRecoveryOpen(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [showPreviewModal, isRecoveryOpen]);

    const NavButton = ({ id, icon: Icon, label }: any) => (
        <button onClick={() => scrollToSection(id)} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${activeSection === id
                ? 'dark:bg-zinc-800 bg-zinc-200/80 dark:text-white text-zinc-900'
                : 'dark:text-zinc-500 text-zinc-600 dark:hover:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:text-zinc-300 hover:text-zinc-900'
            }`}>
            <Icon className="w-4 h-4" aria-hidden="true" /> {label}
        </button>
    );

    return (
        <div className="flex flex-col md:flex-row relative">
            {/* Sidebar */}
            <aside className="w-full md:w-56 lg:w-64 dark:bg-zinc-900/30 bg-zinc-50 border-r dark:border-zinc-800/40 border-zinc-200 md:h-[calc(100vh-56px)] md:sticky md:top-14 flex-shrink-0" role="navigation" aria-label="Configuration sections">
                <div className="p-3 space-y-0.5">
                    <NavButton id="system" icon={ICONS.Cpu} label="Core Restrictions" />
                    <NavButton id="kiosk" icon={ICONS.Monitor} label="Kiosk & UI" />
                    <NavButton id="web" icon={ICONS.Globe} label="Browser & Web" />
                    <NavButton id="advanced" icon={ICONS.Settings} label="Admin & Audit" />
                    <div className="my-2 border-t dark:border-zinc-800/30 border-zinc-200" role="separator" />
                    <button onClick={() => setIsRecoveryOpen(true)} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/5 transition-all text-sm font-medium">
                        <ICONS.Shield className="w-4 h-4" aria-hidden="true" /> Recovery Guide
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 p-5 md:p-10 pb-28 space-y-14 max-w-5xl mx-auto w-full">

                {/* Core Restrictions */}
                <section id="system" className="space-y-5 scroll-mt-20" aria-labelledby="system-heading">
                    <SectionHeader id="system-heading" icon={ICONS.Cpu} color="text-sky-500" title="Core Restrictions" subtitle="Manage access to physical ports, software, and app execution." />
                    <div className="grid md:grid-cols-2 gap-4">
                        <ToggleCard title="USB Storage" icon={ICONS.Usb} accent="sky" checked={state.system.blockUsb} onChange={(v: boolean) => updateSystem('blockUsb', v)} description="Block USB drives for standard users." />
                        <ToggleCard title="Peripheral Pairing" icon={ICONS.Printer} accent="indigo" checked={state.system.allowPeripherals} onChange={(v: boolean) => updateSystem('allowPeripherals', v)} description="Allow Bluetooth audio & printer pairing." />
                        <ToggleCard title="Microsoft Store" icon={ICONS.LayoutTemplate} accent="violet" checked={state.system.blockStore} onChange={(v: boolean) => updateSystem('blockStore', v)} description="Block Store and consumer features." />
                        <ToggleCard title="Block Executables" icon={ICONS.Shield} accent="rose" checked={state.system.blockExecutables} onChange={(v: boolean) => updateSystem('blockExecutables', v)} description="Prevent running downloaded executables (SRP)." />
                    </div>
                </section>

                {/* Kiosk */}
                <section id="kiosk" className="space-y-5 scroll-mt-20" aria-labelledby="kiosk-heading">
                    <SectionHeader id="kiosk-heading" icon={ICONS.Monitor} color="text-violet-500" title="Kiosk & Maintenance" />
                    <div className="grid md:grid-cols-2 gap-4">
                        <ToggleCard title="Disable Updates" icon={ICONS.RefreshCwOff} accent="amber" checked={state.kiosk.disableWindowsUpdate} onChange={(v: boolean) => updateKiosk('disableWindowsUpdate', v)} description="Prevent Windows Update from running." />
                        <ToggleCard title="Disable Sleep" icon={ICONS.Moon} accent="sky" checked={state.kiosk.disableSleep} onChange={(v: boolean) => updateKiosk('disableSleep', v)} description="Keep device awake indefinitely." />
                        <ToggleCard title="Hide Desktop Icons" icon={ICONS.Monitor} accent="violet" checked={state.kiosk.hideDesktopIcons} onChange={(v: boolean) => updateKiosk('hideDesktopIcons', v)} description="Hide all desktop icons." />
                        <ToggleCard title="Disable Context Menu" icon={ICONS.MousePointer2} accent="violet" checked={state.kiosk.disableContextMenu} onChange={(v: boolean) => updateKiosk('disableContextMenu', v)} description="Block right-click on desktop." />
                        <ToggleCard title="Disable Notifications" icon={ICONS.BellOff} accent="zinc" checked={state.kiosk.disableNotifications} onChange={(v: boolean) => updateKiosk('disableNotifications', v)} description="Suppress toast notifications." />
                        <ToggleCard title="Disable Telemetry" icon={ICONS.EyeOff} accent="zinc" checked={state.kiosk.disableTelemetry} onChange={(v: boolean) => updateKiosk('disableTelemetry', v)} description="Minimize data collection." />
                    </div>
                </section>

                {/* Web */}
                <section id="web" className="space-y-5 scroll-mt-20" aria-labelledby="web-heading">
                    <SectionHeader id="web-heading" icon={ICONS.Globe} color="text-blue-500" title="Browser & Web" />
                    <ToggleCard title="Enforce Edge Kiosk Mode" icon={ICONS.Globe} accent="blue" checked={state.web.enforceEdge} onChange={(v: boolean) => updateWeb('enforceEdge', v)} description="Configure Edge to only allow specific websites." />

                    {state.web.enforceEdge && (
                        <div className="dark:bg-zinc-900/40 bg-white dark:border-zinc-800/40 border-zinc-200 border rounded-xl p-5 space-y-5">
                            <fieldset>
                                <legend className="text-sm font-semibold dark:text-white text-zinc-900 mb-2">Whitelisted URLs</legend>
                                <div className="flex gap-2">
                                    <label htmlFor="urlInput" className="sr-only">Enter URL to whitelist</label>
                                    <input type="text" id="urlInput" placeholder="example.com" className="flex-1 dark:bg-zinc-800/60 bg-zinc-50 border dark:border-zinc-700/50 border-zinc-300 rounded-lg px-3.5 py-2 text-sm dark:text-zinc-200 text-zinc-800 placeholder:dark:text-zinc-600 placeholder:text-zinc-400 outline-none focus:dark:border-sky-500/50 focus:border-sky-500 transition-colors font-mono" onKeyDown={(e) => e.key === 'Enter' && addUrl(e.currentTarget.value)} />
                                    <button onClick={() => addUrl((document.getElementById('urlInput') as HTMLInputElement).value)} className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-medium transition-colors">Add</button>
                                </div>
                                <div className="mt-2 space-y-1">
                                    {state.web.allowedUrls.map(url => (
                                        <div key={url} className="flex justify-between items-center text-sm p-2.5 dark:bg-zinc-800/40 bg-zinc-50 rounded-lg border dark:border-zinc-700/30 border-zinc-200">
                                            <span className="dark:text-zinc-300 text-zinc-700 font-mono text-xs">{url}</span>
                                            <button onClick={() => removeUrl(url)} aria-label={`Remove ${url}`}><ICONS.XCircle className="w-4 h-4 dark:text-zinc-600 text-zinc-400 hover:text-rose-500 transition-colors" /></button>
                                        </div>
                                    ))}
                                </div>
                            </fieldset>
                            <div className="grid md:grid-cols-2 gap-3">
                                <MiniToggle label="Block File Uploads" checked={state.web.blockFileUploads} onChange={(v: boolean) => updateWeb('blockFileUploads', v)} />
                                <MiniToggle label="Force Startup Pages" checked={state.web.forceStartup} onChange={(v: boolean) => updateWeb('forceStartup', v)} />
                                <MiniToggle label="Allow PDF Listing" checked={state.web.allowPdfView} onChange={(v: boolean) => updateWeb('allowPdfView', v)} />
                                <MiniToggle label="Force SmartScreen" checked={state.web.forceSmartScreen} onChange={(v: boolean) => updateWeb('forceSmartScreen', v)} />
                                <MiniToggle label="Allow Password Manager" checked={state.web.allowPasswordManager} onChange={(v: boolean) => updateWeb('allowPasswordManager', v)} />
                            </div>
                        </div>
                    )}
                </section>

                {/* Advanced */}
                <section id="advanced" className="space-y-5 scroll-mt-20" aria-labelledby="advanced-heading">
                    <SectionHeader id="advanced-heading" icon={ICONS.Settings} color="text-amber-500" title="Advanced" />
                    <div className="grid md:grid-cols-2 gap-4">
                        <ToggleCard title="Prevent Admin Elevation" icon={ICONS.UserX} accent="rose" checked={state.advanced.preventUacBypass} onChange={(v: boolean) => updateAdvanced('preventUacBypass', v)} description="Deny UAC prompts for standard users." />
                        <ToggleCard title="Isolate User Data" icon={ICONS.EyeOff} accent="rose" checked={state.advanced.isolateUserFolders} onChange={(v: boolean) => updateAdvanced('isolateUserFolders', v)} description="Revoke admin access to user folders." />
                        <ToggleCard title="Disable Task Manager" icon={ICONS.Activity} accent="amber" checked={state.advanced.blockTaskMgr} onChange={(v: boolean) => updateAdvanced('blockTaskMgr', v)} description="Block Task Manager access." />
                        <ToggleCard title="Disable CMD/PowerShell" icon={ICONS.Terminal} accent="amber" checked={state.advanced.blockCmdPowershell} onChange={(v: boolean) => updateAdvanced('blockCmdPowershell', v)} description="Block Command Prompt." />
                        <ToggleCard title="Block Settings App" icon={ICONS.Settings} accent="amber" checked={state.advanced.blockSettings} onChange={(v: boolean) => updateAdvanced('blockSettings', v)} description="Block Settings access." />
                    </div>
                </section>
            </div>

            {/* Sticky Footer Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40">
                <div className="dark:bg-zinc-900/90 bg-white/90 backdrop-blur-xl border-t dark:border-zinc-800/50 border-zinc-200 shadow-2xl shadow-black/10 dark:shadow-black/40">
                    <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto px-4 py-3">
                        <div className="hidden md:block">
                            <span className="text-sm font-semibold dark:text-white text-zinc-900">Ready to deploy?</span>
                            <span className="text-xs dark:text-zinc-500 text-zinc-500 ml-2">Review settings before downloading.</span>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                            <button onClick={() => setShowPreviewModal(true)} className="flex items-center gap-2 px-3.5 py-2 dark:bg-zinc-800 bg-zinc-100 dark:hover:bg-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 text-zinc-700 rounded-lg text-sm font-medium transition-colors border dark:border-zinc-700/50 border-zinc-300" aria-label="Preview generated script">
                                <ICONS.Terminal className="w-3.5 h-3.5" aria-hidden="true" /> <span className="hidden sm:inline">Preview</span>
                            </button>

                            {/* Copy with tooltip */}
                            <div className="tooltip relative">
                                <span className={`tooltip-text ${copyTooltip ? 'show' : ''}`} role="status" aria-live="polite">
                                    {copyTooltip ? '✓ Copied!' : ''}
                                </span>
                                <button onClick={handleCopy} className="flex items-center gap-2 px-3.5 py-2 dark:bg-zinc-800 bg-zinc-100 dark:hover:bg-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 text-zinc-700 rounded-lg text-sm font-medium transition-colors border dark:border-zinc-700/50 border-zinc-300" aria-label="Copy script to clipboard">
                                    <ICONS.Copy className="w-3.5 h-3.5" aria-hidden="true" /> <span className="hidden sm:inline">Copy</span>
                                </button>
                            </div>

                            <button onClick={handleDownloadBundle} className="flex items-center gap-2 px-5 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]" aria-label="Download lockdown and restore scripts as ZIP bundle">
                                <ICONS.Download className="w-3.5 h-3.5" aria-hidden="true" /> Download Bundle
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreviewModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowPreviewModal(false)} role="dialog" aria-modal="true" aria-labelledby="preview-title">
                    <div className="dark:bg-zinc-900 bg-white border dark:border-zinc-800 border-zinc-200 rounded-2xl w-full max-w-4xl shadow-2xl max-h-[80vh] flex flex-col animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <div className="p-4 border-b dark:border-zinc-800/50 border-zinc-200 flex justify-between items-center">
                            <h3 id="preview-title" className="font-semibold dark:text-white text-zinc-900 flex items-center gap-2 text-sm"><ICONS.Terminal className="w-4 h-4 text-sky-500" aria-hidden="true" /> Script Preview</h3>
                            <button onClick={() => setShowPreviewModal(false)} className="dark:text-zinc-500 text-zinc-400 hover:text-rose-500 transition-colors" aria-label="Close preview"><ICONS.XCircle className="w-5 h-5" /></button>
                        </div>
                        <div className="p-5 dark:bg-zinc-950 bg-zinc-50 overflow-auto flex-1 font-mono text-xs dark:text-sky-300/80 text-zinc-700 whitespace-pre leading-relaxed" role="region" aria-label="Generated PowerShell script">{previewScript}</div>
                        <div className="p-3 border-t dark:border-zinc-800/50 border-zinc-200 flex justify-end gap-2">
                            <button onClick={() => setPreviewMode(previewMode === 'LOCK' ? 'UNLOCK' : 'LOCK')} className="px-4 py-2 rounded-lg dark:bg-zinc-800 bg-zinc-100 border dark:border-zinc-700/50 border-zinc-300 dark:text-zinc-400 text-zinc-600 dark:hover:text-white hover:text-zinc-900 text-sm font-medium transition-colors">
                                Switch to {previewMode === 'LOCK' ? 'Restore' : 'Lockdown'} Script
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Recovery Modal */}
            {isRecoveryOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setIsRecoveryOpen(false)} role="dialog" aria-modal="true" aria-labelledby="recovery-title">
                    <div className="dark:bg-zinc-900 bg-white border dark:border-zinc-800 border-zinc-200 rounded-2xl w-full max-w-lg shadow-2xl p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <h2 id="recovery-title" className="text-lg font-semibold dark:text-white text-zinc-900 mb-3">Emergency Recovery</h2>
                        <p className="dark:text-zinc-400 text-zinc-600 text-sm leading-relaxed mb-5">If you get locked out, boot into <span className="font-mono dark:text-zinc-200 text-zinc-900 font-medium">Safe Mode</span> and run the Restore script as Administrator.</p>
                        <button onClick={() => setIsRecoveryOpen(false)} className="px-4 py-2 dark:bg-zinc-800 bg-zinc-100 dark:text-white text-zinc-800 rounded-lg text-sm font-medium transition-colors hover:dark:bg-zinc-700 hover:bg-zinc-200">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Helper Components ---

const SectionHeader = ({ id, icon: Icon, color, title, subtitle }: any) => (
    <div className="space-y-1 pb-3 border-b dark:border-zinc-800/40 border-zinc-200">
        <h2 id={id} className="text-xl font-semibold flex items-center gap-2.5 dark:text-white text-zinc-900 tracking-tight">
            <Icon className={`w-5 h-5 ${color}`} aria-hidden="true" /> {title}
        </h2>
        {subtitle && <p className="text-sm dark:text-zinc-400 text-zinc-600">{subtitle}</p>}
    </div>
);

const ToggleCard = ({ title, icon: Icon, accent, checked, onChange, description }: any) => {
    const accents: any = {
        sky: { active: 'dark:border-sky-500/30 border-sky-300', dot: 'bg-sky-500', track: 'bg-sky-500' },
        indigo: { active: 'dark:border-indigo-500/30 border-indigo-300', dot: 'bg-indigo-500', track: 'bg-indigo-500' },
        violet: { active: 'dark:border-violet-500/30 border-violet-300', dot: 'bg-violet-500', track: 'bg-violet-500' },
        rose: { active: 'dark:border-rose-500/30 border-rose-300', dot: 'bg-rose-500', track: 'bg-rose-500' },
        amber: { active: 'dark:border-amber-500/30 border-amber-300', dot: 'bg-amber-500', track: 'bg-amber-500' },
        blue: { active: 'dark:border-blue-500/30 border-blue-300', dot: 'bg-blue-500', track: 'bg-blue-500' },
        zinc: { active: 'dark:border-zinc-600 border-zinc-300', dot: 'bg-zinc-500', track: 'bg-zinc-500' },
    };
    const a = accents[accent] || accents.sky;
    const toggleId = `toggle-${title.replace(/\s+/g, '-').toLowerCase()}`;

    return (
        <div className={`rounded-xl p-5 transition-all duration-200 border ${checked
                ? `dark:bg-zinc-900/60 bg-white ${a.active} shadow-sm`
                : 'dark:bg-zinc-900/30 bg-white dark:border-zinc-800/40 border-zinc-200 hover:dark:border-zinc-700/60 hover:border-zinc-300'
            }`}>
            <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg dark:bg-zinc-800/80 bg-zinc-100 flex items-center justify-center" aria-hidden="true">
                        <Icon className={`w-4 h-4 ${checked ? `text-${accent}-500` : 'dark:text-zinc-500 text-zinc-400'}`} />
                    </div>
                    <label htmlFor={toggleId} className="text-sm font-semibold dark:text-white text-zinc-900 cursor-pointer">{title}</label>
                </div>
                <button
                    id={toggleId}
                    role="switch"
                    aria-checked={checked}
                    aria-label={`${title}: ${checked ? 'enabled' : 'disabled'}`}
                    onClick={() => onChange(!checked)}
                    className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 ${checked ? a.track : 'dark:bg-zinc-700 bg-zinc-300'}`}
                >
                    <span className={`absolute top-[3px] left-[3px] bg-white rounded-full w-4 h-4 shadow-sm transition-transform duration-200 ${checked ? 'translate-x-[18px]' : ''}`} />
                </button>
            </div>
            <p className="text-sm dark:text-zinc-400 text-zinc-600 leading-relaxed">{description}</p>
        </div>
    );
};

const MiniToggle = ({ label, checked, onChange }: any) => {
    const toggleId = `mini-${label.replace(/\s+/g, '-').toLowerCase()}`;
    return (
        <div className="flex items-center justify-between p-3 dark:bg-zinc-800/30 bg-zinc-50 rounded-lg border dark:border-zinc-700/30 border-zinc-200">
            <label htmlFor={toggleId} className="text-sm dark:text-zinc-300 text-zinc-700 cursor-pointer">{label}</label>
            <button
                id={toggleId}
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative w-8 h-[18px] rounded-full transition-colors duration-200 ${checked ? 'bg-sky-500' : 'dark:bg-zinc-700 bg-zinc-300'}`}
            >
                <span className={`absolute top-[2px] left-[2px] bg-white rounded-full w-[14px] h-[14px] shadow-sm transition-transform duration-200 ${checked ? 'translate-x-[14px]' : ''}`} />
            </button>
        </div>
    );
};

export default Config;
