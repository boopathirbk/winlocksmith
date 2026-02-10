import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        const script = generatePowerShellScript(state, previewMode);
        setPreviewScript(script);
    }, [state, previewMode]);

    // Scroll Spy
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

    // State Updates
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

    const handleCopy = () => navigator.clipboard.writeText(previewScript);

    const NavButton = ({ id, icon: Icon, label }: any) => (
        <button onClick={() => scrollToSection(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === id ? 'bg-slate-800 text-cyan-400 shadow-lg' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
            <Icon className="w-5 h-5" /> <span className="font-medium text-sm">{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col md:flex-row relative">
            <aside className="w-full md:w-64 lg:w-80 bg-slate-900/50 border-r border-slate-800 md:h-[calc(100vh-64px)] md:sticky md:top-16 flex-shrink-0">
                <div className="p-4 space-y-2">
                    <NavButton id="system" icon={ICONS.Cpu} label="Core Restrictions" />
                    <NavButton id="kiosk" icon={ICONS.Monitor} label="Kiosk & UI" />
                    <NavButton id="web" icon={ICONS.Globe} label="Browser & Web" />
                    <NavButton id="advanced" icon={ICONS.Settings} label="Admin & Audit" />
                    <div className="my-2 border-t border-slate-800/50"></div>
                    <button onClick={() => setIsRecoveryOpen(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-all">
                        <ICONS.Shield className="w-5 h-5" /> <span className="font-medium text-sm">Recovery Guide</span>
                    </button>
                </div>
            </aside>

            <div className="flex-1 p-6 md:p-12 pb-32 space-y-16 max-w-5xl mx-auto w-full">
                <section id="system" className="space-y-6 scroll-mt-24">
                    <div className="flex flex-col gap-2 border-b border-slate-800 pb-4">
                        <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-200 dark:text-white">
                            <ICONS.Cpu className="w-8 h-8 text-cyan-400" /> Core Restrictions
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">Manage access to physical ports, software installation, and application execution.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <ToggleCard title="USB Storage" icon={ICONS.Usb} color="cyan" checked={state.system.blockUsb} onChange={(v: boolean) => updateSystem('blockUsb', v)} description="Block USB drives (Standard Users Only)." />
                        <ToggleCard title="Peripheral Pairing" icon={ICONS.Printer} color="indigo" checked={state.system.allowPeripherals} onChange={(v: boolean) => updateSystem('allowPeripherals', v)} description="Allow users to pair Bluetooth audio/printers." />
                        <ToggleCard title="Microsoft Store" icon={ICONS.LayoutTemplate} color="purple" checked={state.system.blockStore} onChange={(v: boolean) => updateSystem('blockStore', v)} description="Blocks Microsoft Store and Consumer Features." />
                        <ToggleCard title="Block Executables (SRP)" icon={ICONS.Shield} color="red" checked={state.system.blockExecutables} onChange={(v: boolean) => updateSystem('blockExecutables', v)} description="Prevents users from running downloaded executables." />
                    </div>
                </section>
                <section id="kiosk" className="space-y-6 scroll-mt-24">
                    <div className="flex flex-col gap-2 border-b border-slate-800 pb-4">
                        <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-200 dark:text-white">
                            <ICONS.Monitor className="w-8 h-8 text-purple-400" /> Kiosk & Maintenance
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <ToggleCard title="Disable Updates" icon={ICONS.RefreshCwOff} color="amber" checked={state.kiosk.disableWindowsUpdate} onChange={(v: boolean) => updateKiosk('disableWindowsUpdate', v)} description="Prevents Windows Update from running automatically." />
                        <ToggleCard title="Disable Sleep" icon={ICONS.Moon} color="cyan" checked={state.kiosk.disableSleep} onChange={(v: boolean) => updateKiosk('disableSleep', v)} description="Keeps the device awake indefinitely (AC Power)." />
                        <ToggleCard title="Hide Desktop Icons" icon={ICONS.Monitor} color="purple" checked={state.kiosk.hideDesktopIcons} onChange={(v: boolean) => updateKiosk('hideDesktopIcons', v)} description="Hides all icons on the desktop." />
                        <ToggleCard title="Disable Context Menu" icon={ICONS.MousePointer2} color="purple" checked={state.kiosk.disableContextMenu} onChange={(v: boolean) => updateKiosk('disableContextMenu', v)} description="Prevents right-clicking on deskop/explorer." />
                        <ToggleCard title="Disable Notifications" icon={ICONS.BellOff} color="slate" checked={state.kiosk.disableNotifications} onChange={(v: boolean) => updateKiosk('disableNotifications', v)} description="Suppress system toast notifications." />
                        <ToggleCard title="Disable Telemetry" icon={ICONS.EyeOff} color="slate" checked={state.kiosk.disableTelemetry} onChange={(v: boolean) => updateKiosk('disableTelemetry', v)} description="Minimizes Windows data collection." />
                    </div>
                </section>
                <section id="web" className="space-y-6 scroll-mt-24">
                    <div className="flex flex-col gap-2 border-b border-slate-800 pb-4">
                        <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-200 dark:text-white">
                            <ICONS.Globe className="w-8 h-8 text-blue-400" /> Browser & Web
                        </h2>
                    </div>
                    <ToggleCard title="Enforce Edge Kiosk Mode" icon={ICONS.Globe} color="blue" checked={state.web.enforceEdge} onChange={(v: boolean) => updateWeb('enforceEdge', v)} description="Configures Edge to only allow specific websites." />

                    {state.web.enforceEdge && (
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
                            {/* URL Input */}
                            <div>
                                <h3 className="text-md font-semibold text-white mb-2">Whitelisted URLs</h3>
                                <div className="flex gap-2">
                                    <input type="text" id="urlInput" placeholder="example.com" className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white" onKeyDown={(e) => e.key === 'Enter' && addUrl(e.currentTarget.value)} />
                                    <button onClick={() => addUrl((document.getElementById('urlInput') as HTMLInputElement).value)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm">Add</button>
                                </div>
                                <div className="mt-2 space-y-1">
                                    {state.web.allowedUrls.map(url => (
                                        <div key={url} className="flex justify-between items-center text-sm p-2 bg-slate-900 rounded border border-slate-800">
                                            <span className="text-slate-300 font-mono">{url}</span>
                                            <button onClick={() => removeUrl(url)}><ICONS.XCircle className="w-4 h-4 text-slate-500 hover:text-red-400" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Toggles for Web */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <SimpleToggle label="Block File Uploads" checked={state.web.blockFileUploads} onChange={(v: boolean) => updateWeb('blockFileUploads', v)} />
                                <SimpleToggle label="Force Startup Pages" checked={state.web.forceStartup} onChange={(v: boolean) => updateWeb('forceStartup', v)} />
                                <SimpleToggle label="Allow PDF Listing" checked={state.web.allowPdfView} onChange={(v: boolean) => updateWeb('allowPdfView', v)} />
                                <SimpleToggle label="Force SmartScreen" checked={state.web.forceSmartScreen} onChange={(v: boolean) => updateWeb('forceSmartScreen', v)} />
                                <SimpleToggle label="Allow Password Manager" checked={state.web.allowPasswordManager} onChange={(v: boolean) => updateWeb('allowPasswordManager', v)} />
                            </div>
                        </div>
                    )}
                </section>
                <section id="advanced" className="space-y-6 scroll-mt-24">
                    <div className="flex flex-col gap-2 border-b border-slate-800 pb-4">
                        <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-200 dark:text-white">
                            <ICONS.Settings className="w-8 h-8 text-amber-400" /> Advanced
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <ToggleCard title="Prevent Admin Elevation" icon={ICONS.UserX} color="red" checked={state.advanced.preventUacBypass} onChange={(v: boolean) => updateAdvanced('preventUacBypass', v)} description="Denies UAC prompts for Standard Users." />
                        <ToggleCard title="Isolate User Data" icon={ICONS.EyeOff} color="red" checked={state.advanced.isolateUserFolders} onChange={(v: boolean) => updateAdvanced('isolateUserFolders', v)} description="Revokes Admin access to user folders." />
                        <ToggleCard title="Disable Task Manager" icon={ICONS.Activity} color="amber" checked={state.advanced.blockTaskMgr} onChange={(v: boolean) => updateAdvanced('blockTaskMgr', v)} description="Blocks Task Manager." />
                        <ToggleCard title="Disable CMD/PowerShell" icon={ICONS.Terminal} color="amber" checked={state.advanced.blockCmdPowershell} onChange={(v: boolean) => updateAdvanced('blockCmdPowershell', v)} description="Blocks Command Prompt." />
                        <ToggleCard title="Block Settings App" icon={ICONS.Settings} color="amber" checked={state.advanced.blockSettings} onChange={(v: boolean) => updateAdvanced('blockSettings', v)} description="Blocks Settings access." />
                    </div>
                </section>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 z-40 flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-2 max-w-7xl mx-auto w-full px-4">
                    <div className="hidden md:flex flex-col">
                        <span className="text-sm font-bold text-white">Ready to Deploy?</span>
                        <span className="text-xs text-slate-400">Review settings before downloading.</span>
                    </div>
                    <div className="flex-1"></div>
                    <button onClick={() => setShowPreviewModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors">
                        <ICONS.Terminal className="w-4 h-4" /> <span className="hidden sm:inline">Preview Script</span>
                    </button>
                    <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-700">
                        <ICONS.Copy className="w-4 h-4" /> <span className="hidden sm:inline">Copy</span>
                    </button>
                    <button onClick={handleDownloadBundle} className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-cyan-500/20">
                        <ICONS.Download className="w-4 h-4" /> Download Bundle
                    </button>
                </div>
            </div>

            {showPreviewModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl shadow-2xl max-h-[80vh] flex flex-col">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="font-bold text-white flex items-center gap-2"><ICONS.Terminal className="w-5 h-5 text-cyan-400" /> Script Preview</h3>
                            <button onClick={() => setShowPreviewModal(false)} className="text-slate-400 hover:text-white"><ICONS.XCircle className="w-6 h-6" /></button>
                        </div>
                        <div className="p-4 bg-slate-950 overflow-auto flex-1 font-mono text-xs text-cyan-300 whitespace-pre">{previewScript}</div>
                        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end gap-2">
                            <button onClick={() => setPreviewMode(previewMode === 'LOCK' ? 'UNLOCK' : 'LOCK')} className="px-4 py-2 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-sm">
                                Switch to {previewMode === 'LOCK' ? 'Restore' : 'Lockdown'} Script
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isRecoveryOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    {/* RECOVERY CONTENT */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Emergency Recovery</h2>
                        <p className="text-slate-300 mb-4">If you get locked out, boot into Safe Mode and run the Restore script.</p>
                        <button onClick={() => setIsRecoveryOpen(false)} className="px-4 py-2 bg-slate-800 text-white rounded">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper Components
const ToggleCard = ({ title, icon: Icon, color, checked, onChange, description }: any) => {
    const colors: any = {
        cyan: 'text-cyan-400 peer-checked:bg-cyan-500 border-cyan-500/50 shadow-cyan-500/10',
        indigo: 'text-indigo-400 peer-checked:bg-indigo-500 border-indigo-500/50 shadow-indigo-500/10',
        purple: 'text-purple-400 peer-checked:bg-purple-500 border-purple-500/50 shadow-purple-500/10',
        red: 'text-red-400 peer-checked:bg-red-500 border-red-500/50 shadow-red-500/10',
        amber: 'text-amber-400 peer-checked:bg-amber-500 border-amber-500/50 shadow-amber-500/10',
        slate: 'text-slate-400 peer-checked:bg-slate-500 border-slate-700',
        blue: 'text-blue-400 peer-checked:bg-blue-500 border-blue-500/50 shadow-blue-500/10'
    };
    const dotColor = colors[color] ? colors[color].split(' ')[1] : 'peer-checked:bg-cyan-500';

    return (
        <div className={`border rounded-xl p-6 transition-all ${checked ? `bg-slate-900 ${colors[color].split(' ').slice(2).join(' ')}` : 'bg-slate-900/50 border-slate-800'}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg"><Icon className={`w-6 h-6 ${colors[color].split(' ')[0]}`} /></div>
                    <h3 className="text-lg font-semibold text-slate-200 dark:text-white">{title}</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
                    <div className={`w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${dotColor}`}></div>
                </label>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    );
};

const SimpleToggle = ({ label, checked, onChange }: any) => (
    <div className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-800">
        <span className="text-sm text-slate-300">{label}</span>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
        </label>
    </div>
);

export default Config;
