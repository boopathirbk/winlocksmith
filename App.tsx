import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { ICONS, INITIAL_STATE } from './constants';
import { AppState, WebConfig, BlockConfig, AdvancedConfig, KioskConfig, ScriptMode } from './types';
import { generatePowerShellScript } from './utils/scriptBuilder';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [activeSection, setActiveSection] = useState<string>('system');

  // Script Preview State (UI only)
  const [previewMode, setPreviewMode] = useState<ScriptMode>('LOCK');
  const [previewScript, setPreviewScript] = useState('');

  // Recovery State
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);

  useEffect(() => {
    // Generate script based on current config and the selected preview mode
    const script = generatePowerShellScript(state, previewMode);
    setPreviewScript(script);
  }, [state, previewMode]);

  // Scroll Spy for Sidebar
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: document.querySelector('main'), // Observe within the main scrollable area
        threshold: 0.2
      }
    );

    const sections = ['system', 'kiosk', 'web', 'advanced', 'faq', 'script'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const updateSystem = (key: keyof BlockConfig, value: boolean) => {
    setState(prev => ({
      ...prev,
      system: { ...prev.system, [key]: value }
    }));
  };

  const updateAdvanced = (key: keyof AdvancedConfig, value: any) => {
    setState(prev => ({
      ...prev,
      advanced: { ...prev.advanced, [key]: value }
    }));
  };

  const updateKiosk = (key: keyof KioskConfig, value: boolean) => {
    setState(prev => ({
      ...prev,
      kiosk: { ...prev.kiosk, [key]: value }
    }));
  };

  const updateWeb = (key: keyof WebConfig, value: any) => {
    setState(prev => ({
      ...prev,
      web: { ...prev.web, [key]: value }
    }));
  };

  const addUrl = (url: string) => {
    if (url && !state.web.allowedUrls.includes(url)) {
      updateWeb('allowedUrls', [...state.web.allowedUrls, url]);
    }
  };

  const removeUrl = (url: string) => {
    updateWeb('allowedUrls', state.web.allowedUrls.filter(u => u !== url));
  };

  const addExtension = (id: string) => {
    if (id && !state.web.allowedExtensions.includes(id)) {
      updateWeb('allowedExtensions', [...state.web.allowedExtensions, id]);
    }
  };

  const removeExtension = (id: string) => {
    updateWeb('allowedExtensions', state.web.allowedExtensions.filter(e => e !== id));
  };

  const addBlockedApp = (app: string) => {
    if (app && !state.advanced.blockedAppList.includes(app)) {
      updateAdvanced('blockedAppList', [...state.advanced.blockedAppList, app]);
    }
  };

  const removeBlockedApp = (app: string) => {
    updateAdvanced('blockedAppList', state.advanced.blockedAppList.filter(a => a !== app));
  };

  const handleDownloadBundle = async () => {
    const zip = new JSZip();

    // Generate both scripts
    const lockdownScript = generatePowerShellScript(state, 'LOCK');
    const restoreScript = generatePowerShellScript(state, 'UNLOCK');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

    // Add files to zip
    zip.file(`Lockdown_${timestamp}.ps1`, lockdownScript);
    zip.file(`Restore_${timestamp}.ps1`, restoreScript);
    zip.file(`README.txt`, `WinLocksmith Configuration Package
Generated: ${timestamp}
Supported Editions: Windows Home, Pro, Enterprise, Education.

INSTRUCTIONS:
1. "Lockdown_....ps1" - Run this as Administrator.
   - It will identify all STANDARD USERS and apply UI/App restrictions to them.
   - Administrators will be BYPASSED for most restrictions (including USB).
   - Machine-wide policies (Updates, Telemetry) apply to everyone.
   
2. "Restore_....ps1" - Run this as Administrator to REMOVE restrictions from all users.

IMPORTANT NOTES:
- Automatic Detection: The script automatically checks your Windows Edition (Home vs Pro).
- BYOD / USB Access: USB Storage is blocked via User Policy (HKCU) for Standard Users only. Administrators can still use USB drives.
- UAC Bypass Protection: If enabled, Standard Users cannot use "Run as Administrator" to elevate privileges, effectively trapping them in the restricted session.
- User Data Isolation: If enabled, the Standard User's profile folder is locked down so Administrators cannot access it without explicitly taking ownership.
- Windows Home Users: Uses "ICACLS" workarounds to block execution in user folders.
- Pro/Enterprise Users: Uses standard Group Policy and SRP (Software Restriction Policies).
- New Users: If you add a new user AFTER running the script, you must run the script again to protect them.
- Emergency: If locked out, boot into Safe Mode to run the Restore script.
`);

    // Generate zip blob
    const content = await zip.generateAsync({ type: 'blob' });

    // Trigger download
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WinLocksmith_Bundle_${timestamp}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(previewScript);
  };

  const NavButton = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => scrollToSection(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === id
        ? 'bg-slate-800 text-cyan-400 shadow-lg shadow-black/20'
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
        }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row overflow-hidden">

      {/* Recovery Guide Modal */}
      {isRecoveryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ICONS.HelpCircle className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">Emergency Restore Guide</h2>
              </div>
              <button onClick={() => setIsRecoveryOpen(false)} className="text-slate-400 hover:text-white">
                <ICONS.XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-sm text-slate-300">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <h3 className="font-bold text-emerald-400 mb-2">The Deployment Bundle</h3>
                <p>When you download, you get a <strong>ZIP file</strong> containing two scripts: <code>Lockdown.ps1</code> and <code>Restore.ps1</code>. Keep both safe.</p>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <h3 className="font-bold text-amber-400 mb-2">Target Audience</h3>
                <p>Restrictions are applied to <strong>Standard Users</strong>. If you run the script as an Administrator, your own UI and Apps will usually remain unrestricted (except for machine-wide USB blocking).</p>
              </div>

              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <h3 className="font-bold text-red-400 mb-2">Emergency Safe Mode</h3>
                <p className="mb-2">If you somehow lock yourself out, follow these steps:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Restart your PC. While it boots, hold the Power button to force shut down. Repeat 3 times to trigger <strong>Windows Recovery Environment</strong>.</li>
                  <li>Go to <strong>Troubleshoot</strong> &gt; <strong>Advanced Options</strong> &gt; <strong>Startup Settings</strong> &gt; <strong>Restart</strong>.</li>
                  <li>Press <strong>4</strong> to enter <strong>Safe Mode</strong>.</li>
                  <li>In Safe Mode, restrictions are disabled. Run the Restore script from your ZIP bundle.</li>
                </ol>
              </div>
            </div>
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button onClick={() => setIsRecoveryOpen(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-auto md:h-screen sticky top-0 z-40">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20">
              <ICONS.Lock className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">WinLocksmith</h1>
              <p className="text-xs text-slate-500">SysAdmin Tool</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-2 flex-1 overflow-y-auto">
          <NavButton id="system" icon={ICONS.Cpu} label="Core Restrictions" />
          <NavButton id="kiosk" icon={ICONS.Monitor} label="Kiosk & UI" />
          <NavButton id="web" icon={ICONS.Globe} label="Browser & Web" />
          <NavButton id="advanced" icon={ICONS.Settings} label="Admin & Audit" />

          <div className="my-2 border-t border-slate-800/50"></div>

          <NavButton id="faq" icon={ICONS.HelpCircle} label="FAQ & Help" />
          <NavButton id="script" icon={ICONS.Terminal} label="Script Output" />

          <div className="pt-4 mt-4 border-t border-slate-800">
            <button
              onClick={() => setIsRecoveryOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-all"
            >
              <ICONS.Shield className="w-5 h-5" />
              <span className="font-medium">Recovery Guide</span>
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800">
          {/* AI Security Audit button removed */}
        </div>
      </aside>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto scroll-smooth h-screen">
        <div className="max-w-5xl mx-auto p-6 md:p-12 space-y-16">

          {/* SECTION 1: SYSTEM */}
          <section id="system" className="space-y-6 pt-4">
            <div className="flex flex-col gap-2 border-b border-slate-800 pb-4">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <ICONS.Cpu className="w-8 h-8 text-cyan-400" /> Core Restrictions
              </h2>
              <p className="text-slate-400">Manage access to physical ports, software installation, and application execution.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* USB Control Card */}
              <div className={`border rounded-xl p-6 relative overflow-hidden group transition-all ${state.system.blockUsb ? 'bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-500/10' : 'bg-slate-900 border-slate-800'
                }`}>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ICONS.Usb className="w-24 h-24 text-cyan-500" />
                </div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <ICONS.Usb className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">USB Storage</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={state.system.blockUsb}
                      onChange={(e) => updateSystem('blockUsb', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-400 relative z-10">
                  Block USB drives (Standard Users Only). Administrators can still access USB storage.
                </p>
              </div>

              {/* Printer & Bluetooth Pairing Card */}
              <div className={`border rounded-xl p-6 relative overflow-hidden group transition-all ${state.system.allowPeripherals ? 'bg-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'bg-slate-900 border-slate-800'
                }`}>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ICONS.Printer className="w-24 h-24 text-indigo-500" />
                </div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <ICONS.Printer className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Peripheral Pairing</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={state.system.allowPeripherals}
                      onChange={(e) => updateSystem('allowPeripherals', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-400 relative z-10 mb-2">
                  Allow users to pair Bluetooth audio/printers.
                  <br /><span className="text-xs text-orange-400 flex items-center gap-1 mt-1"><ICONS.Shield className="w-3 h-3" /> File Transfer (fsquirt.exe) is always blocked.</span>
                </p>
                {state.advanced.blockSettings && state.system.allowPeripherals && (
                  <p className="text-xs text-indigo-400 relative z-10 bg-indigo-500/10 p-2 rounded border border-indigo-500/20">
                    Note: Since "Block Settings" is ON, this will expose <u>only</u> the Bluetooth & Printer pages in Settings.
                  </p>
                )}
              </div>

              {/* App Store Card */}
              <div className={`border rounded-xl p-6 relative overflow-hidden group transition-all ${state.system.blockStore ? 'bg-slate-900 border-purple-500/50 shadow-lg shadow-purple-500/10' : 'bg-slate-900 border-slate-800'
                }`}>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ICONS.LayoutTemplate className="w-24 h-24 text-purple-500" />
                </div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <ICONS.LayoutTemplate className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Microsoft Store</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={state.system.blockStore}
                      onChange={(e) => updateSystem('blockStore', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-400 relative z-10">
                  Blocks Microsoft Store and <span className="text-purple-300">Consumer Features</span> (Sponsored Apps like Candy Crush) to ensure a clean Start Menu.
                </p>
              </div>

              {/* Executable Blocking Card */}
              <div className={`border rounded-xl p-6 relative overflow-hidden group transition-all ${state.system.blockExecutables ? 'bg-slate-900 border-red-500/50 shadow-lg shadow-red-500/10' : 'bg-slate-900 border-slate-800'
                }`}>
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <ICONS.Shield className="w-32 h-32 text-red-500" />
                </div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <ICONS.Shield className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">SRP</h3>
                      <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                        <ICONS.AlertTriangle className="w-3 h-3" /> Block .exe
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={state.system.blockExecutables}
                      onChange={(e) => updateSystem('blockExecutables', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-400 mb-4 relative z-10">
                  Prevents users from running downloaded executables.
                </p>

                {state.system.blockExecutables && (
                  <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-700/50 relative z-10 animate-in fade-in slide-in-from-top-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900 bg-slate-800"
                        checked={state.system.strictMode}
                        onChange={(e) => updateSystem('strictMode', e.target.checked)}
                      />
                      <span className="text-sm font-medium text-slate-200">Strict Whitelist</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 2: KIOSK */}
          <section id="kiosk" className="space-y-6">
            <div className="flex flex-col gap-2 border-b border-slate-800 pb-4">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <ICONS.Monitor className="w-8 h-8 text-purple-400" /> Kiosk & Maintenance
              </h2>
              <p className="text-slate-400">Configure OS behavior, power settings, visual clutter, and updates.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Windows Update */}
              <div className={`border rounded-xl p-6 transition-all ${state.kiosk.disableWindowsUpdate ? 'bg-slate-900 border-amber-500/50' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg"><ICONS.RefreshCwOff className="w-6 h-6 text-amber-400" /></div>
                    <h3 className="text-lg font-semibold text-white">Disable Updates</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={state.kiosk.disableWindowsUpdate} onChange={(e) => updateKiosk('disableWindowsUpdate', e.target.checked)} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-400">Prevents Windows Update from running automatically (Machine Policy).</p>
              </div>

              {/* Sleep Mode */}
              <div className={`border rounded-xl p-6 transition-all ${state.kiosk.disableSleep ? 'bg-slate-900 border-cyan-500/50' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg"><ICONS.Moon className="w-6 h-6 text-cyan-400" /></div>
                    <h3 className="text-lg font-semibold text-white">Disable Sleep</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={state.kiosk.disableSleep} onChange={(e) => updateKiosk('disableSleep', e.target.checked)} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-400">Keeps the device awake indefinitely (AC Power).</p>
              </div>

              {/* Desktop Icons */}
              <div className={`border rounded-xl p-6 transition-all ${state.kiosk.hideDesktopIcons ? 'bg-slate-900 border-purple-500/50' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg"><ICONS.Monitor className="w-6 h-6 text-purple-400" /></div>
                    <h3 className="text-lg font-semibold text-white">Hide Desktop Icons</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={state.kiosk.hideDesktopIcons} onChange={(e) => updateKiosk('hideDesktopIcons', e.target.checked)} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-400">Hides all icons on the desktop for a cleaner kiosk look (Standard User Only).</p>
              </div>

              {/* Context Menu */}
              <div className={`border rounded-xl p-6 transition-all ${state.kiosk.disableContextMenu ? 'bg-slate-900 border-purple-500/50' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg"><ICONS.MousePointer2 className="w-6 h-6 text-purple-400" /></div>
                    <h3 className="text-lg font-semibold text-white">Disable Context Menu</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={state.kiosk.disableContextMenu} onChange={(e) => updateKiosk('disableContextMenu', e.target.checked)} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-400">Prevents right-clicking on the desktop and explorer (Standard User Only).</p>
              </div>

              {/* Notifications */}
              <div className={`border rounded-xl p-6 transition-all ${state.kiosk.disableNotifications ? 'bg-slate-900 border-slate-700' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg"><ICONS.BellOff className="w-6 h-6 text-slate-400" /></div>
                    <h3 className="text-lg font-semibold text-white">Disable Notifications</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={state.kiosk.disableNotifications} onChange={(e) => updateKiosk('disableNotifications', e.target.checked)} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-400">Suppress system toast notifications (Standard User Only).</p>
              </div>

              {/* Telemetry */}
              <div className={`border rounded-xl p-6 transition-all ${state.kiosk.disableTelemetry ? 'bg-slate-900 border-slate-700' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg"><ICONS.EyeOff className="w-6 h-6 text-slate-400" /></div>
                    <h3 className="text-lg font-semibold text-white">Disable Telemetry</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={state.kiosk.disableTelemetry} onChange={(e) => updateKiosk('disableTelemetry', e.target.checked)} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-400">Minimizes Windows data collection (Machine Policy).</p>
              </div>
            </div>
          </section>

          {/* SECTION 3: WEB */}
          <section id="web" className="space-y-6">
            <div className="flex flex-col gap-2 border-b border-slate-800 pb-4">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <ICONS.Globe className="w-8 h-8 text-blue-400" /> Browser & Web
              </h2>
              <p className="text-slate-400">Configure Microsoft Edge kiosk mode and whitelist specific domains.</p>
            </div>

            <div className="space-y-6">
              <div className={`border rounded-xl p-6 transition-all ${state.web.enforceEdge ? 'bg-slate-900 border-blue-500/50 shadow-lg shadow-blue-500/10' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg"><ICONS.Globe className="w-6 h-6 text-blue-400" /></div>
                    <h3 className="text-lg font-semibold text-white">Enforce Edge Kiosk Mode</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={state.web.enforceEdge} onChange={(e) => updateWeb('enforceEdge', e.target.checked)} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-400 mb-2">
                  Configures Microsoft Edge to only allow specific websites.
                  <br />
                  <span className="text-xs text-blue-400">Note: This blocks all extensions and developer tools.</span>
                </p>
              </div>

              {state.web.enforceEdge && (
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6 animate-in fade-in slide-in-from-top-2">
                  <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
                    <ICONS.CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Whitelisted URLs
                  </h3>

                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      id="urlInput"
                      placeholder="example.com or [*.]example.com"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addUrl(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById('urlInput') as HTMLInputElement;
                        addUrl(input.value);
                        input.value = '';
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Add URL
                    </button>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs text-slate-500 mb-2">Valid formats:</p>
                    <ul className="text-xs text-slate-400 space-y-1 font-mono bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                      <li className="flex gap-2"><span className="text-emerald-400">example.com</span> <span>- Allow specific domain</span></li>
                      <li className="flex gap-2"><span className="text-emerald-400">https://example.com/page</span> <span>- Allow specific path</span></li>
                      <li className="flex gap-2"><span className="text-emerald-400">[*.]example.com</span> <span>- Allow domain & all subdomains</span></li>
                      <li className="flex gap-2"><span className="text-emerald-400">file:///C:/Kiosk/index.html</span> <span>- Allow local file</span></li>
                    </ul>
                  </div>

                  <div className="space-y-2 mb-8">
                    {state.web.allowedUrls.map((url) => (
                      <div key={url} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800 group hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span className="text-sm font-mono text-slate-300 truncate">{url}</span>
                        </div>
                        <button
                          onClick={() => removeUrl(url)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1"
                        >
                          <ICONS.XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {state.web.allowedUrls.length === 0 && (
                      <p className="text-sm text-red-400 text-center py-4 border border-red-500/20 rounded-lg bg-red-500/5">
                        Warning: No URLs allowed. Edge will block everything.
                      </p>
                    )}
                  </div>

                  {/* --- EXTENSIONS SECTION --- */}
                  <div className="border-t border-slate-800 pt-6">
                    <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
                      <ICONS.Puzzle className="w-5 h-5 text-blue-400" />
                      Allowed Extensions
                    </h3>

                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        id="extInput"
                        placeholder="e.g. ocalyw... (Extension ID)"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addExtension(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById('extInput') as HTMLInputElement;
                          addExtension(input.value);
                          input.value = '';
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Add ID
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 mb-4">
                      Enter the 32-character Extension ID found in the Edge Add-ons store URL.
                    </p>

                    <div className="space-y-2 mb-8">
                      {state.web.allowedExtensions.map((ext) => (
                        <div key={ext} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800 group hover:border-slate-700 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-sm font-mono text-slate-300 truncate">{ext}</span>
                          </div>
                          <button
                            onClick={() => removeExtension(ext)}
                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                          >
                            <ICONS.XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {state.web.allowedExtensions.length === 0 && (
                        <div className="text-center py-4 border border-slate-800 rounded-lg bg-slate-900/50">
                          <p className="text-sm text-slate-500">No extensions allowed.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* --- PDF SETTINGS --- */}
                  <div className="border-t border-slate-800 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-md font-semibold text-white flex items-center gap-2">
                          <ICONS.UploadCloud className="w-5 h-5 text-blue-400" />
                          Block File Uploads
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Prevents users from uploading files to websites (disables file selection dialogs).
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={state.web.blockFileUploads}
                          onChange={(e) => updateWeb('blockFileUploads', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                  </div>

                  {/* Force Startup Toggle */}
                  <div className="border-t border-slate-800 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-md font-semibold text-white flex items-center gap-2">
                          <ICONS.Play className="w-5 h-5 text-blue-400" />
                          Force Open Allowed Sites on Startup
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          If checked, Edge will automatically open your allowed URLs when it starts.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={state.web.forceStartup}
                          onChange={(e) => updateWeb('forceStartup', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                  </div>

                  {/* --- PDF SETTINGS --- */}
                  <div className="border-t border-slate-800 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-md font-semibold text-white flex items-center gap-2">
                          <ICONS.Copy className="w-5 h-5 text-blue-400" />
                          Allow PDF Viewing
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Whitelist local file URLs (file://) so users can open PDFs in Edge.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={state.web.allowPdfView}
                          onChange={(e) => updateWeb('allowPdfView', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Corporate Policy Section */}
            <div className="border-t border-slate-800 pt-6">
              <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
                <ICONS.Shield className="w-5 h-5 text-emerald-400" />
                Corporate Security
              </h3>

              <div className="space-y-4">
                {/* SmartScreen Toggle */}
                <div className="flex items-center space-x-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                  <input
                    type="checkbox"
                    id="forceSmartScreen"
                    className="w-4 h-4 text-emerald-600 bg-slate-700 border-slate-600 rounded focus:ring-emerald-600 ring-offset-slate-800 focus:ring-2"
                    checked={state.web.forceSmartScreen}
                    onChange={(e) => updateWeb('forceSmartScreen', e.target.checked)}
                  />
                  <label htmlFor="forceSmartScreen" className="text-sm font-medium text-slate-300 cursor-pointer select-none flex-1">
                    Force Microsoft Defender SmartScreen
                    <p className="text-xs text-slate-500 font-normal mt-0.5">
                      Enforces Phishing & Malware protection. Users cannot disable it.
                    </p>
                  </label>
                </div>

                {/* Password Manager Toggle */}
                <div className="flex items-center space-x-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                  <input
                    type="checkbox"
                    id="allowPasswordManager"
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-600 ring-offset-slate-800 focus:ring-2"
                    checked={state.web.allowPasswordManager}
                    onChange={(e) => updateWeb('allowPasswordManager', e.target.checked)}
                  />
                  <label htmlFor="allowPasswordManager" className="text-sm font-medium text-slate-300 cursor-pointer select-none flex-1">
                    Allow Password Manager
                    <p className="text-xs text-slate-500 font-normal mt-0.5">
                      Permit users to save passwords. (Unchecked = Passwords Blocked)
                    </p>
                  </label>
                </div>
              </div>
            </div>

          </section>

          {/* SECTION 4: ADVANCED */}
          <section id="advanced" className="space-y-6">
            <div className="flex flex-col gap-2 border-b border-slate-800 pb-4">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <ICONS.Settings className="w-8 h-8 text-amber-400" /> Advanced Administration
              </h2>
              <p className="text-slate-400">Deep system restrictions for kiosk environments (Task Manager, CMD, etc).</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Prevent Admin Elevation (Anti-Bypass) */}
              <div className={`border rounded-xl p-6 transition-all ${state.advanced.preventUacBypass ? 'bg-slate-900 border-red-500/50' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg"><ICONS.UserX className="w-6 h-6 text-red-400" /></div>
                    <h3 className="text-lg font-semibold text-white">Prevent Admin Elevation</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={state.advanced.preventUacBypass} onChange={(e) => updateAdvanced('preventUacBypass', e.target.checked)} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-400 mb-2">
                  <span className="text-red-400 font-bold">Critical for BYOD:</span> Automatically denies all "Run as Administrator" requests for Standard Users.
                </p>
                <p className="text-xs text-slate-500">
                  Prevents users who know the Admin password from elevating privileges within the Standard User session. They must log out and log in as Admin to make changes.
                </p>
              </div>

              {/* Isolate User Folders */}
              <div className={`border rounded-xl p-6 transition-all ${state.advanced.isolateUserFolders ? 'bg-slate-900 border-red-500/50' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg"><ICONS.EyeOff className="w-6 h-6 text-red-400" /></div>
                    <h3 className="text-lg font-semibold text-white">Isolate User Data</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={state.advanced.isolateUserFolders} onChange={(e) => updateAdvanced('isolateUserFolders', e.target.checked)} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-400 mb-2">
                  <span className="text-red-400 font-bold">Privacy Mode:</span> Revokes "Administrators" access to the Standard User's profile folder.
                </p>
                <p className="text-xs text-slate-500">
                  Ensures that even Admins cannot easily browse the files of BYOD users without taking ownership (which leaves an audit trail).
                </p>
              </div>

              {/* Task Manager */}
              <div className={`border rounded-xl p-6 transition-all ${state.advanced.blockTaskMgr ? 'bg-slate-900 border-amber-500/50' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg"><ICONS.Activity className="w-6 h-6 text-amber-400" /></div>
                    <h3 className="text-lg font-semibold text-white">Disable Task Manager</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={state.advanced.blockTaskMgr} onChange={(e) => updateAdvanced('blockTaskMgr', e.target.checked)} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-400">Prevents users from opening Task Manager (Standard Users Only).</p>
              </div>

              {/* CMD / Powershell */}
              <div className={`border rounded-xl p-6 transition-all ${state.advanced.blockCmdPowershell ? 'bg-slate-900 border-amber-500/50' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg"><ICONS.Terminal className="w-6 h-6 text-amber-400" /></div>
                    <h3 className="text-lg font-semibold text-white">Disable CMD</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={state.advanced.blockCmdPowershell} onChange={(e) => updateAdvanced('blockCmdPowershell', e.target.checked)} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-400">Blocks Command Prompt execution. Admins can bypass via Policy Scope.</p>
              </div>

              {/* Block Settings App */}
              <div className={`border rounded-xl p-6 transition-all ${state.advanced.blockSettings ? 'bg-slate-900 border-amber-500/50' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg"><ICONS.Settings className="w-6 h-6 text-amber-400" /></div>
                    <h3 className="text-lg font-semibold text-white">Block Settings</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={state.advanced.blockSettings} onChange={(e) => updateAdvanced('blockSettings', e.target.checked)} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-400">Prevents access to the Settings App (and Control Panel) for Standard Users.</p>
              </div>

              {/* Block Control Panel */}
              <div className={`border rounded-xl p-6 transition-all ${state.advanced.blockControlPanel ? 'bg-slate-900 border-amber-500/50' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg"><ICONS.Sliders className="w-6 h-6 text-amber-400" /></div>
                    <h3 className="text-lg font-semibold text-white">Block Control Panel</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={state.advanced.blockControlPanel} onChange={(e) => updateAdvanced('blockControlPanel', e.target.checked)} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-400">Prevents access to the Control Panel (and Settings App) for Standard Users.</p>
              </div>

              {/* Registry Tools */}
              <div className={`border rounded-xl p-6 transition-all ${state.advanced.blockRegistryTools ? 'bg-slate-900 border-amber-500/50' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg"><ICONS.Lock className="w-6 h-6 text-amber-400" /></div>
                    <h3 className="text-lg font-semibold text-white">Block Regedit</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={state.advanced.blockRegistryTools} onChange={(e) => updateAdvanced('blockRegistryTools', e.target.checked)} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-400">
                  <span className="text-red-400 font-bold">Warning:</span> Blocks Registry Editor (Standard Users Only).
                </p>
              </div>

              {/* Block Specific Apps */}
              <div className={`md:col-span-2 border rounded-xl p-6 transition-all ${state.advanced.blockSpecificApps ? 'bg-slate-900 border-red-500/50' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg"><ICONS.Ban className="w-6 h-6 text-red-400" /></div>
                    <h3 className="text-lg font-semibold text-white">Block Specific Applications</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={state.advanced.blockSpecificApps} onChange={(e) => updateAdvanced('blockSpecificApps', e.target.checked)} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>

                {state.advanced.blockSpecificApps ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <p className="text-sm text-slate-400">
                      Prevent the following executables from running (Standard Users Only). This uses the <code>DisallowRun</code> explorer policy.
                    </p>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="appInput"
                        placeholder="e.g. discord.exe, notepad.exe"
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addBlockedApp(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById('appInput') as HTMLInputElement;
                          addBlockedApp(input.value);
                          input.value = '';
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Block App
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                      {state.advanced.blockedAppList.map((app) => (
                        <div key={app} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 group">
                          <span className="text-sm font-mono text-slate-300">{app}</span>
                          <button
                            onClick={() => removeBlockedApp(app)}
                            className="text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <ICONS.XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      {state.advanced.blockedAppList.length === 0 && (
                        <div className="col-span-full p-4 text-center border-2 border-dashed border-slate-800 rounded-lg text-slate-600 text-sm">
                          No applications added. The toggle is on but no apps are blocked.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">Enable this to define a custom list of prohibited executables.</p>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 5: FAQ */}
          <section id="faq" className="space-y-6">
            <div className="flex flex-col gap-2 border-b border-slate-800 pb-4">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <ICONS.HelpCircle className="w-8 h-8 text-emerald-400" /> FAQ & Help
              </h2>
              <p className="text-slate-400">Common questions about deployment, recovery, and script behavior.</p>
            </div>

            <div className="grid gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                  <ICONS.Wand2 className="w-5 h-5 text-cyan-400" />
                  How does it verify my Windows Edition?
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  The generated script contains a detection block that reads <code>HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion</code> to check the <code>EditionID</code>.
                  <br />
                  If it detects a "Core" edition (Home), it activates the <code>ICACLS</code> workaround mode. If it detects "Pro", "Enterprise", or "Education", it activates the Group Policy/SRP mode. You don't need to do anything manually.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                  <ICONS.LayoutTemplate className="w-5 h-5 text-purple-400" />
                  What editions of Windows are supported?
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  <strong>All modern editions are supported:</strong> Windows 10/11 Home, Pro, Enterprise, and Education.
                  <br /><br />
                  <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>Pro/Enterprise/Education:</strong> The script leverages native Group Policy Registry keys and Software Restriction Policies (SRP) for maximum security.</li>
                    <li><strong>Windows Home:</strong> Since Home lacks Group Policy, the script automatically applies an <code>ICACLS</code> permissions workaround to block execution in user folders, ensuring they are still protected.</li>
                  </ul>
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                  <ICONS.Shield className="w-5 h-5 text-red-400" />
                  Is the Administrator account affected?
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  <strong>Generally, No.</strong> The script is designed to target <strong>Standard Users</strong>.
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                    <li>Execution Blocks (ICACLS/SRP) are applied only to Standard Users.</li>
                    <li>Desktop Hiding & UI restrictions are applied only to Standard Users.</li>
                    <li>Edge Policies are applied to user hives (though usually all users).</li>
                    <li><strong>USB Storage:</strong> Standard Users are blocked from accessing removable storage. Administrators are NOT affected (User-level Policy).</li>
                  </ul>
                  <span className="text-amber-400 mt-2 block">Exceptions (Machine-Wide):</span>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Windows Updates:</strong> This is a system-wide service setting.</li>
                  </ul>
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                  <ICONS.UserX className="w-5 h-5 text-red-400" />
                  How does "Prevent Admin Elevation" work?
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  This setting changes the behavior of UAC (User Account Control). Instead of prompting for a password when a user tries to run something as Administrator, Windows will <strong>automatically deny</strong> the request.
                  <br /><br />
                  This is crucial for BYOD environments where a user might know the Admin password. It forces them to log out and log in as Admin to perform tasks, preventing them from bypassing restrictions while logged into the restricted Standard User account.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                  <ICONS.Download className="w-5 h-5 text-emerald-400" />
                  How do I completely remove all restrictions?
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Run the <code>Restore_....ps1</code> script included in your download bundle as Administrator.
                  It will reset Registry Keys, Windows Services, File Permissions, and Power settings to their defaults. A reboot is recommended after restoring.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 6: SCRIPT PREVIEW */}
          <section id="script" className="space-y-6 pb-20">
            <div className="flex flex-col gap-2 border-b border-slate-800 pb-4">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <ICONS.Terminal className="w-8 h-8 text-slate-400" /> Script Output
              </h2>
              <p className="text-slate-400">Review, copy, or download your generated configuration.</p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800 self-start">
                  <button
                    onClick={() => setPreviewMode('LOCK')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${previewMode === 'LOCK' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Lockdown Script
                  </button>
                  <button
                    onClick={() => setPreviewMode('UNLOCK')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${previewMode === 'UNLOCK' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Restore Script
                  </button>
                </div>

                <div className="flex gap-2 self-start">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    <ICONS.Copy className="w-4 h-4" /> Copy
                  </button>
                  <button
                    onClick={handleDownloadBundle}
                    className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-cyan-500/20"
                  >
                    <ICONS.Package className="w-4 h-4" /> Download ZIP
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-hidden relative group">
                <pre className={`text-xs md:text-sm font-mono overflow-x-auto whitespace-pre p-2 max-h-[600px] ${previewMode === 'LOCK' ? 'text-cyan-300' : 'text-emerald-300'
                  }`}>
                  {previewScript}
                </pre>
                {/* Decorative glow */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.3)] rounded-xl"></div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default App;