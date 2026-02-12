import React, { useState, useMemo } from 'react';
import { ICONS } from '../constants';

interface FAQItem {
    q: string;
    a: string;
    category: string;
}

const FAQ_DATA: FAQItem[] = [
    // === Getting Started ===
    { q: "What is WinLocksmith?", a: "WinLocksmith is a free, open-source web tool that generates PowerShell scripts to harden Windows 10/11 systems, create kiosk modes, block USB drives, and enforce security policies — all without requiring Microsoft Intune or any MDM.", category: "Getting Started" },
    { q: "How do I use WinLocksmith?", a: "Go to the Configure page, toggle the settings you want (e.g. Block USB, Disable Updates), then click 'Download Bundle'. You'll get a ZIP with a Lockdown script and a Restore script. Run Lockdown.ps1 as Administrator on the target PC.", category: "Getting Started" },
    { q: "Do I need to install anything?", a: "No. WinLocksmith runs entirely in your browser. There's nothing to install, no accounts to create, and no data sent to any server.", category: "Getting Started" },
    { q: "What Windows versions are supported?", a: "Windows 10 (1809+) and Windows 11 (all builds). Both 64-bit and 32-bit are supported. ARM64 devices like Surface Pro X also work.", category: "Getting Started" },
    { q: "Is this a replacement for Microsoft Intune?", a: "For small teams, labs, and kiosks — yes. WinLocksmith covers 80% of what Intune does for device lockdown, without the $8/user/month cost. For enterprise-scale fleet management with compliance reporting, Intune is still more appropriate.", category: "Getting Started" },
    { q: "Can I use this on a personal computer?", a: "Absolutely. It's great for parental controls, shared family PCs, or just hardening your own machine against malware.", category: "Getting Started" },
    { q: "Is WinLocksmith free?", a: "Yes, 100% free and open source under the MIT License. No premium tiers, no feature gating, no ads.", category: "Getting Started" },
    { q: "Does it work offline?", a: "Yes. Once the page loads, everything runs client-side in your browser. You can even save the page for fully offline use.", category: "Getting Started" },

    // === Installation & Running ===
    { q: "Why does the script require Administrator privileges?", a: "WinLocksmith modifies System Registry keys (HKLM), Software Restriction Policies, Windows services, and power settings — all of which are protected areas that only administrators can access.", category: "Installation" },
    { q: "How do I run the script as Administrator?", a: "Right-click the .ps1 file → 'Run with PowerShell' (or open PowerShell as Admin, navigate to the folder, and type .\\Lockdown.ps1). If execution policy blocks it, run: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser first.", category: "Installation" },
    { q: "I get 'Execution Policy' error. How to fix?", a: "Run this command in an elevated PowerShell: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser. This allows locally-created scripts to run while still blocking unsigned remote scripts.", category: "Installation" },
    { q: "Can I run the script remotely via Group Policy?", a: "Yes. Place the .ps1 file on a network share and configure a GPO Startup Script pointing to it. The script will run with SYSTEM privileges at boot.", category: "Installation" },
    { q: "Does it work over WinRM / PowerShell Remoting?", a: "Yes. Use Invoke-Command -ComputerName TARGET -FilePath .\\Lockdown.ps1 to apply the configuration remotely. Ensure WinRM is enabled on the target.", category: "Installation" },
    { q: "Can I deploy this via SCCM / Endpoint Manager?", a: "Yes. Package the .ps1 file as a Win32 app or script deployment. The script exits with code 0 on success, making it compatible with SCCM detection rules.", category: "Installation" },
    { q: "What happens if the script fails midway?", a: "Each section is independent. If one registry key fails, the rest still apply. Errors are written to the console. Run the Restore script to undo any partial changes.", category: "Installation" },

    // === USB & Device Control ===
    { q: "How does USB blocking work?", a: "It sets the USBSTOR service start type to 4 (Disabled) and denies Execute permissions on the USB storage driver. This prevents any USB flash drive from mounting while allowing USB keyboards, mice, and other peripherals.", category: "USB & Devices" },
    { q: "Will blocking USB affect my keyboard and mouse?", a: "No. USB blocking only targets mass storage devices (flash drives, external HDDs). HID devices like keyboards, mice, webcams, and headsets are unaffected.", category: "USB & Devices" },
    { q: "Can I allow specific USB drives?", a: "Not through WinLocksmith directly. For device-specific whitelisting, you'd need Group Policy's Device Installation Restrictions with hardware IDs. WinLocksmith provides blanket block/allow.", category: "USB & Devices" },
    { q: "Does it block Bluetooth storage devices?", a: "The USB block specifically targets USBSTOR. Bluetooth file transfer (OBEX) is a separate protocol. To block Bluetooth, disable the Bluetooth service via the Kiosk settings.", category: "USB & Devices" },
    { q: "What about SD card readers?", a: "Internal SD card readers often appear as USB storage and will be blocked if USB blocking is enabled. External USB card readers are always blocked.", category: "USB & Devices" },
    { q: "Can users still charge phones via USB?", a: "Yes. USB charging works regardless of storage blocking because it's a power-only function. However, file transfer (MTP/PTP) will be blocked.", category: "USB & Devices" },

    // === Kiosk Mode ===
    { q: "What is Kiosk Mode?", a: "Kiosk Mode transforms a Windows PC into a dedicated single-purpose or limited-purpose device — like a hotel lobby terminal, retail POS, or exam station. It hides the desktop, disables right-click, suppresses notifications, and locks down the browser.", category: "Kiosk Mode" },
    { q: "Does it create a Windows Assigned Access kiosk?", a: "No. WinLocksmith uses a 'soft kiosk' approach via registry policies and Edge browser kiosk configuration. This is more flexible than Windows Assigned Access and works on Home edition too.", category: "Kiosk Mode" },
    { q: "Can users still access Task Manager in Kiosk Mode?", a: "Only if you leave Task Manager enabled. For a true kiosk, enable 'Disable Task Manager' in the Admin & Audit section to block Ctrl+Shift+Esc and Ctrl+Alt+Del → Task Manager.", category: "Kiosk Mode" },
    { q: "How do I set up a web-only kiosk?", a: "Enable: Enforce Edge Kiosk Mode, add your whitelisted URLs, enable Block File Uploads, Disable Context Menu, Disable Task Manager, and Block CMD/PowerShell. This creates a locked browsing-only environment.", category: "Kiosk Mode" },
    { q: "Will Windows Update break my kiosk?", a: "It can. Enable 'Disable Windows Update' in the Kiosk section to prevent automatic updates and forced reboots. For production kiosks, also disable sleep to keep the device always-on.", category: "Kiosk Mode" },
    { q: "How do I exit Kiosk Mode?", a: "Run the Restore script as Administrator. If you're locked out, boot into Safe Mode (hold Shift while clicking Restart) and run the script there.", category: "Kiosk Mode" },
    { q: "Can I schedule kiosk hours?", a: "Not directly through WinLocksmith. However, you can use Windows Task Scheduler to run the Lockdown script at business hours open and the Restore script at close.", category: "Kiosk Mode" },
    { q: "Does kiosk mode survive reboots?", a: "Yes. All changes are made to the registry and persist across reboots. The kiosk stays locked until you explicitly run the Restore script.", category: "Kiosk Mode" },

    // === Browser & Web ===
    { q: "How does Edge Kiosk Mode work?", a: "It configures Microsoft Edge policies via the registry to: restrict navigation to whitelisted URLs only, disable downloads, block file uploads, force specific startup pages, and enable SmartScreen filtering.", category: "Browser & Web" },
    { q: "Can I use Chrome instead of Edge?", a: "WinLocksmith's browser policies target Microsoft Edge specifically because Edge policies can be enforced via registry without Enterprise licensing. Chrome requires Chrome Enterprise or ADMX templates.", category: "Browser & Web" },
    { q: "What does 'Block Other Browsers' do?", a: "It adds Chrome, Firefox, Brave, Opera, Vivaldi, and Tor to the Software Restriction Policy deny list, preventing them from launching. Only Edge will be usable.", category: "Browser & Web" },
    { q: "Can users bypass URL restrictions?", a: "Edge policy-level URL filtering is robust. However, a determined user with admin access could modify registry keys. For maximum security, also block Registry Editor and CMD/PowerShell.", category: "Browser & Web" },
    { q: "Does it block incognito/InPrivate mode?", a: "Yes, when Edge Kiosk is enabled, InPrivate browsing is disabled by policy. Users cannot open InPrivate windows.", category: "Browser & Web" },
    { q: "Can I allow browser extensions?", a: "Yes. Add extension IDs in the 'Allowed Extensions' field. Only these extensions will be installable. All others are blocked by policy.", category: "Browser & Web" },
    { q: "What does 'Force SmartScreen' do?", a: "It enables Microsoft Defender SmartScreen in Edge, which blocks known phishing sites, malicious downloads, and potentially unwanted apps. It cannot be disabled by the user.", category: "Browser & Web" },
    { q: "Will whitelisted URLs work with subdomains?", a: "Yes. If you whitelist 'example.com', it will allow example.com, www.example.com, app.example.com, and all other subdomains.", category: "Browser & Web" },

    // === Security & Administration ===
    { q: "What does 'Prevent Admin Elevation' do?", a: "It sets ConsentPromptBehaviorUser to 0, which automatically denies UAC elevation prompts for standard users. They can never 'Run as Administrator' — even with the admin password.", category: "Security" },
    { q: "What does 'Isolate User Folders' do?", a: "It removes administrator-level access from the user's profile folder using ICACLS. This means even local admins cannot browse other users' Documents, Desktop, or Downloads folders.", category: "Security" },
    { q: "Can I block specific applications?", a: "Yes. Use the 'Block Specific Apps' toggle in Admin & Audit, then add executable names (e.g. notepad.exe, steam.exe). These are enforced via Software Restriction Policies.", category: "Security" },
    { q: "What is Software Restriction Policy (SRP)?", a: "SRP is a Windows feature that controls which programs can run. WinLocksmith uses SRP to block executables from running in user-writable locations (Downloads, Desktop, AppData) — a powerful anti-malware technique.", category: "Security" },
    { q: "Does blocking executables affect installed programs?", a: "No. Programs installed in 'C:\\Program Files' and 'C:\\Windows' are always allowed. SRP only blocks executables in user folders like Downloads and Desktop.", category: "Security" },
    { q: "What does 'Disable Telemetry' do?", a: "It sets the DiagTrack service to disabled, sets AllowTelemetry to 0, and disables Connected User Experiences. This minimizes data that Windows sends to Microsoft.", category: "Security" },
    { q: "Is this script safe to run on production machines?", a: "Yes, with caution. Always test on a non-critical machine first. Every download includes a Restore script that completely reverses all changes. We recommend keeping the Restore script on a USB drive as backup.", category: "Security" },

    // === Recovery & Troubleshooting ===
    { q: "How do I remove all restrictions?", a: "Run the Restore.ps1 script included in your download bundle as Administrator. It resets every registry key, re-enables services, restores permissions, and resets power settings. A reboot is recommended after.", category: "Recovery" },
    { q: "I'm locked out of my computer. What do I do?", a: "Boot into Safe Mode: hold Shift → click Restart → Troubleshoot → Startup Settings → Enable Safe Mode. In Safe Mode, policies don't apply. Run the Restore script as Administrator.", category: "Recovery" },
    { q: "The Restore script didn't fix everything. What now?", a: "Some changes (like ICACLS folder permissions) may need manual reversal. Open an elevated CMD and run: icacls C:\\Users\\USERNAME /reset /T /C to restore default folder permissions.", category: "Recovery" },
    { q: "Can I partially restore (undo only specific settings)?", a: "The current Restore script is all-or-nothing. For selective rollback, you'll need to manually edit the registry keys. Each setting in the generated script includes comments explaining which keys it modifies.", category: "Recovery" },
    { q: "Will a Windows Reset remove WinLocksmith changes?", a: "Yes. A Windows Reset (Keep my files or Remove everything) will reset all registry policies, services, and permissions back to defaults.", category: "Recovery" },
    { q: "Does System Restore undo WinLocksmith changes?", a: "Partially. System Restore reverts registry keys but may not restore ICACLS permission changes or service configurations. Use the Restore script instead for a complete reversal.", category: "Recovery" },

    // === Compatibility ===
    { q: "Does this work on Windows Home Edition?", a: "Yes! WinLocksmith detects Windows Home and uses a Compatibility Mode. Instead of Group Policy (not available on Home), it applies restrictions using ICACLS (file permissions) and direct registry manipulation.", category: "Compatibility" },
    { q: "Does it work on Windows Server?", a: "The scripts are designed for Windows 10/11 desktop. They may work on Server 2019/2022 but haven't been tested. Server-specific features like RDS policies are not included.", category: "Compatibility" },
    { q: "Does it conflict with existing Group Policies?", a: "WinLocksmith writes to the same registry locations as Group Policy. If a domain GPO sets the same key, the GPO will win on next policy refresh (every 90 minutes). For domain-joined PCs, coordinate with your IT team.", category: "Compatibility" },
    { q: "Does it work with third-party antivirus?", a: "Yes. WinLocksmith doesn't touch antivirus settings. Some AV products may flag the PowerShell script as suspicious — add an exclusion or review the script source (it's all open source).", category: "Compatibility" },
    { q: "Will it work on ARM-based Windows devices?", a: "Yes. All changes are registry-based and architecture-independent. Surface Pro X, Lenovo ThinkPad X13s, and other ARM64 devices are supported.", category: "Compatibility" },
    { q: "Does it support multi-user environments?", a: "Registry policies applied under HKLM affect all users on the machine. For per-user restrictions, you'd need to apply policies under each user's HKCU hive, which requires running the script in each user's context.", category: "Compatibility" },
];

