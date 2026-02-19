# WinLocksmith 🔒

**The Ultimate Windows OS System Hardening for Work Computers / Kiosk & BYOD Devices**

![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg) ![Windows](https://img.shields.io/badge/Platform-Windows_10%2F11-0078D6.svg) ![Tech](https://img.shields.io/badge/Built_With-React_%2B_TypeScript-61DAFB.svg)

**WinLocksmith** is a powerful, open-source web application designed for System Administrators and IT Professionals to generate robust PowerShell configuration scripts for Windows 10 and Windows 11 — without needing Intune, MDM, or any other policy management software.

Whether you need to secure a public kiosk, lock down employee workstations, or harden a BYOD device, WinLocksmith generates a fully self-contained, deployable ZIP bundle with a single click.

---

## 🚀 Key Features

### 🛡️ Edition-Agnostic Hardening
WinLocksmith is smart. It inspects the target machine's Windows Edition (Home vs. Pro/Enterprise) and applies the appropriate restrictions automatically:
- **Pro/Enterprise/Education**: Leverages native Group Policy (GPO) and Software Restriction Policies (SRP).
- **Windows Home**: Uses intelligent `ICACLS` permission hardening to simulate GPO-like restrictions on user folders.

### 🌐 Advanced Edge Kiosk Mode
Turn Microsoft Edge into a secure, focused browser environment:
- **Whitelist Mode**: Allow only specific domains — everything else is blocked (`URLBlocklist: *` + `URLAllowlist` entries).
- **Blocklist Mode**: Block specific domains while allowing everything else. Ships with **61 pre-loaded domains** (social media + file-upload sites) — delete any you want to allow.
- **Preset Blocked Sites**: Includes Facebook, YouTube, TikTok, Instagram, Discord, WhatsApp, Reddit, X (Twitter), Google Drive, Dropbox, MEGA, WeTransfer, and 49 more — all removable.
- **Safe Internal Pages**: `edge://*` and `chrome-extension://*` are always allowlisted so Edge's own UI never breaks.
- **Extension Allowlist**: Block all extensions by default (`ExtensionInstallBlocklist: *`) while allowing specific ones by ID.
- **Privacy First**: Disable InPrivate mode, developer tools, guest mode, and telemetry.
- **PDF Security**: Control internal PDF viewer access via `AllowPdfView`.
- **Force Startup URLs**: Lock the homepage and startup tabs to specific URLs (whitelist mode only).

### � Force Safe DNS
Apply Cloudflare Family DNS at both the OS and browser level to block adult content and malware:
- **System-Wide**: Sets DNS on every active network adapter (Ethernet, Wi-Fi, VPN) using `Set-DnsClientServerAddress`.
- **Edge DoH**: Enforces `DnsOverHttpsMode: secure` + `DnsOverHttpsTemplates` pointing to `family.cloudflare-dns.com` — no plaintext DNS fallback.
- **DNS Servers**: `1.1.1.3` / `1.0.0.3` (IPv4) · `2606:4700:4700::1113` / `2606:4700:4700::1003` (IPv6)
- **Fully Reversible**: Restore script resets all adapters to DHCP and removes Edge DoH policies.

### �🚫 Application & Execution Control
Prevent unauthorized software from running:
- **SRP (Software Restriction Policies)**: Block executables from running in user-writable directories (Downloads, AppData, Temp, etc.).
  - **Basic Mode**: Block execution from user profile directories only.
  - **Strict Mode**: Block everything except `%WINDIR%` and `%PROGRAMFILES%`.
  - **Smart App Control detection**: Warns if SAC is active on Windows 11 (SAC overrides SRP).
- **Store Blocking**: Disable the Microsoft Store for Standard Users (Administrators retain full access).
- **Custom App Blocklist**: Ban specific executables (e.g., `discord.exe`, `steam.exe`) via `DisallowRun`.

### � User Isolation & Anti-Bypass
Features designed for hostile environments:
- **Anti-Bypass**: Deny "Run as Administrator" UAC prompts for Standard Users (`ConsentPromptBehaviorUser: 0`).
- **User Data Isolation**: Revoke Administrator access to Standard User profile folders via `ICACLS`.
- **USB Blocking**: Restrict removable storage (read + write) for Standard Users, keeping it open for Administrators.

### ⚡ Optimization & Privacy
- **Disable Telemetry**: Minimize Windows data collection (`AllowTelemetry: 0`).
- **Update Control**: Prevent automatic Windows Updates and forced reboots.
- **Power Management**: Force "Never Sleep" mode for always-on kiosks (`powercfg` all timeouts → 0).
- **UI Cleanup**: Hide desktop icons, disable right-click context menus, suppress toast notifications.
- **Block Settings/Control Panel**: Restrict access to system settings (with optional peripheral exception for Bluetooth/printers).

---

## 📦 How It Works

1. **Configure**: Use the visual interface to toggle the restrictions you need.
2. **Generate**: Click **Download ZIP** to get your deployment bundle.
3. **Deploy**:
   - Extract the ZIP on the target machine.
   - Right-click `Lockdown_<timestamp>.ps1` → **Run with PowerShell**.
   - The script auto-detects the OS edition and applies all policies.
4. **Restore**: Run `Restore_<timestamp>.ps1` to undo every change and return the system to its original state.

---

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Logic**: Pure client-side PowerShell generation — no server, no telemetry

---

## 📄 License

This project is licensed under the Apache License 2.0 — see the [LICENSE](LICENSE) file for details.
