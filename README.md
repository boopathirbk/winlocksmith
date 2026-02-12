# WinLocksmith 🔒

**The Ultimate Windows OS System Hardening for Work Computers / Kiosk & BYOD Devices**

![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg) ![Windows](https://img.shields.io/badge/Platform-Windows_10%2F11-0078D6.svg) ![Tech](https://img.shields.io/badge/Built_With-React_Request_TS-61DAFB.svg)

**WinLocksmith** is a powerful, open-source web application designed for System Administrators and IT Professionals to generate robust PowerShell configuration scripts for Windows 10 and 11 without needing to use Intune, MDM or any other Windows OS policy Provider. 

Whether you need to secure a public kiosk, lock down employee workstations, or harden a BYOD device, WinLocksmith generates a deployable ZIP bundle with a single click.

---

## 🚀 Key Features

### 🛡️ Edition-Agnostic Hardening
WinLocksmith is smart. It inspects the target machine's Windows Edition (Home vs. Pro/Enterprise) and applies the appropriate restrictions automatically:
- **Pro/Enterprise/Education**: Leverages native Group Policy (GPO) and Software Restriction Policies (SRP).
- **Windows Home**: Uses intelligent `ICACLS` permission hardening to simulate GPO-like restrictions on user folders.

### 🌐 Advanced Edge Kiosk Mode
Turn Microsoft Edge into a secure, focused browser environment:
- **Strict Whitelisting**: Allow only specific domains or URLs.
- **Extension Control**: Block all extensions or allow only specific IDs.
- **Privacy First**: Disable telemetry, guest mode, and developer tools.
- **PDF Security**: Control internal PDF viewer access.

### 🚫 Application & Execution Control
Prevent unauthorized software from running:
- **SRP (Software Restriction Policies)**: Block executables from running in user-writable directories (Downloads, AppData, etc.).
- **Store Blocking**: Disable the Microsoft Store and pre-installed "Consumer Features" (like Candy Crush).
- **Custom Blocklist**: Ban specific applications (e.g., `discord.exe`, `steam.exe`).

### 🔒 User Isolation & Anti-Bypass
Features designed for hostile environments:
- **Anti-Bypass**: Automatically deny "Run as Administrator" requests for Standard Users, preventing privilege escalation attempts.
- **User Data Isolation**: Revoke Administrator access to Standard User profile folders to ensure privacy and auditability.
- **USB Blocking**: Restrict removable storage access for Standard Users while keeping it open for Administrators.

### ⚡ Optimization & Privacy
- **Disable Telemetry**: Minimize Windows data collection.
- **Update Control**: Prevent automatic Windows Updates/Reboots.
- **Power Management**: Force "Never Sleep" mode for always-on kiosks.
- **UI Cleanup**: Hide desktop icons, context menus, and toast notifications.

---

## 📦 How It Works

1.  **Configure**: Use the visual interface to toggle the restrictions you need.
2.  **Generate**: Click "Download ZIP" to get your deployment bundle.
3.  **Deploy**:
    -   Extract the ZIP on the target machine.
    -   Right-click `Lockdown_<timestamp>.ps1` and select **Run with PowerShell**.
    -   The script will detect the OS edition and apply all policies.
4.  **Restore**: Run `Restore_<timestamp>.ps1` to undo all changes and return the system to its original state.

---

## 🛠️ Technology Stack

Built with modern web technologies for performance and reliability:
-   **Frontend**: React 19 + TypeScript
-   **Build Tool**: Vite
-   **Styling**: TailwindCSS
-   **Icons**: Lucide React
-   **Logic**: Pure client-side PowerShell generation

---

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