const CATEGORIES = ['All', ...Array.from(new Set(FAQ_DATA.map(f => f.category)))];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    'All': <ICONS.HelpCircle className="w-3.5 h-3.5" />,
    'Getting Started': <ICONS.Play className="w-3.5 h-3.5" />,
    'Installation': <ICONS.Download className="w-3.5 h-3.5" />,
    'USB & Devices': <ICONS.Usb className="w-3.5 h-3.5" />,
    'Kiosk Mode': <ICONS.Monitor className="w-3.5 h-3.5" />,
    'Browser & Web': <ICONS.Globe className="w-3.5 h-3.5" />,
    'Security': <ICONS.Shield className="w-3.5 h-3.5" />,
    'Recovery': <ICONS.RotateCcw className="w-3.5 h-3.5" />,
    'Compatibility': <ICONS.Puzzle className="w-3.5 h-3.5" />,
};

const FAQ: React.FC = () => {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const filtered = useMemo(() => {
        const term = search.toLowerCase().trim();
        return FAQ_DATA.filter(item => {
            const categoryMatch = activeCategory === 'All' || item.category === activeCategory;
            if (!categoryMatch) return false;
            if (!term) return true;
            return item.q.toLowerCase().includes(term) || item.a.toLowerCase().includes(term);
        });
    }, [search, activeCategory]);

    const highlight = (text: string) => {
        if (!search.trim()) return text;
        const regex = new RegExp(`(${search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, i) =>
            regex.test(part) ? <mark key={i} className="bg-sky-500/20 dark:bg-sky-400/20 text-inherit rounded px-0.5">{part}</mark> : part
        );
    };

    return (
        <div className="py-12 px-4 max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-3 mb-10">
                <h1 className="text-3xl md:text-4xl font-bold dark:text-white text-zinc-900 tracking-tight">
                    Help & FAQ
                </h1>
                <p className="text-base dark:text-zinc-400 text-zinc-600 max-w-2xl mx-auto">
                    Everything you need to know about WinLocksmith — search across {FAQ_DATA.length} answers.
                </p>
            </div>

            {/* Search Bar — Algolia style */}
            <div className="relative mb-6 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 dark:text-zinc-500 text-zinc-400 transition-colors group-focus-within:text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search FAQ... (e.g. &quot;USB&quot;, &quot;kiosk mode&quot;, &quot;restore&quot;)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 dark:bg-zinc-900/60 bg-white border dark:border-zinc-800 border-zinc-200 rounded-xl text-sm dark:text-zinc-200 text-zinc-800 placeholder:dark:text-zinc-600 placeholder:text-zinc-400 outline-none focus:dark:border-sky-500/50 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 transition-all shadow-sm dark:shadow-none"
                    aria-label="Search frequently asked questions"
                />
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center dark:text-zinc-500 text-zinc-400 hover:text-rose-500 transition-colors"
                        aria-label="Clear search"
                    >
                        <ICONS.XCircle className="w-4 h-4" />
                    </button>
                )}
                {/* Keyboard shortcut hint */}
                {!search && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-mono dark:text-zinc-600 text-zinc-400 dark:bg-zinc-800 bg-zinc-100 rounded border dark:border-zinc-700 border-zinc-200">
                            /
                        </kbd>
                    </div>
                )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="FAQ categories">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
                        role="tab"
                        aria-selected={activeCategory === cat}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${activeCategory === cat
                            ? 'dark:bg-sky-500/10 bg-sky-50 dark:text-sky-400 text-sky-700 dark:border-sky-500/20 border-sky-200'
                            : 'dark:bg-zinc-900/40 bg-white dark:text-zinc-500 text-zinc-600 dark:border-zinc-800 border-zinc-200 dark:hover:text-zinc-300 hover:text-zinc-900 dark:hover:border-zinc-700 hover:border-zinc-300'
                            }`}
                    >
                        {CATEGORY_ICONS[cat]} {cat}
                        <span className={`ml-0.5 text-[10px] ${activeCategory === cat ? 'dark:text-sky-400/60 text-sky-600/60' : 'dark:text-zinc-600 text-zinc-400'}`}>
                            {cat === 'All' ? FAQ_DATA.length : FAQ_DATA.filter(f => f.category === cat).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Results count */}
            {search && (
                <p className="text-sm dark:text-zinc-500 text-zinc-500 mb-4">
                    {filtered.length === 0 ? 'No results found' : `${filtered.length} result${filtered.length !== 1 ? 's' : ''} found`}
                    {search && <> for "<span className="dark:text-sky-400 text-sky-600 font-medium">{search}</span>"</>}
                </p>
            )}

            {/* FAQ Items */}
            <div className="space-y-2" role="list">
                {filtered.map((item, i) => {
                    const globalIndex = FAQ_DATA.indexOf(item);
                    const isOpen = openIndex === globalIndex;
                    return (
                        <article
                            key={globalIndex}
                            className={`dark:bg-zinc-900/40 bg-white border rounded-xl transition-all duration-200 ${isOpen
                                ? 'dark:border-sky-500/20 border-sky-200 shadow-sm dark:shadow-sky-500/5'
                                : 'dark:border-zinc-800/40 border-zinc-200 hover:dark:border-zinc-700/60 hover:border-zinc-300'
                                }`}
                            role="listitem"
                        >
                            <button
                                onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                                className="w-full flex items-start gap-3 p-4 text-left"
                                aria-expanded={isOpen}
                            >
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isOpen ? 'dark:bg-sky-500/10 bg-sky-50' : 'dark:bg-zinc-800 bg-zinc-100'}`} aria-hidden="true">
                                    <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-sky-500' : 'dark:text-zinc-500 text-zinc-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold dark:text-white text-zinc-900 leading-snug">
                                        {highlight(item.q)}
                                    </h3>
                                    {!isOpen && (
                                        <span className="inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded dark:bg-zinc-800 bg-zinc-100 dark:text-zinc-500 text-zinc-500">
                                            {item.category}
                                        </span>
                                    )}
                                </div>
                            </button>
                            {isOpen && (
                                <div className="px-4 pb-4 pl-[52px]">
                                    <p className="text-sm dark:text-zinc-400 text-zinc-600 leading-relaxed">
                                        {highlight(item.a)}
                                    </p>
                                    <span className="inline-block mt-3 text-[10px] font-medium px-2 py-0.5 rounded dark:bg-zinc-800 bg-zinc-100 dark:text-zinc-500 text-zinc-500">
                                        {item.category}
                                    </span>
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
                <div className="text-center py-16 space-y-3">
                    <div className="w-14 h-14 mx-auto rounded-2xl dark:bg-zinc-800 bg-zinc-100 flex items-center justify-center" aria-hidden="true">
                        <ICONS.HelpCircle className="w-6 h-6 dark:text-zinc-600 text-zinc-400" />
                    </div>
                    <p className="text-sm dark:text-zinc-500 text-zinc-500">No matching questions found.</p>
                    <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="text-sm text-sky-500 hover:text-sky-400 font-medium transition-colors">
                        Clear filters
                    </button>
                </div>
            )}

            {/* Contact CTA */}
            <div className="mt-12 text-center dark:bg-zinc-900/40 bg-zinc-50 border dark:border-zinc-800/40 border-zinc-200 rounded-xl p-8">
                <h2 className="text-lg font-semibold dark:text-white text-zinc-900 mb-2">Still have questions?</h2>
                <p className="text-sm dark:text-zinc-400 text-zinc-600 mb-4">
                    Open an issue on GitHub and we'll help you out.
                </p>
                <a
                    href="https://github.com/boopathirbk/winlocksmith/issues/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-sm font-semibold transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                >
                    <ICONS.Github className="w-4 h-4" aria-hidden="true" /> Open an Issue
                </a>
            </div>
        </div>
    );
};

export default FAQ;
